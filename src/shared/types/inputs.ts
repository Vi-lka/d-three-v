import { Readable } from "stream";

import z from "zod";

export const PutBody = z.custom<
  string | Readable | Buffer | Blob | ArrayBuffer | ReadableStream | File
>(
  (val) =>
    typeof val === "string" ||
    val instanceof Buffer ||
    val instanceof ArrayBuffer ||
    val instanceof Blob ||
    val instanceof Readable ||
    val instanceof ReadableStream ||
    val instanceof File,
  "Invalid type",
);

export type PutBody = z.infer<typeof PutBody>;
