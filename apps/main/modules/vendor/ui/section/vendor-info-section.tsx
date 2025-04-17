"use client"

import { trpc } from "@/trpc/client"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileIcon, Loader2, LoaderIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

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
    <div className="grid gap-4 grid-cols-12 ">
      <div className="col-span-12 @6xl:col-span-4 flex flex-col gap-4">
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
                <div className="text-wrap">
                  {vendor.address}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-12 @6xl:col-span-8">
        <Card className="p-3 overflow-clip">
          <CardContent className="p-0">
            <div className="flex justify-between items-start">
              <div className="">
                <div className="text-2xl font-bold">
                  Invoices
                </div>
              </div>
            </div>
            <Separator className="my-3" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead className="w-36">Due Date</TableHead>
                  <TableHead className="w-36">Uploaded Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-32 text-center @6xl:pr-8">State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.invoices.map((invoice, index) => (
                  <Link href={`/invoice/${invoice.id}`} key={invoice.id + index} legacyBehavior prefetch={true}>
                    <TableRow className="cursor-pointer">
                      <TableCell className="py-4 pl-4 @6xl:pl-8">
                        <FileIcon strokeWidth={1} />
                      </TableCell>
                      <TableCell>
                        {format(invoice.dueDate, "PP")}
                      </TableCell>
                      <TableCell>
                        {format(invoice.createdAt, "PP")}
                      </TableCell>
                      <TableCell className="text-right">
                        {invoice.totalAmount && ((invoice.totalAmount || 0) > 0) ?
                          new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency || undefined })
                            .format((invoice.totalAmount / 1000 || 0)) :
                          '—'}
                      </TableCell>
                      <TableCell className="text-center pr-4 @6xl:pr-8">
                        {
                          invoice.state === "processing" &&
                          <Badge variant={"processing"} >
                            <LoaderIcon className="animate-spin" />
                            Processing
                          </Badge>
                        }
                        {
                          invoice.state === "duplicated" &&
                          <Badge variant={"warning"}>
                            Duplicated
                          </Badge>
                        }
                        {
                          invoice.state === "processed" &&
                          <Badge variant={"success"}>
                            Validated
                          </Badge>
                        }
                      </TableCell>
                    </TableRow>
                  </Link>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
