import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

import { eq } from "drizzle-orm";
import { user } from "@/db/schemas";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  getIdByEmail: baseProcedure
    .input(z.object({
      email: z.string().email("Not a valid email")
    }))
    .query(async ({ ctx, input }) => {
      const [userExists] = await ctx.db
        .select({
          id: user.id
        })
        .from(user)
        .where(eq(user.email, input.email))

      if (!userExists) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Email not found" })
      }

      return ({ data: userExists })
    }),
  getInvoicesRemaining: baseProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const [userExists] = await ctx.db.select().from(user).where(eq(user.id, input.id))
      if (!userExists) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Email not found" })
      }
      const invoicesRemaining = parseInt(userExists.invoicesRemaining)

      return (invoicesRemaining)
    }),
  decreaseInvoicesRemaining: baseProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const [userExists] = await ctx.db.select().from(user).where(eq(user.id, input.id))
      if (!userExists) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Email not found" })
      }

      const invoicesRemaining = parseInt(userExists.invoicesRemaining) - 1

      if (invoicesRemaining < 0) {
        throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "No upload remaining" })
      }

      const [userUpdated] = await ctx.db.update(user)
        .set({ invoicesRemaining: invoicesRemaining.toString() })
        .where(eq(user.id, input.id))
        .returning()


      return (userUpdated)
    })
})
