"use client"

import { Loader, Search, XIcon } from 'lucide-react'
import React, { useEffect, useState, useTransition } from 'react'
import { Input } from '../ui/input'
import { searchParamsSearch } from '@/shared/types/inputs';
import { useQueryStates } from 'nuqs';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { Button } from '../ui/button';
import { cn } from '@/shared/lib/utils';

interface SearchFieldProps {
  placeholder?: string,
  disabled?: boolean
  className?: string,
}

export default function SearchField({
  placeholder,
  disabled,
  className,
}: SearchFieldProps) {
  const [{ q: search }, setSearch] = useQueryStates(searchParamsSearch)

  const [searchValue, setSearchValue] = useState(search ?? "")
  const debouncedValue = useDebounce(searchValue, 300)

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (search === null) setSearchValue("")
  }, [search])

  useEffect(() => {
    startTransition(async () => {
      await setSearch((prev) => ({...prev, q: debouncedValue}))
    })
  }, [debouncedValue, setSearch, startTransition])

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        disabled={disabled}
        className={cn("pl-10 pr-7",className)}
      />
      {searchValue.length > 0 && (
        <Button
          variant="ghost"
          className='absolute right-0 top-1/2 -translate-y-1/2 w-fit h-fit p-2 text-muted-foreground z-10'
          onClick={() => {
            setSearchValue("")
          }}
        >
          <XIcon size={14} />
        </Button>
      )}
      {isPending && (
        <div className='w-7 h-7 bg-muted flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 p-4 rounded-md z-20'>
          <Loader size={18} className='flex-none animate-spin text-muted-foreground' />
        </div>
      )}
    </div>
  )
}
