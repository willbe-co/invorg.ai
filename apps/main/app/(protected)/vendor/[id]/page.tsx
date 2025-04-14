import { VendorView } from "@/modules/vendor/ui/views/vendor-view"
import { HydrateClient, trpc } from "@/trpc/server"

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<{}>,
  params: Promise<{ id: string }>
}

export default async function VendorDetailPage({ params }: Props) {
  const { id } = await params

  void trpc.vendor.getOne.prefetch({ id })

  return (
    <HydrateClient>
      <VendorView id={id} />
    </HydrateClient>
  )
}
