import { DEFAULT_LIMIT } from "@/constants"
import { VendorsView } from "@/modules/vendor/ui/views/vendors-view"
import { HydrateClient, trpc } from "@/trpc/server"
import { createLoader, parseAsString, parseAsStringEnum, parseAsTimestamp, type SearchParams } from 'nuqs/server'

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function VendorPage({ searchParams }: Props) {

  void trpc.vendor.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  })

  return (
    <HydrateClient>
      <VendorsView />
    </HydrateClient>
  )
}
