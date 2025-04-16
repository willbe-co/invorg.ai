import { InvoiceListSection } from "../section/invoice-list-section"
import { SearchFilterSection } from "../section/search-filter-section"

type Props = {
  month?: string
}

export const DashboardView = async ({ month }: Props) => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="grid lg:grid-cols-12 gap-4 lg:gap-6 px-4 @6xl:px-8">
        <div className="col-span-5">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Manage your invoices</p>
        </div>
      </div>
      <div className="px-4 @6xl:px-8">
        <SearchFilterSection />
      </div>
      <div>
        <InvoiceListSection />
      </div>
    </div>
  )
}
