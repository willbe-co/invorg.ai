import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

type Props = {
  id?: string
}

export const VendorView = ({ id }: Props) => {
  return (
    <div className="@container flex flex-col gap-y-6">
      <div className="flex items-start gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/vendor">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Vendor</h1>
          <p className="text-xs text-muted-foreground">ID: {id}</p>
        </div>
      </div>

      {/* {id ? ( */}
      {/*   <BaseInfoSection id={id} /> */}
      {/* ) : ( */}
      {/*   <div className="rounded-md bg-destructive/10 p-4 text-destructive"> */}
      {/*     No invoice ID provided */}
      {/*   </div> */}
      {/* )} */}
    </div>
  )
}
