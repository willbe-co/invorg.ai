
import { pgTable, text, integer, timestamp, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { user } from "./auth";

const vendorId = () => `ven_${createId()}`

export const vendor = pgTable("vendor", {
  id: text()
    .primaryKey()
    .$defaultFn(() => vendorId()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text('email'),
  logo: text('logo'),
  address: text("address"),
  createdAt: timestamp('created_at', { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: "date" }).defaultNow().notNull()
}, (table) => [
  uniqueIndex("name_user_idx").on(table.name, table.userId)
]);

export const vendorSelectSchema = createSelectSchema(vendor);
export const vendorInsertSchema = createInsertSchema(vendor);
export const vendorUpdateSchema = createUpdateSchema(vendor);
