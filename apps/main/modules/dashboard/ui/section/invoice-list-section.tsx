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
import { Badge } from "@/components/ui/badge"
import { LoaderIcon } from "lucide-react"
import { format } from "date-fns"

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
      {/* <Button onClick={() => create.mutate()} disabled={create.isPending}>Create invoice</Button> */}
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-52">Date</TableHead>
              <TableHead className="">Vendor</TableHead>
              <TableHead className="">Contact email</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-32 text-center">State</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pages.flatMap((page) => page.items).map((invoice) => (
              <Link href={`/invoice/${invoice.id}`} key={invoice.id} legacyBehavior prefetch={true}>
                <TableRow className="cursor-pointer">
                  <TableCell>
                    {format(invoice.dueDate, "PPP")}
                  </TableCell>
                  <TableCell>
                    {invoice.vendor?.name}
                  </TableCell>
                  <TableCell>
                    {invoice.vendor?.email}
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.totalAmount && ((invoice.totalAmount || 0) > 0) ?
                      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
                        .format((invoice.totalAmount / 1000 || 0)) :
                      '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    {
                      invoice.state === "processing" &&
                      <Badge variant={"processing"} >
                        <LoaderIcon className="animate-spin" />
                        Processing
                      </Badge>
                    }
                    {
                      invoice.state === "duplicated" &&
                      <Badge variant={"warning"}>
                        Duplicated
                      </Badge>
                    }
                    {
                      invoice.state === "processed" &&
                      <Badge variant={"success"}>
                        Validated
                      </Badge>
                    }
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
