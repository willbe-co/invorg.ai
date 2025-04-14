import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';
import { type NextRequest } from 'next/server';
import { headers } from 'next/headers';

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => createTRPCContext({
      headers: req.headers
    }),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
        : undefined
  });

export { handler as GET, handler as POST };
