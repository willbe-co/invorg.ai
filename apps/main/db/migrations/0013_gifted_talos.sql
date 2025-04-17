ALTER TABLE "vendor" DROP CONSTRAINT "vendor_name_unique";--> statement-breakpoint
DROP INDEX "name_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "name_user_idx" ON "vendor" USING btree ("name","user_id");