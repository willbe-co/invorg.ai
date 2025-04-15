import { createTRPCRouter } from '../init';
import { invoicesRouter } from '@/modules/invoice/server/procedures';
import { vendorsRouter } from '@/modules/vendor/server/procedures';
import { usersRouter } from '@/modules/auth/server/procedures';

export const appRouter = createTRPCRouter({
  invoice: invoicesRouter,
  vendor: vendorsRouter,
  user: usersRouter
});

export type AppRouter = typeof appRouter;
