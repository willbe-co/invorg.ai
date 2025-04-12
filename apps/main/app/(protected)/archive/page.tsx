import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { InvoiceUploadForm } from "@/modules/invoice/components/invoice-upload-form";
import { headers } from "next/headers";

export default async function ArchivePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <div>
      <InvoiceUploadForm folder={`/${session?.user.id}`} maxFiles={20} maxSize={10 * 1024 * 1024} />
    </div>
  )
}
