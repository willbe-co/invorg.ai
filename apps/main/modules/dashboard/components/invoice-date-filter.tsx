"use client"

import { DateRange, DateRangePicker } from "@/components/date-range-picker"
import { useInvoiceFilterParams } from "@/modules/invoice/hooks/use-invoice-filter-params"
import React from "react"

export const InvoiceDateFilter = () => {
  const { setParams, start_date, end_date } = useInvoiceFilterParams()

  const dateRange: DateRange | undefined = start_date
    ? {
      from: start_date,
      to: end_date || undefined
    }
    : undefined

  // Update filter params when date range changes
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setParams({
      start_date: range?.from || null,
      end_date: range?.to || null
    })
  }

  return (
    <div className="w-full max-w-md">
      <DateRangePicker
        value={dateRange}
        onChange={handleDateRangeChange}
        calendarLabel="Filter by date range"
        placeholder="Select date range"
      />
    </div>
  )
}
