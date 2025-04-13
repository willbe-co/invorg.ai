import { invoicesRouter } from '@/modules/invoice/server/procedures';
import { createTRPCRouter } from '../init';
import { TRPCError } from '@trpc/server';
import { vendorsRouter } from '@/modules/vendor/server/procedures';

export const appRouter = createTRPCRouter({
  invoice: invoicesRouter,
  vendor: vendorsRouter
});

export type AppRouter = typeof appRouter;
