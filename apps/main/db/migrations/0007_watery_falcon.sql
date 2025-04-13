ALTER TABLE "vendor" ADD COLUMN "address" text;--> statement-breakpoint
CREATE UNIQUE INDEX "name_idx" ON "vendor" USING btree ("name");--> statement-breakpoint
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_name_unique" UNIQUE("name");