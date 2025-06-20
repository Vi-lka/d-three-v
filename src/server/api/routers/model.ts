import { z } from 'zod';
import { put } from '@vercel/blob';
import { eq } from 'drizzle-orm';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { PutBody } from '@/types/inputs';
import { models } from '@/server/db/schema/models';
import { takeFirstOrThrow } from '@/server/db/utils';

export const modelRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(
      z.object({
        file: PutBody,
        image: PutBody,
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { file, image, name, description } = input;
      const genName = `${name}-${crypto.randomUUID()}`

      const blobFile = await put(`3d-models/${ctx.session.user.id}/${genName}`, file, {
        access: 'public',
        multipart: true,
      });
      const blobImage = await put(`3d-models/${ctx.session.user.id}/images/img-${genName}`, image, {
        access: 'public'
      });

      const model = await ctx.db.insert(models).values({
          userId: ctx.session.user.id,
          name: genName,
          originalName: name,
          fileUrl: blobFile.url,
          imageUrl: blobImage.url,
          description,
      })
      .returning()
      .then(takeFirstOrThrow)

      return model;
    }),

  getUserModels: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(models)
      .where(eq(models.userId, ctx.session.user.id));
  }),

  getModel: publicProcedure
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