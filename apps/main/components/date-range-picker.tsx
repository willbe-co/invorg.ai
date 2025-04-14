"use client"

import * as React from "react"
import { format, isAfter, isBefore, isEqual, isSameDay, startOfDay } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DayClickEventHandler } from "react-day-picker"
import { Label } from "@/components/ui/label"

export interface DateRange {
  from: Date
  to?: Date
}

interface DateRangePickerProps {
  value: DateRange | undefined
  onChange: (value: DateRange | undefined) => void
  calendarLabel?: string
  placeholder?: string
  className?: string
  align?: "center" | "start" | "end"
}

export function DateRangePicker({
  value,
  onChange,
  calendarLabel = "Date Range",
  placeholder = "Select date range",
  className,
  align = "start",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date())

  // Keep track of the month being displayed in the calendar
  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month)
  }

  // Format the date range for display
  const formatDisplayValue = (range: DateRange | undefined) => {
    if (!range) return placeholder

    const { from, to } = range

    if (!to) return format(from, "PPP")

    if (isSameDay(from, to)) return format(from, "PPP")

    return `${format(from, "PPP")} - ${format(to, "PPP")}`
  }

  // Handle day selection
  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    if (modifiers.disabled) return

    const date = startOfDay(day)

    if (!value?.from) {
      // If no start date is selected, set it
      onChange({ from: date })
      return
    }

    if (value.from && !value.to) {
      // If start date is selected but no end date
      if (isBefore(date, value.from)) {
        // If clicked day is before start date, make it the new start date
        onChange({ from: date })
      } else {
        // Otherwise, set it as end date
        onChange({ from: value.from, to: date })
        // setIsOpen(false)
      }
      return
    }

    // If both dates are already selected, start a new range
    onChange({ from: date })
  }

  // Determine if a day should be highlighted (part of the selected range)
  const isDateInRange = (day: Date) => {
    if (!value?.from) return false

    if (!value.to) return isSameDay(day, value.from)

    return (
      isSameDay(day, value.from) ||
      isSameDay(day, value.to) ||
      (isAfter(day, value.from) && isBefore(day, value.to))
    )
  }

  // Clear the selection
  const handleClear = () => {
    onChange(undefined)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex flex-col space-y-1.5">
        {calendarLabel && <Label>{calendarLabel}</Label>}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "h-9 w-full justify-between px-3 text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              <span className="truncate">{formatDisplayValue(value)}</span>
              <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align={align} className="w-auto p-0">
            <div className="space-y-3 ">
              <div className="">
                <Calendar
                  mode="range"
                  selected={{ from: value?.from, to: value?.to }}
                  onDayClick={handleDayClick}
                  onMonthChange={handleMonthChange}
                  initialFocus
                  numberOfMonths={2}
                  month={currentMonth}
                  classNames={{
                    month: "space-y-4",
                    caption_between: cn(
                      "hidden lg:flex lg:w-full lg:justify-center"
                    ),
                    nav: "space-x-1 flex items-center",
                    nav_button_previous: "absolute left-0",
                    nav_button_next: "absolute right-0",
                    caption: "relative flex items-center justify-center px-2 py-1",
                    head_cell: "text-muted-foreground  font-normal text-[0.8rem] w-8",
                    cell: cn(
                      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                    ),
                    day: cn(
                      "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                      "hover:bg-accent hover:text-accent-foreground"
                    ),
                    day_range_start: "day-range-start",
                    day_range_end: "day-range-end",
                    day_selected: "bg-primary text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "opacity-50",
                    day_disabled: "opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                  components={{
                    IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
                    IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
                  }}
                  modifiersStyles={{
                    selected: {
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    },
                  }}
                  styles={{
                    months: { gap: "1rem" },
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-3 px-4 pb-4">
                {value?.from && value?.to && (
                  <p className="text-xs font-medium">
                    from {format(value.from, "PP")} to {format(value.to, "PP")}
                  </p>
                )}
                <Button
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={() => handleClear()}
                >
                  Reset
                </Button>
                <Button onClick={() => setIsOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
