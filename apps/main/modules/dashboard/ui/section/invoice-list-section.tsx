"use client"

import { Button } from "@/components/ui/button"
import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { toast } from "sonner"
import { ErrorBoundary } from "react-error-boundary"
import { InfiniteScroll } from "@/components/infinite-scroll"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { LoaderIcon } from "lucide-react"
import { format } from "date-fns"
import { useInvoiceFilterParams } from "@/modules/invoice/hooks/use-invoice-filter-params"

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
  const { setParams, vendor_id, vendor_query, state, start_date, end_date } = useInvoiceFilterParams()

  const [data, query] = trpc.invoice.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT,
    vendor_id,
    vendor_query,
    state,
    start_date,
    end_date
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  })

  const totalItems = data.pages.reduce((count, page) => count + page.items.length, 0)
  const isFiltering = vendor_query || vendor_id || state || start_date || end_date

  return (
    <div>
      <div className="text-xs pb-2">
        <div>
          Showing {totalItems} {isFiltering ? "filtered" : ""} invoices
        </div>
      </div>
      <div className="border-y">
        {totalItems === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            {isFiltering ?
              "No invoices match your filters" :
              "No invoices found. Upload some invoices to get started."}
          </div>
        ) : (
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
              {data.pages.flatMap((page) => page.items).map((invoice, index) => (
                <Link href={`/invoice/${invoice.id}`} key={invoice.id + index} legacyBehavior prefetch={true}>
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
        )}
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
