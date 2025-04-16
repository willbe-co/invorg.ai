import { auth } from "@/lib/auth";
import { InvoiceUploadForm } from "@/modules/invoice/components/invoice-upload-form";
import { headers } from "next/headers";

export default async function ArchivePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <div className="flex flex-col gap-y-6">
      <div className="grid lg:grid-cols-12 gap-4 lg:gap-6 px-4 @6xl:px-8">
        <div className="col-span-5">
          <h1 className="text-2xl font-bold">Upload invoices</h1>
          <p className="text-xs text-muted-foreground">Upload your invoice documents</p>
        </div>
      </div>
      <div className=" px-4 @6xl:px-8">
        <InvoiceUploadForm folder={`/${session?.user.id}`} maxFiles={5} maxSize={1 * 1024 * 1024} />
      </div>
    </div>
  )
}
