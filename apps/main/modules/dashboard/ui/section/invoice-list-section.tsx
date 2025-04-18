"use client"

import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { Suspense, useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { InfiniteScroll } from "@/components/infinite-scroll"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { FileIcon, LoaderIcon, TriangleAlert, UploadIcon } from "lucide-react"
import { format } from "date-fns"
import { useInvoiceFilterParams } from "@/modules/invoice/hooks/use-invoice-filter-params"
import { Skeleton } from "@/components/ui/skeleton"
import pusherClient from "@/lib/pusher"
import { useRouter } from "next/navigation"

export const InvoiceListSection = () => {

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ErrorBoundary fallback={<div>Error...</div>}>
        <InvoiceListSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  )

}

const InvoiceListSectionSuspense = () => {
  const { setParams, vendor_id, vendor_query, state, start_date, end_date } = useInvoiceFilterParams()
  const router = useRouter()

  const [data, query] = trpc.invoice.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT,
    vendor_id: vendor_id || undefined,
    vendor_query: vendor_query || undefined,
    state: state || undefined,
    start_date: start_date || undefined,
    end_date: end_date || undefined
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  })

  const totalItems = data.pages.reduce((count, page) => count + page.items.length, 0)
  const isFiltering = vendor_query || vendor_id || state || start_date || end_date

  useEffect(() => {
    const channel = pusherClient.subscribe("update-state-channel")
    channel.bind("update-state", () => {
      router.refresh()
    })
    return () => {
      pusherClient.unsubscribe("update-state-channel")
    }

  }, [])
  return (
    <div>
      <div className="text-xs pb-2 px-4 @6xl:px-8">
        <div>
          Showing {totalItems} {isFiltering ? "filtered" : ""} invoices
        </div>
      </div>
      <div className="border-y">
        {totalItems === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            {isFiltering ?
              <div className="flex flex-wrap gap-2 justify-center ">
                <div className="flex gap-1 items-center">
                  <TriangleAlert size={16} />
                  No invoices found.
                </div>
              </div>
              :
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-2 justify-center ">
                  <div className="flex gap-1 items-center">
                    <TriangleAlert size={16} />
                    No invoices found.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center ">
                  <div>
                    Upload invoices
                  </div>
                  <Link href="/upload" className="border-b-2 font-semibold flex gap-1 items-center"> <UploadIcon size={16} /> here</Link>
                  <div>
                    to get started.
                  </div>
                </div>
              </div>
            }
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead className="w-36">Due Date</TableHead>
                <TableHead className="w-36">Uploaded Date</TableHead>
                <TableHead className="">Vendor</TableHead>
                <TableHead className="">Contact email</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-32 text-center @6xl:pr-8">State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.pages.flatMap((page) => page.items).map((invoice, index) => (
                <Link href={`/invoice/${invoice.id}`} key={invoice.id + index} legacyBehavior prefetch={true}>
                  <TableRow className="cursor-pointer">
                    <TableCell className="py-4 pl-4 @6xl:pl-8">
                      <FileIcon strokeWidth={1} />
                    </TableCell>
                    <TableCell>
                      {format(invoice.dueDate, "PP")}
                    </TableCell>
                    <TableCell>
                      {format(invoice.createdAt, "PP")}
                    </TableCell>
                    <TableCell>
                      {invoice.vendor?.name}
                    </TableCell>
                    <TableCell>
                      {invoice.vendor?.email}
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.totalAmount && ((invoice.totalAmount || 0) > 0) ?
                        new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency || undefined })
                          .format((invoice.totalAmount / 1000 || 0)) :
                        '—'}
                    </TableCell>
                    <TableCell className="text-center pr-4 @6xl:pr-8">
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
      <div className="px-4 @6xl:px-8 py-1">
        <InfiniteScroll
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          fetchNextPage={query.fetchNextPage}
        />
      </div>
    </div>
  )
}

const LoadingSkeleton = () => {
  return (
    <div>
      <div className="text-xs pb-2 px-4 @6xl:px-8">
        <div>
          Loading...
        </div>
      </div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead className="w-36">Due Date</TableHead>
              <TableHead className="w-36">Uploaded Date</TableHead>
              <TableHead className="">Vendor</TableHead>
              <TableHead className="">Contact email</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-32 text-center @6xl:pr-8">State</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(6)].map((_, index) => (
              <TableRow className="cursor-pointer" key={index}>
                <TableCell className="py-4 pl-4 @6xl:pl-8">
                  <FileIcon strokeWidth={1} />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-32 h-7" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-32 h-7" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-52 h-7" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-32 h-7" />
                </TableCell>
                <TableCell className="">
                  <Skeleton className="w-20 h-7 pt-2 ml-auto" />
                </TableCell>
                <TableCell className="text-center pr-4 @6xl:pr-8">
                  <Skeleton className="w-24 h-7" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
