import { InvoiceUploadForm } from "@/modules/invoice/components/invoice-upload-form";

export default function ArchivePage() {
  return <div><InvoiceUploadForm folder="/invorgai" maxFiles={20} maxSize={10 * 1024 * 1024} /></div>

}
