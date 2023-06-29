import { User } from 'next-auth';
import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar';
import Image from 'next/image';
import { Icons } from './icons';
import { AvatarProps } from '@radix-ui/react-avatar';

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'name' | 'image'>;
}
  
function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square w-full h-full">
          <Image 
            fill
            src={user.image}
            alt='Avatar user'
            referrerPolicy='no-referrer'
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          <Icons.user className='w-4 h-4' />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;