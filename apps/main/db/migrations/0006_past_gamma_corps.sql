ALTER TABLE "invoice" RENAME COLUMN "invoice_vendor_ref" TO "invoice_number";--> statement-breakpoint
ALTER TABLE "invoice" RENAME COLUMN "invoiced_date" TO "issue_date";--> statement-breakpoint
ALTER TABLE "invoice" ADD COLUMN "sub_total_amount" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoice" ADD COLUMN "tax_amount" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoice" ADD COLUMN "payment_terms" text;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_invoice_number_unique" UNIQUE("invoice_number");