import React from 'react'
import { Icons } from './icons';
import Link from 'next/link';
import UserAuthForm from './user-auth-form';

function Signup() {
  return (
    <div className='container mx-auto w-full flex flex-col justify-center space-y-6 sm-w-[400px]'>
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className='w-6 h-6 mx-auto' />
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign up
        </h1>
        <p className="text-sm max-w-xs mx-auto">
          By continue, you agree terms and policy
        </p>

        <UserAuthForm />

        <p className="px-8 text-sm text-center text-zinc-700">
          Already have account?
          <Link 
            href={'/sign-in'}
            className='hover:text-zinc-800 text-sm underline underline-offset-4'
          >
            Signin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;