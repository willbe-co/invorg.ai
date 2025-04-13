
import { DEFAULT_LIMIT } from "@/constants"
import { DashboardView } from "@/modules/dashboard/ui/views/dashboard-view"
import { HydrateClient, trpc } from "@/trpc/server"

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<{
    month?: string
  }>
}

export default async function VendorPage({ searchParams }: Props) {
  const { month } = await searchParams

  void trpc.invoice.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  }
  )

  return (
    <HydrateClient>
      <DashboardView month={month} />
    </HydrateClient>
  )
}
