import { DEFAULT_LIMIT } from "@/constants"
import { DashboardView } from "@/modules/dashboard/ui/views/dashboard-view"
import { HydrateClient, trpc } from "@/trpc/server"
import { createLoader, parseAsString, parseAsStringEnum, parseAsTimestamp, type SearchParams } from 'nuqs/server'

export const dynamic = "force-dynamic"

enum InvoiceState {
  processing = "processing",
  processed = "processed",
  duplicated = "duplicated"
}

const params = {
  vendor_query: parseAsString,
  vendor_id: parseAsString,
  start_date: parseAsTimestamp,
  end_date: parseAsTimestamp,
  state: parseAsStringEnum<InvoiceState>(Object.values(InvoiceState))
}

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function DashboardPage({ searchParams }: Props) {
  const loader = createLoader(params)

  const { vendor_id, vendor_query, state, start_date, end_date } = await loader(searchParams)

  void trpc.invoice.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
    vendor_id: vendor_id || undefined,
    vendor_query: vendor_query || undefined,
    state: state || undefined,
    start_date: start_date || undefined,
    end_date: end_date || undefined
  })

  return (
    <HydrateClient>
      <DashboardView />
    </HydrateClient>
  )
}
