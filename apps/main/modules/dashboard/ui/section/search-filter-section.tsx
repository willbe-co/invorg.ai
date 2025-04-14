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
import { InvoiceDateFilter } from "../../components/invoice-date-filter"

export const SearchFilterSection = () => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Error...</div>}>
        <SearchFilterSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  )

}

const SearchFilterSectionSuspense = () => {
  const { setParams, vendor_id, vendor, state, start_date, end_date } = useInvoiceFilterParams()

  // const [data, query] = trpc.invoice.getMany.useSuspenseInfiniteQuery({
  //   limit: DEFAULT_LIMIT
  // }, {
  //   getNextPageParam: (lastPage) => lastPage.nextCursor
  // })
  // const utils = trpc.useUtils()
  // const create = trpc.invoice.create.useMutation({
  //   onSuccess: () => {
  //     toast.success("Invoice created")
  //     utils.invoice.getMany.invalidate()
  //   },
  //   onError: (error) => {
  //     toast.error(error.message)
  //   }
  // })
  return (
    <div className="flex items-end gap-4">
      <div>
        ...search...
      </div>
      <div>
        <InvoiceDateFilter />
      </div>

    </div>
  )
}
