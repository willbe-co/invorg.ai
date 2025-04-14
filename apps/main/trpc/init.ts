import { db } from '@/db';
import { getSession } from '@/lib/auth';
import { initTRPC } from '@trpc/server';
import { cache } from 'react';
import superjson from "superjson"
import { ZodError } from 'zod';

export const createTRPCContext = cache(async (
  opts: { headers: Headers }
) => {
  const session = await getSession({ headers: opts.headers })

  return { db, session: session?.session, user: session?.user, ...opts }
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const baseProcedure = t.procedure

export const protectedProcedure = t.procedure
  .use(({ ctx, next }) => {
    console.log("from init.ts: ", ctx)
    // if (!ctx?.user) {
    //   throw new TRPCError({ code: "UNAUTHORIZED" });
    // }

    return next({
      ctx: {
        session: ctx.session!,
        user: ctx.user!
      },
    });
  });
