"use client"

import { trpc } from "@/trpc/client"

export const DashboardHello = () => {
  const [data] = trpc.invoice.getMany.useSuspenseQuery()
  return (
    <div>
      {JSON.stringify(data)}
    </div>
  )
}

