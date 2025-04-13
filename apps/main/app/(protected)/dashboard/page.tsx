import { DEFAULT_LIMIT } from "@/constants"
import { DashboardView } from "@/modules/dashboard/ui/views/dashboard-view"
import { loadInvoiceFilterParams } from "@/modules/invoice/hooks/use-invoice-filter-params"
import { HydrateClient, trpc } from "@/trpc/server"
import type { SearchParams } from 'nuqs/server'

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function DashboardPage({ searchParams }: Props) {
  const { vendor_id, vendor, state, start_date, end_date } = await loadInvoiceFilterParams(searchParams)

  void trpc.invoice.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  }
  )

  return (
    <HydrateClient>
      <DashboardView />
    </HydrateClient>
  )
}
