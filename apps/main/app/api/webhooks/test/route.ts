import { trpc } from "@/trpc/server"
import { NextRequest, NextResponse } from "next/server"
import { invoiceWebhookSchema } from "@/trigger/job-get-pdf-data"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { revalidateTag } from "next/cache"
import { broadcastUpdate } from "../../broadcast-updates/route"

const reqSchema = z.object({
  message: z.string()

})
type ReqType = z.infer<typeof reqSchema>

export async function POST(req: NextRequest) {
  try {
    const res = await req.json() as ReqType

    const data = res.message



    return NextResponse.json({ data: data })
  } catch (error) {
    console.error("Error updating invoice:", error)

    return NextResponse.json({ error: "Error updating invoice" }, { status: 500 })
  }
}
