import { generateObject } from "ai"
import { trpc } from "@/trpc/server"
import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { tasks } from "@trigger.dev/sdk/v3"
import { jobGetPdfData } from "@/trigger/job-get-pdf-data"

// TODO: proteger a rota

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const path = folder ? `${folder}/${file.name}` : file.name

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: true,
      multipart: true,
    })

    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session) {
      return NextResponse.json({ message: "no valid session" })
    }

    const { invoice } = await trpc.invoice.create({
      userId: session?.user.id,
      documentUrl: blob.url
    })

    // TODO: fazer queu de uploads...

    const bgJob = await tasks.trigger<typeof jobGetPdfData>(
      "get-pdf-data", { docUrl: blob.url, userId: session.user.id, invoiceId: invoice.id }
    )

    return NextResponse.json({ data: invoice })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 })
  }
}
