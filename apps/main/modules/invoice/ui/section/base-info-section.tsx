"use client"

import { Iframe } from "@/components/iframe"
import { trpc } from "@/trpc/client"
import { format } from "date-fns"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, FileIcon, Download, CreditCardIcon, LoaderIcon, LinkIcon, ExternalLinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const BaseInfoSection = ({ id }: { id: string }) => {
  const { data, isLoading, error } = trpc.invoice.getOne.useQuery({ id })
  const [pdfLoaded, setPdfLoaded] = useState(false)
  const [pdfError, setPdfError] = useState(false)

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
        Failed to load invoice information
      </div>
    )
  }

  const invoice = data.data

  return (
    <div className="grid gap-4 @6xl:grid-cols-12">
      <div className="@6xl:col-span-4 flex flex-col gap-4">
        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex justify-between items-start">
              <div className="">
                <div className="text-2xl font-bold">
                  {invoice.totalAmount && ((invoice.totalAmount || 0) > 0) ?
                    new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency || undefined })
                      .format((invoice.totalAmount / 1000 || 0)) :
                    '—'}
                </div>
                {invoice.invoiceNumber && (
                  <div className="text-sm text-muted-foreground">
                    #{invoice.invoiceNumber}
                  </div>
                )}
              </div>
              <div>
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
              </div>
            </div>
            <Separator className="my-3" />
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-baseline">
                <div className="font-mono text-sm font-medium text-muted-foreground">Issue Date</div>
                <div className="">
                  {invoice.issueDate ? format(new Date(invoice.issueDate), "MMMM d, yyyy") : '—'}
                </div>
              </div>
              <div className="flex flex-col items-baseline">
                <div className="font-mono text-sm font-medium text-muted-foreground">Due Date</div>
                <div className="">
                  {invoice.dueDate ? format(new Date(invoice.dueDate), "MMMM d, yyyy") : '—'}
                </div>
              </div>
              <div className="flex flex-col items-baseline">
                <div className="font-mono text-sm font-medium text-muted-foreground">Payment Method</div>
                <div className="flex items-center gap-2">
                  {invoice.paymentMethod !== "Not specified" &&
                    <CreditCardIcon className="size-4" />
                  }
                  {invoice.paymentMethod}
                </div>
              </div>
              {invoice.paymentTerms && (
                <div className="flex flex-col items-baseline">
                  <div className="font-mono text-sm font-medium text-muted-foreground text-nowrap">Payment Terms</div>
                  <div className="">{invoice.paymentTerms || '—'}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="absolute right-3 top-3">
                  <Link href={`/vendor/${invoice.vendorId}`}>
                    <ExternalLinkIcon className="size-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Check vendor details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <CardContent className="p-0">
            <CardTitle className="flex justify-between">Vendor
            </CardTitle>
            <div className="my-3" />
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-baseline">
                <div className="font-mono text-sm font-medium text-muted-foreground">Name</div>
                <div className="">
                  {invoice.vendor?.name}
                </div>
              </div>
              <div className="flex flex-col items-baseline">
                <div className="font-mono text-sm font-medium text-muted-foreground">Address</div>
                <div className="">
                  {invoice.vendor?.address}
                </div>
              </div>

              <div className="flex flex-col items-baseline">
                <div className="font-mono text-sm font-medium text-muted-foreground">Email</div>
                <div className="">
                  {invoice.vendor?.email}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="@6xl:col-span-8">
        {invoice.documentUrl && (
          <Card className="p-0 overflow-clip">
            <CardContent className="p-0">
              <div className="bg-background flex flex-col">
                {pdfError ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <FileIcon className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground text-center mb-6">
                      We're having trouble displaying this PDF in the browser.
                    </p>
                    <Button
                      onClick={() => window.open(invoice.documentUrl!, '_blank')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Open PDF
                    </Button>
                  </div>
                ) : (
                  <div className="h-[600px] md:h-[1000px] w-full">
                    <Iframe
                      src={invoice.documentUrl}
                      width="100%"
                      height="100%"
                      onLoaded={setPdfLoaded}
                      setError={setPdfError}
                      preview={false}
                      delay={0.5}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
