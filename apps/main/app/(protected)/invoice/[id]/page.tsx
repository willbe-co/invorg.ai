
import { InvoiceView } from "@/modules/invoice/ui/views/invoice-view"
import { HydrateClient, trpc } from "@/trpc/server"

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<{}>,
  params: Promise<{ id: string }>
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params

  void trpc.invoice.getOne.prefetch({ id })

  return (
    <HydrateClient>
      <InvoiceView id={id} />
    </HydrateClient>
  )
}
