"use client"

import { trpc } from "@/trpc/client"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export const VendorInfoSection = ({ id }: { id: string }) => {
  const { data, isLoading, error } = trpc.vendor.getOne.useQuery({ id })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-destructive">
        Failed to load vendor information
      </div>
    )
  }

  const vendor = data.data

  return (
    <div className="grid gap-4 @6xl:grid-cols-12 ">
      <div className="@6xl:col-span-4 flex flex-col gap-4">
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex justify-between items-start">
              <div className="">
                <div className="text-2xl font-bold">
                  {vendor.name}
                </div>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-baseline">
                <div className="font-mono text-sm font-medium text-muted-foreground">Contact</div>
                <div className="">
                  {vendor.email}
                </div>
              </div>
              <div className="flex flex-col items-baseline">
                <div className="font-mono text-sm font-medium text-muted-foreground">Address</div>
                <div className="">
                  {vendor.address}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="@6xl:col-span-8">
        <Card className="p-3 overflow-clip">
          <CardContent className="p-0">
            List invoices from this vendor
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
