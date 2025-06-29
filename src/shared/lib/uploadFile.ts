'use server';

import { env } from "@/env";
import { head, put } from "@vercel/blob";

export async function uploadFile({
  file,
  userId,
  path,
  isImage = false,
}: {
  file: File | Blob;
  userId: string;
  path: string;
  isImage?: boolean;
}): Promise<{ url: string; size: number }> {
  const blob = await put(`3d-models/${userId}/${isImage ? 'images/' : ''}${path}`, file, {
    access: "public",
    multipart: !isImage, // Multipart only for non-image files
    token: env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
  });
  const fileData = await head(blob.url);
  return {
    url: blob.url,
    size: fileData.size,
  };
}