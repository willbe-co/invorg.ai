import { invoice, invoiceInsertSchema, invoiceUpdateSchema } from "@/db/schemas/invoice";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

import { and, desc, eq, gte, lt, lte, or, SQL } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { vendor } from "@/db/schemas/vendor";

export const invoicesRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(z.object({
      cursor: z.object({
        id: z.string(),
        dueDate: z.date(),
      }).nullish(),
      limit: z.number().min(1).max(100),
      vendor_id: z.string().nullish(),
      vendor_query: z.string().nullish(),
      state: z.string().nullish(),
      start_date: z.date().nullish(),
      end_date: z.date().nullish(),
    }))
    .query(async ({ ctx, input }) => {

      const { cursor, limit, vendor_id, vendor_query, state, start_date, end_date } = input;
      const user = ctx.user

      const conditions: SQL[] = [eq(invoice.userId, user.id)];

      if (cursor) {
        const cursorConditions = or(
          lt(invoice.dueDate, cursor.dueDate),
          and(
            eq(invoice.dueDate, cursor.dueDate),
            lt(invoice.id, cursor.id)
          )
        )
        conditions.push(cursorConditions!)
      }

      if (start_date) {
        conditions.push(gte(invoice.dueDate, start_date));
      }

      if (end_date) {
        conditions.push(lte(invoice.dueDate, end_date));
      }

      if (vendor_id) {
        conditions.push(eq(invoice.vendorId, vendor_id));
      }

      if (state) {
        //@ts-ignore
        const stateCondition = eq(invoice.state, state);
        conditions.push(stateCondition);
      }

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
        currency: invoice.currency,
        paymentMethod: invoice.paymentMethod,
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
        .where(and(...conditions))
        .orderBy(desc(invoice.dueDate))
        .leftJoin(vendor, eq(invoice.vendorId, vendor.id))
        .limit(limit + 1)

      let filteredData = data;
      if (vendor_query && vendor_query.trim() !== '') {
        const searchTerm = vendor_query.toLowerCase();
        filteredData = data.filter(item =>
          item.vendor?.name?.toLowerCase().includes(searchTerm)
        );
      }

      const hasMore = filteredData.length > limit;
      const items = hasMore ? filteredData.slice(0, -1) : filteredData;

      let nextCursor = null;
      if (hasMore && items.length > 0) {
        const lastItem = items[items.length - 1];
        if (lastItem && lastItem.id && lastItem.dueDate) {
          nextCursor = {
            id: lastItem.id,
            dueDate: lastItem.dueDate
          };
        }
      }

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
        currency: invoice.currency,
        paymentMethod: invoice.paymentMethod,
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
        currency: invoice.currency,
        paymentMethod: invoice.paymentMethod,
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

  // create: protectedProcedure
  //   .input(invoiceInsertSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     const { id: userId } = ctx.user
  create: baseProcedure
    .input(invoiceInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = input

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
