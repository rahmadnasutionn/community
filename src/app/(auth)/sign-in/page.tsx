import Signin from '@/components/signin';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

function SigninPage() {
  return (
    <div className='absolute inset-0'>
      <div className="max-w-2xl mx-auto h-full flex flex-col items-center justify-center">
        <Link 
          href={'/'} 
          className={cn(buttonVariants({ variant: 'ghost' }), 'self-start -mt-20')}
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          Home
        </Link>

        <Signin />
      </div>
    </div>
  );
};

export default SigninPage;