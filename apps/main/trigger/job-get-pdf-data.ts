// import { anthropic } from "@ai-sdk/anthropic"
import { mistral } from "@ai-sdk/mistral"
import { logger, task, wait } from "@trigger.dev/sdk/v3";
import { generateObject } from "ai";
import { z } from "zod";

export const invoiceWebhookSchema = z.object({
  invoiceNumber: z.string(),
  issueDate: z.string(),
  dueDate: z.string(),
  vendor: z.object({
    name: z.string(),
    address: z.string(),
    contactInfo: z.string(),
  }),
  client: z.object({
    name: z.string(),
    address: z.string(),
  }),
  items: z.array(
    z.object({
      description: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      amount: z.number(),
    }),
  ),
  currency: z.string().nullable().describe("Three-lettter ISO 4217 currency code (e.g., USD, EUR)"),
  subtotalAmount: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
  paymentTerms: z.string().optional(),
  paymentInstructions: z
    .object({
      bankName: z.string().optional(),
      accountNumber: z.string().optional(),
      routingNumber: z.string().optional(),
      swift: z.string().optional(),
    })
    .optional(),
})

type InvoiceWebhookData = z.infer<typeof invoiceWebhookSchema>

type Props = {
  docUrl: string,
  userId: string,
  invoiceId: string
}

export const jobGetPdfData = task({
  id: "get-pdf-data",
  maxDuration: 10000,
  run: async (payload: Props, { ctx }) => {
    const { docUrl, userId, invoiceId } = payload

    // const downloadResponse = await fetch(docUrl)
    //
    // if (!downloadResponse.ok) {
    //   throw new Error("Error download pdf")
    // }
    // const buffer = await downloadResponse.arrayBuffer()
    // const pdfBuffer = Buffer.from(buffer)

    const result = await generateObject<InvoiceWebhookData>({
      model: mistral("mistral-small-latest"),
      schema: invoiceWebhookSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "You are an expert multilingual document parser specialized in extracting structured data from financial documents, either invoices or receipts",
            },
            {
              type: "file",
              data: new URL(docUrl),
              mimeType: "application/pdf",
            },
          ],
        },
      ],
    })

    logger.info(JSON.parse(JSON.stringify(result.object)))

    await fetch(process.env.PDF_DATA_WEBHOOK!,
      {
        method: "post",
        body: JSON.stringify({
          userId,
          invoiceId,
          data: {
            ...result.object,
          }
        })
      }
    )

    return {
      message: JSON.stringify(result.object),
    }
  },
});
