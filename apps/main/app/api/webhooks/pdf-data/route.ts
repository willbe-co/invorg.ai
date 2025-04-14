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

    console.log("from webhook: ", data)

    let vendorExists = null
    if (data.vendor && data.vendor.name) {
      const tempRes = await trpc.vendor.getByName({ name: data.vendor.name, userId: res.userId })

      vendorExists = tempRes.data
      if (!vendorExists) {
        const { vendor } = await trpc.vendor.create({
          name: data.vendor.name,
          address: data.vendor.address,
          email: data.vendor.contactInfo,
          userId: res.userId
        })
        vendorExists = vendor
      }
    }

    if (data.invoiceNumber) {
      const tempRes = await trpc.invoice.getByInvoiceNumber({ invoiceNumber: data.invoiceNumber, userId: res.userId })

      if (tempRes.data) {
        await trpc.invoice.update({
          id: res.invoiceId,
          state: "duplicated",
          dueDate: new Date(tempRes.data.dueDate),
          issueDate: new Date(tempRes.data.issueDate),
          paymentTerms: tempRes.data.paymentTerms || "",
          subtotalAmount: tempRes.data.subtotalAmount || data.subtotalAmount * 1000,
          taxAmount: tempRes.data.taxAmount || data.taxAmount * 1000,
          totalAmount: tempRes.data.totalAmount || data.totalAmount * 1000,
          vendorId: vendorExists?.id
        })
        return NextResponse.json({ error: "Invoice allready exists" }, { status: 400 })
      }
    }


    const { invoice } = await trpc.invoice.update({
      id: res.invoiceId,
      invoiceNumber: data.invoiceNumber,
      dueDate: new Date(data.dueDate),
      issueDate: new Date(data.issueDate),
      paymentTerms: data.paymentTerms || "",
      state: "processed",
      subtotalAmount: data.subtotalAmount * 1000,
      taxAmount: data.taxAmount * 1000,
      totalAmount: data.totalAmount * 1000,
      vendorId: vendorExists?.id
    })




    return NextResponse.json({ data: invoice })
  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json({ error: "Error updating invoice" }, { status: 500 })
  }
}
