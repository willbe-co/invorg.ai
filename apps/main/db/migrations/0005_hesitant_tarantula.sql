CREATE TYPE "public"."state" AS ENUM('processing', 'processed', 'incomplete', 'error');--> statement-breakpoint
ALTER TABLE "invoice" ADD COLUMN "state" "state" DEFAULT 'processing';