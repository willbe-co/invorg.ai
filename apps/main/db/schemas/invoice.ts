import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { pgTable, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2"
import { vendor } from "./vendor";
import { user } from "./auth";


export const stateEnum = pgEnum("state", ["processing", "processed", "incomplete", "error", "duplicated"])
export const currencyEnum = pgEnum("currency", ["USD", "EUR"])

const invoiceId = () => `inv_${createId()}`

export const invoice = pgTable("invoice", {
  id: text()
    .primaryKey()
    .$defaultFn(() => invoiceId()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: "cascade" }),
  vendorId: text('vendor_id').references(() => vendor.id, { onDelete: 'set null' }),
  invoiceNumber: text("invoice_number").unique(),
  documentUrl: text("document_url"),
  subtotalAmount: integer("sub_total_amount").default(0),
  taxAmount: integer("tax_amount").default(0),
  totalAmount: integer("total_amount").default(0),
  paymentTerms: text("payment_terms"),
  paymentMethod: text("payment_method"),
  dueDate: timestamp('due_date', { mode: "date" }).defaultNow().notNull(),
  issueDate: timestamp("issue_date", { mode: "date" }).defaultNow().notNull(),
  currency: currencyEnum().default("USD"),
  state: stateEnum().default("processing"),
  createdAt: timestamp('created_at', { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: "date" }).defaultNow().notNull()
});

export const invoiceSelectSchema = createSelectSchema(invoice);
export const invoiceInsertSchema = createInsertSchema(invoice);
export const invoiceUpdateSchema = createUpdateSchema(invoice);
