"use client";

import React, { HTMLAttributes, useState } from 'react'
import { signIn } from 'next-auth/react';

import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Icons } from './icons';
import { useToast } from '@/hooks/use-toast';

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement>{}

function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn('google')
    } catch (error) {
      toast({
        title: 'There was a problem',
        description: 'There was an error login with google',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button
        size={'sm'}
        className='w-full'
        onClick={loginWithGoogle}
        isLoading={isLoading}
      >
        {isLoading ? null : <Icons.google className='w-4 h-4 mr-3' />}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;