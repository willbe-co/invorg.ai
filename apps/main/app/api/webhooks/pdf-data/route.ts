import { trpc } from "@/trpc/server"
import { NextRequest, NextResponse } from "next/server"
import { invoiceWebhookSchema } from "@/trigger/job-get-pdf-data"
import { z } from "zod"

const reqSchema = z.object({
  userId: z.string(),
  invoiceId: z.string(),
  data: invoiceWebhookSchema
})
type ReqType = z.infer<typeof reqSchema>

export async function POST(req: NextRequest) {
  try {
    const res = await req.json() as ReqType

    const data = res.data

    const { invoice } = await trpc.invoice.update({
      id: res.invoiceId,
      invoiceNumber: data.invoiceNumber,
      dueDate: new Date(data.dueDate),
      issueDate: new Date(data.issueDate),
      paymentTerms: data.paymentTerms || "",
      state: "processed",
      subtotalAmount: data.subtotalAmount,
      taxAmount: data.taxAmount,
      totalAmount: data.totalAmount,
    })

    return NextResponse.json({ data: invoice })
  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json({ error: "Error updating invoice" }, { status: 500 })
  }
}
