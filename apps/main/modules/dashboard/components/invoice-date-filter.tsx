"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useInvoiceFilterParams } from "@/modules/invoice/hooks/use-invoice-filter-params"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import React from "react"

export const InvoiceDateFilter = () => {
  // const [date, setDate] = React.useState<Date>()
  const { setParams, start_date, end_date } = useInvoiceFilterParams()

  return (
    <div className="flex gap-2">
      <div className="flex flex-col space-y-2">
        <Label>Start date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !start_date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {start_date ? format(start_date, "PPP") : <span>Select start date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={start_date || new Date()}
              onSelect={(v) => setParams({ start_date: v })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col space-y-2">
        <Label>End date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !end_date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {end_date ? format(end_date, "PPP") : <span>Select end date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={end_date || new Date()}
              onSelect={(v) => setParams({ end_date: v })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
