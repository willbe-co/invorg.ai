"use client"

import { Button } from "@/components/ui/button"
import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { toast } from "sonner"
import { ErrorBoundary } from "react-error-boundary"
import { InfiniteScroll } from "@/components/infinite-scroll"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export const InvoiceListSection = () => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Error...</div>}>
        <InvoiceListSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  )

}

const InvoiceListSectionSuspense = () => {
  const [data, query] = trpc.invoice.getMany.useSuspenseInfiniteQuery({
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
      <Button onClick={() => create.mutate()} disabled={create.isPending}>Create invoice</Button>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Date</TableHead>
              <TableHead className="">Vendor</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pages.flatMap((page) => page.items).map((invoice) => (
              <Link href={`/invoice/${invoice.id}`} key={invoice.id} legacyBehavior>
                <TableRow className="cursor-pointer">
                  <TableCell>
                    {invoice.dueDate.toISOString()}
                  </TableCell>
                  <TableCell>
                    {invoice.vendorId}
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.totalAmount}
                  </TableCell>
                </TableRow>
              </Link>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* {JSON.stringify(data)} */}
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  )
}
