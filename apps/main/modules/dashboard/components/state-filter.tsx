"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type StateOption = {
  value: string
  label: string
  color: string
  bgColor: string
  hoverColor: string
  borderColor: string
}

const stateOptions: StateOption[] = [
  {
    value: "processing",
    label: "Processing",
    color: "text-amber-800",
    bgColor: "bg-amber-100",
    hoverColor: "hover:bg-amber-200",
    borderColor: "border-amber-200",
  },
  {
    value: "processed",
    label: "Processed",
    color: "text-green-800",
    bgColor: "bg-green-100",
    hoverColor: "hover:bg-green-200",
    borderColor: "border-green-200",
  },
  {
    value: "duplicated",
    label: "Duplicated",
    color: "text-purple-800",
    bgColor: "bg-purple-100",
    hoverColor: "hover:bg-purple-200",
    borderColor: "border-purple-200",
  },
  {
    value: "error",
    label: "Error",
    color: "text-red-800",
    bgColor: "bg-red-100",
    hoverColor: "hover:bg-red-200",
    borderColor: "border-red-200",
  },
]

export const StateFilter = () => {
  const [open, setOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>([])

  const getStateOption = (value: string) => {
    return stateOptions.find((option) => option.value === value)
  }

  const handleSelect = (value: string) => {
    setSelectedValues((current) => {
      if (current.includes(value)) {
        return current.filter((v) => v !== value)
      } else {
        return [...current, value]
      }
    })
  }

  const handleRemove = (value: string) => {
    setSelectedValues((current) => current.filter((v) => v !== value))
  }

  const clearAll = () => {
    setSelectedValues([])
  }

  return (
    <div className="w-full ">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between min-h-9 h-auto py-0 min-w-60", selectedValues.length > 0 ? "px-3" : "px-4")}
          >
            <div className="flex flex-nowrap gap-1 items-center">
              {selectedValues.length > 0 ? (
                selectedValues.map((value) => {
                  const option = getStateOption(value)
                  if (!option) return null
                  return (
                    <Badge
                      key={value}
                      variant={option.value === "processing" ?
                        "processing" :
                        option.value === "processed" ?
                          "success" :
                          option.value === "duplicated" ?
                            "warning" :
                            "default"}
                    >
                      {option.value === "processing" ?
                        "Processing" :
                        option.value === "processed" ?
                          "Validated" :
                          option.value === "duplicated" ?
                            "Duplicated" :
                            "Error"}
                      <button
                        type="button"
                        className="rounded-full outline-none focus:ring-2 focus:ring-offset-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemove(value)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })
              ) : (
                <span className="text-muted-foreground">Select one or more states</span>
              )}
            </div>
            <div className="flex items-center">
              {selectedValues.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 "
                  onClick={(e) => {
                    e.stopPropagation()
                    clearAll()
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search states..." />
            <CommandList>
              <CommandEmpty>No state found.</CommandEmpty>
              <CommandGroup>
                {stateOptions.map((option) => (
                  <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                    <div
                      className={`mr-2 h-4 w-4 rounded-full ${option.value === "processing"
                        ? "bg-amber-500"
                        : option.value === "processed"
                          ? "bg-green-500"
                          : option.value === "duplicated"
                            ? "bg-purple-500"
                            : "bg-red-500"
                        }`}
                    />
                    <span>{option.label}</span>
                    {selectedValues.includes(option.value) && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
