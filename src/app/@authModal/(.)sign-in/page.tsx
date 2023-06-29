"use client";

import CloseModal from '@/components/close-modal'
import Signin from '@/components/signin'
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react'

function page() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useOnClickOutside(ref, () => router.back());

  return (
    <div className='fixed inset-0 bg-zinc-900/20 z-50'>
      <div className="container mx-auto flex items-center h-full max-w-lg" ref={ref}>
        <div className="relative bg-white w-full h-fit py-20 px-2 rounded-lg">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>

          <Signin />
        </div>
      </div>
    </div>
  )
}

export default page