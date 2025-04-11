import { invoice, invoiceInsertSchema } from "@/db/schemas/invoice";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

import { and, desc, eq, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const invoicesRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(z.object({
      cursor: z.object({
        id: z.string(),
        updatedAt: z.date(),
      })
        .nullish(),
      limit: z.number().min(1).max(100)
    }))
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input
      const user = ctx.user
      const data = await ctx.db.select()
        .from(invoice)
        .where(and(
          eq(invoice.userId, user.id),
          cursor ? or(
            lt(invoice.updatedAt, cursor.updatedAt),
            and(
              eq(invoice.updatedAt, cursor.updatedAt),
              lt(invoice.id, cursor.id)
            )
          ) : undefined
        )).orderBy(desc(invoice.updatedAt))
        .limit(limit + 1)

      const hasMore = data.length > limit
      const items = hasMore ? data.slice(0, -1) : data
      const lastItem = items[items.length - 1]
      const nextCursor = hasMore ? {
        id: lastItem.id,
        updatedAt: lastItem.updatedAt
      } : null

      return { items, nextCursor };
    }),

  create: protectedProcedure
    .input(invoiceInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user

      // throw new TRPCError({ code: "BAD_REQUEST" })
      const [createdInvoice] = await ctx.db
        .insert(invoice)
        .values({
          userId,
          documentUrl: input.documentUrl,
          vendorId: input.vendorId
        }).returning()

      return {
        invoice: createdInvoice
      }
    })
})
