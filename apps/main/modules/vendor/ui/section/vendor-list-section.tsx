"use client"

import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { InfiniteScroll } from "@/components/infinite-scroll"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { FileIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export const VendorListSection = () => {

  return (
    <Suspense fallback={<LoadingSkeleton />}>
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
              <TableHead className="w-8"></TableHead>
              <TableHead className="">Vendor</TableHead>
              <TableHead className="">Contact email</TableHead>
              <TableHead className="">Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pages.flatMap((page) => page.items).map((vendor) => (
              <Link href={`/vendor/${vendor.id}`} key={vendor.id} legacyBehavior prefetch={true}>
                <TableRow className="cursor-pointer">
                  <TableCell className="py-4 pl-4 @6xl:pl-8">
                    <FileIcon strokeWidth={1} />
                  </TableCell>
                  <TableCell>
                    {vendor.name}
                  </TableCell>
                  <TableCell>
                    {vendor.email}
                  </TableCell>
                  <TableCell className="pr-4 @6xl:pr-8">
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

const LoadingSkeleton = () => {
  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead className="">Vendor</TableHead>
              <TableHead className="">Contact email</TableHead>
              <TableHead className="@6xl:pr-8">Address</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
