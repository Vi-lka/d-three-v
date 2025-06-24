"use client";

import { useQueryStates } from "nuqs";
import { useCallback, type ReactNode } from "react";

import { PAGE_SIZE_OPTIONS } from "@/shared/lib/consts";
import { cn } from "@/shared/lib/utils";
import { searchParamsPagination } from "@/shared/types/inputs";

import {
  Pagination as PaginationWrapper,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNextButton,
  PaginationPreviousButton,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const MAX_VISIBLE_PAGES = 5;

export interface PaginationProps {
  totalCount: number;
  pageSizeSelectOptions?: boolean;
}

/**
 * Pagination component
 * @example
 * ```
 * <Pagination
    totalCount={500}
    pageSizeSelectOptions={true}
  />
 * ```
 */
export function Pagination({
  totalCount,
  pageSizeSelectOptions = false,
}: PaginationProps) {
  const [{ page, perPage }, setSearchParams] = useQueryStates(
    searchParamsPagination,
  );

  const totalPageCount = Math.ceil(totalCount / perPage);

  const navToPage = useCallback(
    (newPage: number) => {
      void setSearchParams((prev) => ({ ...prev, page: newPage }));
    },
    [setSearchParams],
  );

  const navToPageSize = useCallback(
    (newPageSize: number) => {
      void setSearchParams({ page: 1, perPage: newPageSize });
    },
    [setSearchParams],
  );

  const renderPageNumbers = useCallback(() => {
    const items: ReactNode[] = [];

    if (totalPageCount <= MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationButton
              isActive={page === i}
              onClick={() => navToPage(i)}
            >
              {i}
            </PaginationButton>
          </PaginationItem>,
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationButton isActive={page === 1} onClick={() => navToPage(1)}>
            1
          </PaginationButton>
        </PaginationItem>,
      );

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPageCount - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationButton
              isActive={page === i}
              onClick={() => navToPage(i)}
            >
              {i}
            </PaginationButton>
          </PaginationItem>,
        );
      }

      if (page < totalPageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      items.push(
        <PaginationItem key={totalPageCount}>
          <PaginationButton
            isActive={page === totalPageCount}
            onClick={() => navToPage(totalPageCount)}
          >
            {totalPageCount}
          </PaginationButton>
        </PaginationItem>,
      );
    }

    return items;
  }, [navToPage, page, totalPageCount]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
      {pageSizeSelectOptions && (
        <div className="flex flex-col gap-4 flex-1">
          <SelectRowsPerPage setPageSize={navToPageSize} pageSize={perPage} />
        </div>
      )}
      <PaginationWrapper
        className={cn({ "md:justify-end": pageSizeSelectOptions })}
      >
        <PaginationContent className="max-sm:gap-0">
          <PaginationItem>
            <PaginationPreviousButton
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : undefined}
              className={
                page === 1 ? "pointer-events-none opacity-50" : undefined
              }
              onClick={() => navToPage(Math.max(page - 1, 1))}
            />
          </PaginationItem>
          <div className="hidden md:flex flex-row items-center gap-1">
            {renderPageNumbers()}
          </div>
          <PaginationItem>
            <PaginationNextButton
              aria-disabled={page === totalPageCount}
              tabIndex={page === totalPageCount ? -1 : undefined}
              className={
                page === totalPageCount
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              onClick={() => navToPage(Math.min(page + 1, totalPageCount))}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationWrapper>
    </div>
  );
}

function SelectRowsPerPage({
  setPageSize,
  pageSize,
}: {
  setPageSize: (newSize: number) => void;
  pageSize: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="whitespace-nowrap text-sm">Rows per page</span>

      <Select
        value={String(pageSize)}
        onValueChange={(value) => setPageSize(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select page size">
            {String(pageSize)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
