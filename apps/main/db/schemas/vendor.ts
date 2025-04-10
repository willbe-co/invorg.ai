
import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2"

const vendorId = () => `ven_${createId()}`

export const vendor = pgTable("vendor", {
  id: text()
    .primaryKey()
    .$defaultFn(() => vendorId()),
  name: text("name").notNull(),
  email: text('email'),
  logo: text('logo'),
  createdAt: timestamp('created_at', { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: "date" }).defaultNow().notNull()
});
