"use client";

import { User } from 'next-auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import UserAvatar from './user-avatar';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface UserAccountNavProps {
  user: Pick<User, 'name' | 'image' | 'email'>;
}

function UserAccountNav({ user }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar 
          className='w-8 h-8'
          user={{
            name: user.name || null,
            image: user.image || null,
          }} 
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className='bg-white' align='end'>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className='font-medium'>{user.name}</p> }
            {user.email && <p className='w-[200px] text-sm truncate text-zinc-700'>{user.email}</p> }
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href='/r/create'>Create community</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href='/settings'>Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          className='cursor-pointer'
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`
            })
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>

    </DropdownMenu>
  )
}

export default UserAccountNav