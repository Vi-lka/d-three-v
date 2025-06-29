import { del, head, put } from "@vercel/blob";
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
        fileUrl: z.string(),
        fileSize: z.number(),
        imageUrl: z.string().nullable(),
        name: z.string(),
        originalName: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { fileUrl, fileSize, imageUrl, name, originalName, description } = input;

      const model = await ctx.db
        .insert(models)
        .values({
          userId: ctx.session.user.id,
          name,
          originalName,
          fileSize,
          fileUrl,
          imageUrl: imageUrl ?? "",
          description,
        })
        .returning()
        .then(takeFirstOrThrow);

      return model;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional().nullable(),
        file: PutBody.optional(),
        image: PutBody.optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, description, file, image } = input;

      // Verify the model exists and belongs to the user
      const existingModel = await ctx.db
        .select()
        .from(models)
        .where(and(
          eq(models.id, id),
          eq(models.userId, ctx.session.user.id)
        ))
        .then(takeFirstOrThrow);

      const updateData: Partial<typeof models.$inferInsert> = {};
      let genName = existingModel.name;

      // Handle file update
      if (file) {
        genName = name ? `${name}-${crypto.randomUUID()}` : existingModel.name;
        const blobFile = await put(
          `3d-models/${ctx.session.user.id}/${genName}`,
          file,
          {
            access: "public",
            multipart: true,
          }
        );
        await del(existingModel.fileUrl);

        const fileData = await head(blobFile.url);
        updateData.fileUrl = blobFile.url;
        updateData.fileSize = fileData.size;
      }

      // Handle image update
      if (image !== undefined) {
        if (image) {
          const blobImage = await put(
            `3d-models/${ctx.session.user.id}/images/img-${genName}`,
            image,
            {
              access: "public",
            }
          );
          await del(existingModel.imageUrl);

          updateData.imageUrl = blobImage.url;
        } else {
          updateData.imageUrl = undefined;
        }
      }

      // Update name and description if provided
      if (name) {
        updateData.name = genName;
        updateData.originalName = name;
      }
      if (description !== undefined) {
        updateData.description = description;
      }

      // Perform the update
      const updatedModel = await ctx.db
        .update(models)
        .set(updateData)
        .where(eq(models.id, id))
        .returning()
        .then(takeFirstOrThrow);

      return updatedModel;
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
