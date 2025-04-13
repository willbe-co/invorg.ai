import { invoice, invoiceInsertSchema, invoiceUpdateSchema } from "@/db/schemas/invoice";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

import { and, desc, eq, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { vendor } from "@/db/schemas/vendor";

export const invoicesRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(z.object({
      cursor: z.object({
        id: z.string(),
        dueDate: z.date(),
      })
        .nullish(),
      limit: z.number().min(1).max(100)
    }))
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input
      const user = ctx.user
      const data = await ctx.db.select({
        id: invoice.id,
        userId: invoice.userId,
        vendorId: invoice.vendorId,
        invoiceNumber: invoice.invoiceNumber,
        documentUrl: invoice.documentUrl,
        subtotalAmount: invoice.subtotalAmount,
        taxAmount: invoice.taxAmount,
        totalAmount: invoice.totalAmount,
        paymentTerms: invoice.paymentTerms,
        state: invoice.state,
        dueDate: invoice.dueDate,
        issueDate: invoice.issueDate,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        vendor: {
          name: vendor.name,
          address: vendor.address,
          email: vendor.email
        }
      })
        .from(invoice)
        .where(and(
          eq(invoice.userId, user.id),
          cursor ? or(
            lt(invoice.dueDate, cursor.dueDate),
            and(
              eq(invoice.dueDate, cursor.dueDate),
              lt(invoice.id, cursor.id)
            )
          ) : undefined
        ))
        .orderBy(desc(invoice.dueDate))
        .leftJoin(vendor, eq(invoice.vendorId, vendor.id))
        .limit(limit + 1)

      const hasMore = data.length > limit
      const items = hasMore ? data.slice(0, -1) : data
      const lastItem = items[items.length - 1]
      const nextCursor = hasMore ? {
        id: lastItem.id,
        dueDate: lastItem.dueDate
      } : null

      return { items, nextCursor };
    }),

  getOne: protectedProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const user = ctx.user
      const [data] = await ctx.db.select({
        id: invoice.id,
        userId: invoice.userId,
        vendorId: invoice.vendorId,
        invoiceNumber: invoice.invoiceNumber,
        documentUrl: invoice.documentUrl,
        subtotalAmount: invoice.subtotalAmount,
        taxAmount: invoice.taxAmount,
        totalAmount: invoice.totalAmount,
        paymentTerms: invoice.paymentTerms,
        state: invoice.state,
        dueDate: invoice.dueDate,
        issueDate: invoice.issueDate,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        vendor: {
          name: vendor.name,
          address: vendor.address,
          email: vendor.email
        }
      })
        .from(invoice)
        .leftJoin(vendor, eq(invoice.vendorId, vendor.id))
        .where(and(eq(invoice.id, input.id), eq(invoice.userId, user.id)))


      return { data };
    }),

  getByInvoiceNumber: baseProcedure
    .input(z.object({
      invoiceNumber: z.string(),
      userId: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const [data] = await ctx.db.select({
        id: invoice.id,
        userId: invoice.userId,
        vendorId: invoice.vendorId,
        invoiceNumber: invoice.invoiceNumber,
        documentUrl: invoice.documentUrl,
        subtotalAmount: invoice.subtotalAmount,
        taxAmount: invoice.taxAmount,
        totalAmount: invoice.totalAmount,
        paymentTerms: invoice.paymentTerms,
        state: invoice.state,
        dueDate: invoice.dueDate,
        issueDate: invoice.issueDate,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        vendor: {
          name: vendor.name,
          address: vendor.address,
          email: vendor.email
        }
      })
        .from(invoice)
        .leftJoin(vendor, eq(invoice.vendorId, vendor.id))
        .where(and(eq(invoice.invoiceNumber, input.invoiceNumber), eq(invoice.userId, input.userId)))

      return { data };
    }),

  create: protectedProcedure
    .input(invoiceInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user

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
    }),

  update: baseProcedure
    .input(invoiceUpdateSchema)
    .mutation(async ({ ctx, input }) => {

      if (!input || !input.id)
        throw new TRPCError({ code: "BAD_REQUEST" })

      const [updatedInvoice] = await ctx.db
        .update(invoice)
        .set(input)
        .where(eq(invoice.id, input.id))
        .returning()

      return {
        invoice: updatedInvoice
      }
    })
})
