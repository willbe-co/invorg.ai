import { InvoiceListSection } from "../section/invoice-list-section"
import { MonthsSection } from "../section/months-section"

type Props = {
  month?: string
}

export const DashboardView = ({ month }: Props) => {
  return (
    <div className="flex flex-col gap-y-6">
      <InvoiceListSection />
    </div>
  )
}
