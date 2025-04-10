import { invoicesRouter } from '@/modules/invoice/server/procedures';
import { createTRPCRouter } from '../init';
import { TRPCError } from '@trpc/server';

export const appRouter = createTRPCRouter({
  invoice: invoicesRouter
});

export type AppRouter = typeof appRouter;
