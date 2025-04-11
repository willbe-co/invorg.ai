import { trpc } from "@/trpc/server"
import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

// TODO: proteger a rota

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create path with folder if provided
    const path = folder ? `${folder}/${file.name}` : file.name

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: true,
      multipart: true,
    })

    // TODO: criar entrada da invoice na bd


    await trpc.invoice.create({
      userId: "123",
      vendorId: "123",
      documentUrl: blob.url
    })
    // await services.images.create({ url: blob.url, name: blob.pathname.split("/")[1] })

    return NextResponse.json(blob)
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 })
  }
}
