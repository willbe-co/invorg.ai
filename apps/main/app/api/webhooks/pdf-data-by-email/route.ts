import { trpc } from "@/trpc/server"
import { NextRequest, NextResponse } from "next/server"
import { jobGetPdfData } from "@/trigger/job-get-pdf-data"
import { PostmarkInboundEmail, postmarkInboundEmailSchema } from "@/modules/email/schemas"
import { tasks } from "@trigger.dev/sdk/v3"
import { put } from "@vercel/blob"

const reqSchema = postmarkInboundEmailSchema
type ReqType = PostmarkInboundEmail

export async function POST(req: NextRequest) {
  try {
    const data = await req.json() as ReqType

    console.log("------------------------------")
    console.log("from webhook email: ", data)
    console.log("------------------------------")

    const from = data.From
    if (!from) {
      return NextResponse.json({ error: "No email" }, { status: 400 })
    }

    const attachments = data.Attachments
    if (!attachments || attachments.length === 0) {
      return NextResponse.json({ error: "No attachment" }, { status: 400 })
    }

    const userExist = await trpc.user.getIdByEmail({ email: from })
    const userId = userExist.data.id

    for (let i = 0; i < attachments.length; i++) {
      const attach = attachments[i]

      const base64Data = attach.Content.replace(/^data:application\/pdf;base64,/, '')

      const binaryData = Buffer.from(base64Data, 'base64');

      const fileName = `${userId}/${attach.ContentID}`
      const blob = await put(fileName, binaryData, {
        contentType: 'application/pdf',
        access: 'public', // or 'private'
      });

      const docUrl = blob.url

      const { invoice: createdInvoice } = await trpc.invoice.create({
        userId,
        documentUrl: docUrl
      })


      await tasks.trigger<typeof jobGetPdfData>(
        "get-pdf-data", { docUrl, userId, invoiceId: createdInvoice.id }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error("Error parsign email:", error)
    return NextResponse.json({ error: "Error parsing email" }, { status: 500 })
  }
}
