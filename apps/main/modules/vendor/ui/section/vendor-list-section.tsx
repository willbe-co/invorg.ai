"use client"

import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { InfiniteScroll } from "@/components/infinite-scroll"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export const VendorListSection = () => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Error...</div>}>
        <VendorListSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  )

}

const VendorListSectionSuspense = () => {

  const [data, query] = trpc.vendor.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })

  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Vendor</TableHead>
              <TableHead className="">Contact email</TableHead>
              <TableHead className="">Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pages.flatMap((page) => page.items).map((vendor) => (
              <Link href={`/vendor/${vendor.id}`} key={vendor.id} legacyBehavior prefetch={true}>
                <TableRow className="cursor-pointer">
                  <TableCell>
                    {vendor.name}
                  </TableCell>
                  <TableCell>
                    {vendor.email}
                  </TableCell>
                  <TableCell>
                    {vendor.address}
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
