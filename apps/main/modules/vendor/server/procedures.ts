
import { vendor, vendorSelectSchema, vendorInsertSchema, vendorUpdateSchema } from "@/db/schemas/vendor";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

import { and, desc, eq, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const vendorsRouter = createTRPCRouter({
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
        .from(vendor)
        .where(and(
          eq(vendor.userId, user.id),
          cursor ? or(
            lt(vendor.updatedAt, cursor.updatedAt),
            and(
              eq(vendor.updatedAt, cursor.updatedAt),
              lt(vendor.id, cursor.id)
            )
          ) : undefined
        )).orderBy(desc(vendor.updatedAt))
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

  getOne: protectedProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const user = ctx.user
      const [data] = await ctx.db.select()
        .from(vendor)
        .where(and(eq(vendor.id, input.id), eq(vendor.userId, user.id)))

      return { data };
    }),

  getByName: baseProcedure
    .input(z.object({
      name: z.string(),
      userId: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const [data] = await ctx.db.select()
        .from(vendor)
        .where(and(eq(vendor.name, input.name), eq(vendor.userId, input.userId)))

      return { data };
    }),

  create: baseProcedure
    .input(vendorInsertSchema)
    .mutation(async ({ ctx, input }) => {
      // const { id: userId } = ctx.user

      const [createdVendor] = await ctx.db
        .insert(vendor)
        .values({
          ...input,
        }).returning()

      return {
        vendor: createdVendor
      }
    }),

  update: baseProcedure
    .input(vendorUpdateSchema)
    .mutation(async ({ ctx, input }) => {

      if (!input || !input.id)
        throw new TRPCError({ code: "BAD_REQUEST" })

      const [updatedVendor] = await ctx.db
        .update(vendor)
        .set(input)
        .where(eq(vendor.id, input.id))
        .returning()

      return {
        vendor: updatedVendor
      }
    })
})
