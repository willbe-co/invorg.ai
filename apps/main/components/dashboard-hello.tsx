"use client"

import { trpc } from "@/trpc/client"

export const DashboardHello = () => {
  const [data] = trpc.hello.useSuspenseQuery({ text: "Rica" })
  return (
    <div>
      {data.greeting}
    </div>
  )
}

