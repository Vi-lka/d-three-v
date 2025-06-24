import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";
import { Readable } from "stream";
import z from "zod";

import { PAGE_SIZE_OPTIONS } from "../lib/consts";

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


export const PaginationInput = z.object({
  page: z.number().min(1).default(1),
  perPage: z
    .number()
    .min(PAGE_SIZE_OPTIONS[0])
    .max(PAGE_SIZE_OPTIONS[PAGE_SIZE_OPTIONS.length - 1]!)
    .default(PAGE_SIZE_OPTIONS[0]),
});
export type PaginationInput = z.infer<typeof PaginationInput>;

export const searchParamsPagination = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(PAGE_SIZE_OPTIONS[0]),
};
export const searchParamsPaginationCache = createSearchParamsCache(
  searchParamsPagination,
);


export const SearchInput = z.object({
  q: z.string().optional(),
});
export type SearchInput = z.infer<typeof SearchInput>;

export const searchParamsSearch = {
  q: parseAsString.withDefault(""),
};
export const searchParamsSearchCache = createSearchParamsCache(searchParamsSearch);
