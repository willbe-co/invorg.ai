"use client"

import { trpc } from "@/trpc/client"
import { Suspense, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { InfiniteScroll } from "@/components/infinite-scroll"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, FileIcon, LoaderIcon, TriangleAlert, Upload, UploadIcon } from "lucide-react"
import { format } from "date-fns"
import { useInvoiceFilterParams } from "@/modules/invoice/hooks/use-invoice-filter-params"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "./ui/card"
import { Progress } from "./ui/progress"

type Props = {
  id: string
}

export const UploadsLeft = ({ id }: Props) => {

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ErrorBoundary fallback={<div>Error...</div>}>
        <UploadsLeftSuspense id={id} />
      </ErrorBoundary>
    </Suspense>
  )

}

const UploadsLeftSuspense = ({ id }: Props) => {
  const [data, query] = trpc.user.getInvoicesRemaining.useSuspenseQuery({
    id
  })

  const remaining = data
  const totalUploads = 10

  const percentage = (remaining / totalUploads) * 100

  const getCardColor = () => {
    if (remaining === 0) return "bg-red-50 dark:bg-red-950/20"
    if (remaining <= totalUploads * 0.3) return "bg-amber-50 dark:bg-amber-950/20"
    return "bg-green-50 dark:bg-green-950/20"
  }

  const getProgressColor = () => {
    if (remaining === 0) return "bg-red-500"
    if (remaining <= totalUploads * 0.3) return "bg-amber-500"
    return "bg-green-500"
  }

  const getBorderColor = () => {
    if (remaining === 0) return "border-red-200 dark:border-red-800/30"
    if (remaining <= totalUploads * 0.3) return "border-amber-200 dark:border-amber-800/30"
    return "border-green-300 dark:border-green-800/10"
  }

  return (
    <Card className={`${getCardColor()} ${getBorderColor()} border shadow-none`}>
      <CardContent className="">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Upload
              className={
                remaining === 0 ? "text-red-500" : remaining <= totalUploads * 0.3 ? "text-amber-500" : "text-green-500"
              }
              size={20}
            />
            <h3 className="font-medium">Trial Uploads</h3>
          </div>
          <span className="text-sm font-medium">
            {remaining}/{totalUploads}
          </span>
        </div>

        <Progress
          value={percentage}
          className="h-2 bg-gray-100 dark:bg-gray-800"
        />

        {remaining === 0 && (
          <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle size={16} />
            <span>You've reached your upload limit</span>
          </div>
        )}

        {remaining <= totalUploads * 0.3 && remaining > 0 && (
          <div className="mt-3 text-amber-500 text-sm">
            <span>You're running low on uploads</span>
          </div>
        )}

        {remaining > totalUploads * 0.3 && (
          <div className="mt-3 text-500-500 text-sm">
            <span>Hope you enjoy the app</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const LoadingSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-7 h-10" />
    </div>
  )
}
