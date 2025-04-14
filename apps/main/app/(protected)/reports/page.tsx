
import { DEFAULT_LIMIT } from "@/constants"
import { VendorsView } from "@/modules/vendor/ui/views/vendors-view"
import { HydrateClient, trpc } from "@/trpc/server"
import { WrenchIcon } from "lucide-react"

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<{
    month?: string
  }>
}

export default async function VendorPage({ searchParams }: Props) {


  return (
    <div className="w-full min-h-96 flex items-center justify-center gap-4">
      <h1 className="text-2xl font-mono text-slate-700">coming soon...</h1>
      {/* <HydrateClient> */}
      {/*   <VendorsView month={month} /> */}
      {/* </HydrateClient> */}
    </div>
  )
}
