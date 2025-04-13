import { InvoiceUploadForm } from "@/modules/invoice/components/invoice-upload-form"
import { InvoiceListSection } from "../section/invoice-list-section"
import { MonthsSection } from "../section/months-section"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

type Props = {
  month?: string
}

export const DashboardView = async ({ month }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  return (
    <div className="flex flex-col gap-y-6">
      <div className="grid lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="col-span-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Manage your invoices</p>
        </div>
        <div className="col-span-8">
          <InvoiceUploadForm folder={`/${session?.user.id}`} maxFiles={3} maxSize={1 * 1024 * 1024} />
        </div>
      </div>
      <InvoiceListSection />
    </div>
  )
}
