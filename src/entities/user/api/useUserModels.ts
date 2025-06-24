"use client";

import { useQueryStates } from "nuqs";

import { api } from "@/shared/api/trpc/react";
import { searchParamsPagination } from "@/shared/types/inputs";

export function useUserModels() {
  const [searchParams] = useQueryStates(searchParamsPagination);

  const { data, error, isError, isLoading } =
    api.model.getUserModels.useQuery(searchParams);
  return { data, error, isError, isLoading };
}
