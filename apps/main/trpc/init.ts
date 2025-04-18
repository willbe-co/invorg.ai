import { db } from '@/db';
import { getSession } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import superjson from "superjson"
import { ZodError } from 'zod';

export const createTRPCContext = cache(async (opts?: { headers?: Headers }) => {
  const headersInput = opts?.headers || await headers();
  const heads = new Headers(headersInput)
  heads.set("x-trpc-source", "nextjs-react")

  const session = await getSession({ headers: heads })

  return { db, session: session?.session, user: session?.user, headers: heads }
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
  .use(async function isAuthed({ ctx, next }) {

    if (!ctx.session || !ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to access this resource" });
    }

    return next({
      ctx: {
        session: ctx.session,
        user: ctx.user

      },
    });
  });

export const remoteProcedure = t.procedure
  .use(async function isAuthed({ ctx, next }) {
    const validToken = process.env.WEBHOOK_SECRET_TOKEN;

    if (!validToken) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Webhook token not configured on server"
      });
    }

    const providedToken = ctx.headers?.get("x-webhook-token") || "";

    if (providedToken !== validToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or missing webhook token"
      });
    }
    return next({ ctx: { ...ctx } })
  })
