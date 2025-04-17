"use client"

import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { X } from "lucide-react"
import { useInvoiceFilterParams } from "@/modules/invoice/hooks/use-invoice-filter-params"
import { InvoiceDateFilter } from "../../components/invoice-date-filter"
import { StateFilter } from "../../components/state-filter"

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
  const { setParams, vendor_id, vendor_query, state, start_date, end_date } = useInvoiceFilterParams()

  const clearFilters = () => {
    setParams({
      vendor_query: null,
      vendor_id: null,
      state: null,
      start_date: null,
      end_date: null
    })
  }

  return (
    <div className=" flex items-end gap-4 justify-between">
      <div className="flex gap-4 items-end">
        <div className="flex gap-4 items-end">
          <div className="min-w-72 space-y-2">
            <InvoiceDateFilter />
          </div>
        </div>
        {(vendor_query || vendor_id || state || start_date || end_date) && (
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={clearFilters}
              className="gap-1 text-xs"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </Button>
          </div>
        )}
      </div>
      <div className="">
        {/* <StateFilter /> */}
        <div className="text-xs text-muted-foreground">
          more filters coming soon...
        </div>
      </div>
    </div>
  )
}
