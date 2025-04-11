import { InvoiceListSection } from "../section/invoice-list-section"
import { MonthsSection } from "../section/months-section"

type Props = {
  month?: string
}

export const DashboardView = ({ month }: Props) => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-xs text-muted-foreground">Manage your invoices</p>
      </div>
      <InvoiceListSection />
    </div>
  )
}
