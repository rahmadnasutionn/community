"use client";

import { SettingRequest, SettingValidator } from '@/lib/validators/setting';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import {
  useForm
} from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { z } from 'zod';
import { Button } from './ui/button';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Spinner from './ui/spinner';

interface UsernameFormProps {
  user: Pick<User, 'id' | 'username'>
}

type FormData = z.infer<typeof SettingValidator>

function UsernameForm({ user }: UsernameFormProps) {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(SettingValidator),
    defaultValues: {
      name: user?.username || ''
    }
  });

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: FormData) => {
      const payload: FormData = { name };

      const { data } = await axios.patch('/api/username/', payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast({
            title: 'Login required',
            description:
              'you must be login to do that',
            variant: 'destructive',
          });
        }

        if (err.response?.status === 409) {
            return toast({
              title: 'Username already exist',
              description:
                'please choose another username',
              variant: 'destructive',
            });
        }

        return toast({
            title: 'Something went wrong.',
            description: 'Your username was not updated. Please try again.',
            variant: 'destructive',
        })
      }
    },
    onSuccess: () => {
      toast({
        description:
          'Your username has been updated'
      });

      router.refresh();
    }
  })

  return (
    <form onSubmit={handleSubmit((event) => updateUsername(event))}>
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please enter a display you are comfortable
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-zinc 800">
                u/
              </span>
            </div>

            <Label className='sr-only' htmlFor='username'>
              Name
            </Label>
            <Input 
              id='username'
              className='w-[400px] pl-6'
              {...register('name')}
            />

            {errors?.name && (
              <p className="px-1 text-red-600 text-xs">
                {errors.name.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            aria-label='button change name'
            disabled={isLoading}
          >
            {isLoading 
            ? <Spinner className='bg-white' />  
            : "Change Name"
            }
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UsernameForm;