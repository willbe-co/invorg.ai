"use client"

import { Button } from "@/components/ui/button"
import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { toast } from "sonner"

export const InvoiceListSection = () => {
  const [data] = trpc.invoice.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })
  const utils = trpc.useUtils()
  const create = trpc.invoice.create.useMutation({
    onSuccess: () => {
      toast.success("Invoice created")
      utils.invoice.getMany.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  return (
    <div>
      Invoice list section
      <Button onClick={() => create.mutate()} disabled={create.isPending}>Create invoice</Button>
      {JSON.stringify(data)}
    </div>
  )
}
