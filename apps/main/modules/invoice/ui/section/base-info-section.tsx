
"use client"

import { Iframe } from "@/components/iframe"
import { trpc } from "@/trpc/client"
import { format } from "date-fns"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

export const BaseInfoSection = ({ id }: { id: string }) => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={<div>Error...</div>}>
        <BaseInfoSectionSuspense id={id} />
      </ErrorBoundary>
    </Suspense>
  )

}

const BaseInfoSectionSuspense = ({ id }: { id: string }) => {
  const [data, query] = trpc.invoice.getOne.useSuspenseQuery({
    id
  })
  const { data: invoice } = data

  return (
    <div>
      <div className="flex gap-3 items-baseline">
        <div className="text-sm font-mono text-muted-foreground">Invoice Number:</div>
        <div className="font-mono">
          {invoice.invoiceNumber}
        </div>
      </div>
      <div className="flex gap-3 items-baseline">
        <div className="text-sm font-mono text-muted-foreground">Issue Date:</div>
        <div className="font-mono">
          {format(invoice.issueDate, "PPP")}
        </div>
      </div>
      <div className="flex gap-3 items-baseline">
        <div className="text-sm font-mono text-muted-foreground">Due Date:</div>
        <div className="font-mono">
          {format(invoice.dueDate, "PPP")}
        </div>
      </div>
      {invoice.documentUrl &&
        <div>
          <Iframe
            src={invoice.documentUrl}
            key={invoice.id}
            width={600}
            height={800}
            onLoaded={() => {
              console.log("Loaded")
            }}
            setError={() => {
              console.log("error")
            }}
            preview={false}
            delay={0.5}
          />
        </div>
      }
    </div>
  )
}
