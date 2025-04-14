import 'server-only';

import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';
import { createCallerFactory, createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { type AppRouter, appRouter } from './routers/_app';
import { headers } from 'next/headers';

const createContext = cache(async () => {
  const heads = new Headers(await headers())
  heads.set("x-trpc-source", "rsc")
  return createTRPCContext({ headers: heads })
})

export const getQueryClient = cache(makeQueryClient);
// const caller = createCallerFactory(appRouter)(createTRPCContext);
const caller = createCallerFactory(appRouter)(createContext)

export const { trpc, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
