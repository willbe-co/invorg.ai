import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2"

const userId = () => `usr_${createId()}`
const sessionId = () => `ses_${createId()}`
const accountId = () => `acc_${createId()}`
const verificationId = () => `ver_${createId()}`

export const user = pgTable("user", {
  id: text()
    .primaryKey()
    .$defaultFn(() => userId()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at', { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: "date" }).defaultNow().notNull()
});

export const session = pgTable("session", {
  id: text()
    .primaryKey()
    .$defaultFn(() => sessionId()),
  expiresAt: timestamp('expires_at', { mode: "date" }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at', { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: "date" }).defaultNow().notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
  id: text()
    .primaryKey()
    .$defaultFn(() => accountId()),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { mode: "date" }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { mode: "date" }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at', { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: "date" }).defaultNow().notNull()
});

export const verification = pgTable("verification", {
  id: text()
    .primaryKey()
    .$defaultFn(() => verificationId()),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { mode: "date" }).notNull(),
  createdAt: timestamp('created_at', { mode: "date" }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: "date" }).defaultNow()
});
