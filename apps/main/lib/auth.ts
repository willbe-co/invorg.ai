import { db } from "@/db";
import { account, session, user, verification } from "@/db/schemas";
import { trpc } from "@/trpc/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins"
import { headers } from "next/headers";
import { cache } from "react";

export const auth = betterAuth({
  appName: "invorg.ai",
  advanced: {
    generateId: false,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification
    }
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url, token }, req) {
      // TODO: send email with reset password

    }
  },
  plugins: [nextCookies()]
})

export const getSession = cache(auth.api.getSession)
