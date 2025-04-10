
import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2"
import { vendor } from "./vendor";
import { user } from "./auth";

const invoiceId = () => `inv_${createId()}`

export const invoice = pgTable("invoice", {
  id: text()
    .primaryKey()
    .$defaultFn(() => invoiceId()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: "cascade" }),
  vendorId: text('vendor_id').notNull().references(() => vendor.id, { onDelete: 'set null' }),
  invoiceVendorRef: text("invoice_vendor_ref"),
  documentUrl: text("document_url"),
  totalAmount: integer("total_amount").default(0),
  dueDate: timestamp('due_date', { mode: "date" }).defaultNow().notNull(),
  invoicedDate: timestamp("invoiced_date").defaultNow().notNull(),
  createdAt: timestamp('created_at', { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: "date" }).defaultNow().notNull()
});
