import { anthropic } from "@ai-sdk/anthropic"
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

    const downloadResponse = await fetch(docUrl)

    if (!downloadResponse.ok) {
      throw new Error("Error download pdf")
    }
    const buffer = await downloadResponse.arrayBuffer()
    const pdfBuffer = Buffer.from(buffer)

    const result = await generateObject<InvoiceWebhookData>({
      model: anthropic("claude-3-5-haiku-latest"),
      schema: invoiceWebhookSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract the structured invoice data from this PDF. Include all relevant fields like invoice number, dates, vendor details, client details, line items, and payment information.",
            },
            {
              type: "file",
              data: pdfBuffer,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
    })

    logger.info(JSON.parse(JSON.stringify(result.object)))

    await fetch(`https://e8e8-2001-818-dfa6-9200-ca0-d3c-4cbf-27c0.ngrok-free.app/api/webhooks/pdf-data`,
      {
        method: "post",
        body: JSON.stringify({
          userId,
          invoiceId,
          data: {
            ...result.object
          }
        })
      }
    )

    return {
      message: JSON.stringify(result.object),
    }
  },
});
