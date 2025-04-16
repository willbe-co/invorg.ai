import { type NextRequest, NextResponse } from "next/server"

// Store connected clients
const clients = new Set<ReadableStreamController<Uint8Array>>()

// Function to broadcast updates to all connected clients
export function broadcastUpdate(data: any) {
  const message = `data: ${JSON.stringify(data)}\n\n`
  clients.forEach((controller) => {
    controller.enqueue(new TextEncoder().encode(message))
  })
}

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller)

      // Send initial connection message
      controller.enqueue(new TextEncoder().encode('data: {"type":"connected"}\n\n'))

      // Remove client when connection is closed
      request.signal.addEventListener("abort", () => {
        clients.delete(controller)
      })
    },
  })

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

