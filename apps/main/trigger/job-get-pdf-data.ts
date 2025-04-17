import { anthropic } from "@ai-sdk/anthropic"
import { logger, task, wait } from "@trigger.dev/sdk/v3";
import { generateObject } from "ai";
import { z } from "zod";

export const invoiceWebhookSchema = z.object({
  invoiceNumber: z.string(),
  issueDate: z.string().describe("Invoice issue date"),
  dueDate: z.string().describe("Invoice due date (usually when invoice must be paid, when payment was done)"),
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
  currency: z.string().nullable().describe("Three-letter ISO 4217 currency code (e.g., USD, EUR)"),
  subtotalAmount: z.number().describe("Amount excluding tax"),
  taxAmount: z.number().describe("Taxes amount"),
  totalAmount: z.number().describe("Total amount including tax"),
  paymentMethod: z.string().optional().describe("Payment method used"),
  paymentTerms: z.string().optional(),
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

    const result = await generateObject<InvoiceWebhookData>({
      model: anthropic("claude-3-5-haiku-latest"),
      schema: invoiceWebhookSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "You are an expert multilingual document parser specialized in extracting structured data from financial documents, either invoices or receipts. All the data must be inferred on the document itself, not by it's name or similar, find all the relevant data on document content. Take special attention to the dates, its really important. If you cant find the payment method return 'Not specified', if it's credit card return 'Credit Card', and so on proper naming convention. Some documents got dates on header and footer of the document, I want you to ignore this dates and use the dates on the body of the document, mapping similar terms (example, if you can't find 'due date' try search with similar terms like 'payment recieved'",
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

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append("x-webhook-token", process.env.WEBHOOK_SECRET_TOKEN!)

    await fetch(process.env.PDF_DATA_WEBHOOK!,
      {
        method: "post",
        headers: myHeaders,
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
