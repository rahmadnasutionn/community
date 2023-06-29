"use client";

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { X } from 'lucide-react'

function CloseModal() {
  const router = useRouter();

  return (
    <Button 
      variant={'subtle'} 
      aria-label='close-modal' 
      className='w-6 h-6 p-0 rounded-md'
      onClick={() => router.back()}
    >
      <X className='w-4 h-4' />
    </Button>
  )
}

export default CloseModal