import { head, put } from "@vercel/blob";
import { eq, and, ilike, or } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { models } from "@/server/db/schema/models";
import { takeFirstOrThrow } from "@/server/db/utils";
import { PaginationInput, PutBody, SearchInput } from "@/shared/types/inputs";

export const modelRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(
      z.object({
        file: PutBody,
        image: PutBody,
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { file, image, name, description } = input;
      const genName = `${name}-${crypto.randomUUID()}`;

      const blobFile = await put(
        `3d-models/${ctx.session.user.id}/${genName}`,
        file,
        {
          access: "public",
          multipart: true,
        },
      );
      const blobImage = await put(
        `3d-models/${ctx.session.user.id}/images/img-${genName}`,
        image,
        {
          access: "public",
        },
      );

      const fileData = await head(blobFile.url);

      const model = await ctx.db
        .insert(models)
        .values({
          userId: ctx.session.user.id,
          name: genName,
          originalName: name,
          fileSize: fileData.size,
          fileUrl: blobFile.url,
          imageUrl: blobImage.url,
          description,
        })
        .returning()
        .then(takeFirstOrThrow);

      return model;
    }),

  getUserModels: protectedProcedure
    .input(
      z.object({
        pagination: PaginationInput,
        search: SearchInput
      })
    )
    .query(async ({ input, ctx }) => {
      const offset = (input.pagination.page - 1) * input.pagination.perPage;

      return await ctx.db
        .select()
        .from(models)
        .limit(input.pagination.perPage)
        .offset(offset)
        .where(and(
          eq(models.userId, ctx.session.user.id),
          or(
            ilike(models.name, `%${input.search.q}%`),
            ilike(models.originalName, `%${input.search.q}%`),
            ilike(models.description, `%${input.search.q}%`),
          )
        ));
    }),

  getModels: publicProcedure.input(PaginationInput).query(async ({ ctx }) => {
    return await ctx.db.select().from(models);
  }),

  getModelById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const model = await ctx.db
        .select()
        .from(models)
        .where(eq(models.id, input.id))
        .then(takeFirstOrThrow);

      return model;
    }),
});
