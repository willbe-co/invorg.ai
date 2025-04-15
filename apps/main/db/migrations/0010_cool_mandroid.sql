CREATE TYPE "public"."currency" AS ENUM('USD', 'EUR');--> statement-breakpoint
ALTER TABLE "invoice" ADD COLUMN "payment_method" text;--> statement-breakpoint
ALTER TABLE "invoice" ADD COLUMN "currency" "currency" DEFAULT 'USD';