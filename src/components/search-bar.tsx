"use client";

import { useEffect, useRef, useState } from 'react'
import { 
  Command, 
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './ui/command';
import useEventListener from '@/hooks/useEventListener';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Prisma, Subreddit } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import useDebounce from '@/hooks/use-debounce';
import Spinner from './ui/spinner';

function SearchBar() {
  const commandRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const debouncedValue = useDebounce(input, 500);

  const { data: queryResult, isFetching, refetch, isFetched } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const { data } = await axios.get(`/api/search?q=${input}`)
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType,
      })[]
    },
    queryKey: ['search-query'],
    enabled: false,
  });

  const handleKeyboardShorcut = (event: KeyboardEvent) => {
    if (searchRef.current) {
      if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        event.stopPropagation();
        searchRef.current?.focus();
      }
    }
  };

  useOnClickOutside(commandRef, () => setInput(''));
  useEventListener('keydown', handleKeyboardShorcut);

  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      refetch();
    };

    init();
  }, [debouncedValue]);

  return (
    <Command
      ref={commandRef}
      className='relative rounded-lg border max-w-lg z-50 overflow-visible'
    >
      <CommandInput
        isLoading={isFetching}
        ref={searchRef}
        value={input}
        onValueChange={(text) => {
          setInput(text)
        }}
        className='outline-none border-none focus:border-none focus:outline-none ring-0'
        placeholder='Search communities...'
      />
      <kbd className='absolute top-2 right-2 justify-center bg-slate-50 flex items-center border'>
        <span className='text-xs'>ctrl k</span>
      </kbd>

      {input.length > 0 ? (
        <CommandList className='absolute bg-white top-full inset-x-0 shadow rounded-b-md z-20'>
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResult?.length ?? 0) > 0 ? (
            <CommandGroup heading="communities">
              {queryResult?.map((subreddit) => (
                <CommandItem
                  key={subreddit.id}
                  value={subreddit.name}
                  onSelect={event => {
                    router.push(`/r/${event}`);
                    router.refresh();
                  }}
                >
                  <Users className='mr-2 h-4 w-4' />
                  <a href={`/r/${subreddit.name}`}>{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
      
    </Command>
  )
}

export default SearchBar