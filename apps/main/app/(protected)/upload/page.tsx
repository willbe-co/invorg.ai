import { UploadsLeft } from "@/components/uploads-left";
import { auth } from "@/lib/auth";
import { InvoiceUploadForm } from "@/modules/invoice/components/invoice-upload-form";
import { HydrateClient, trpc } from "@/trpc/server";
import { ArrowRight, CircleAlertIcon, HelpCircle, InfoIcon, MailIcon, MailQuestion, MessageCircleQuestionIcon, ShieldQuestionIcon } from "lucide-react";
import { headers } from "next/headers";

export default async function UploadPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) return

  void trpc.user.getInvoicesRemaining.prefetch({ id: session.user.id })

  return (
    <div className="flex flex-col gap-y-6">
      <div className="grid lg:grid-cols-12 gap-4 lg:gap-6 px-4 @6xl:px-8">
        <div className="col-span-5">
          <h1 className="text-2xl font-bold">Upload invoices</h1>
          <p className="text-xs text-muted-foreground mb-4">Upload your invoice documents</p>
          <div className="space-y-2 flex flex-col gap-3 text-muted-foreground">
            <div className="flex items-start gap-3">
              <CircleAlertIcon size={20} className="flex-none mt-1 stroke-[1.5px]" />
              <div className="flex-1">
                <div className="relative">
                  Did you know you can also upload invoices by email? Just forward the invoicing email to
                  <span className="inline-flex gap-1 mx-2 items-center border-b border-muted-foreground ">
                    <MailIcon size={16} /><span className="bg-blue-100"> invoice@invorg.app</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2"></div>
        <div className="lg:col-span-5">
          <HydrateClient>
            <UploadsLeft id={session.user.id} />
          </HydrateClient>

        </div>
      </div>
      <div className=" px-4 @6xl:px-8">
        <InvoiceUploadForm folder={`/${session?.user.id}`} maxFiles={5} maxSize={1 * 1024 * 1024} />
      </div>
    </div>
  )
}
