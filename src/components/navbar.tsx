import Link from 'next/link';
import React from 'react'
import { Icons } from './icons';
import { buttonVariants } from './ui/button';
import { getAuthSession } from '@/lib/auth';
import UserAccountNav from './user-account-nav';
import DarkModeToggle from './darkmode-toggle';
import Image from 'next/image';
import SearchBar from './search-bar';

async function Navbar() {
  const session = await getAuthSession();

  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 py-4 border-b border-zinc-300 z-10'>
      <div className="container max-w-7xl mx-auto flex items-center justify-between gap-2">
        <Link href={'/'} className='flex gap-2 items-center'>
          <Image
            src={'/favicon.png'}
            width={24}
            height={24}
            alt='Logo Icon'
          />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">Community</p>
        </Link>

        <SearchBar />

        {session?.user ? (
          <UserAccountNav user={session?.user} />
        ) : (
          <Link href={'/sign-in'} className={buttonVariants()}>
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;