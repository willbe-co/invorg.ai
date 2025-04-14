"use client"

import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { X } from "lucide-react"
import { useInvoiceFilterParams } from "@/modules/invoice/hooks/use-invoice-filter-params"
import { InvoiceDateFilter } from "../../components/invoice-date-filter"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  //
  const clearFilters = () => {
    setParams({
      vendor: null,
      vendor_id: null,
      state: null,
      start_date: null,
      end_date: null
    })
  }

  return (
    <div className=" flex items-end justify-between">

      <div className="">
        <div className="min-w-72 space-y-2">
          <InvoiceDateFilter />
        </div>
      </div>
      <div className="flex items-center justify-between">
        {(vendor || vendor_id || state || start_date || end_date) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 gap-1 text-xs"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
