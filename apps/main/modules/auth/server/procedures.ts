import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

import { eq } from "drizzle-orm";
import { user } from "@/db/schemas";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  getIdByEmail: baseProcedure
    .input(z.object({
      email: z.string().email("Not a valid email")
    }))
    .query(async ({ ctx, input }) => {
      const [userExists] = await ctx.db
        .select({
          id: user.id
        })
        .from(user)
        .where(eq(user.email, input.email))

      if (!userExists) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Email not found" })
      }

      return ({ data: userExists })
    }),
})
