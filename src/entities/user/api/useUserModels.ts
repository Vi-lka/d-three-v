"use client";

import { useQueryStates } from "nuqs";

import { api } from "@/shared/api/trpc/react";
import { searchParamsPagination, searchParamsSearch } from "@/shared/types/inputs";

export function useUserModels() {
  const [pagination] = useQueryStates(searchParamsPagination);
  const [search] = useQueryStates(searchParamsSearch);

  const { data, error, isError, isLoading, refetch } =
    api.model.getUserModels.useQuery({
      pagination,
      search
    });

  return { data, error, isError, isLoading, refetch };
}
