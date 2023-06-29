"use client";

import useEventListener from '@/hooks/useEventListener';
import React, { useState } from 'react'
import { Button } from './ui/button';
import Tooltip from './ui/tooltip';
import { cn } from '@/lib/utils';
import { ChevronUp } from 'lucide-react';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const isReduceMotion = 
    typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  const handleScroll = () => {
    setIsVisible(window.scrollY > 100);
  };

  useEventListener('scroll', handleScroll);

  const goToTop = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget?.blur();
    window.scrollTo({
      top: 0,
      behavior: isReduceMotion ? 'auto' : 'smooth',
    });
  }

  return (
    <div className='flex flex-row w-full justify-end'>
      <Tooltip
        content="Scroll to Top"
        className={cn('fixed bottom-2 ring-2 pointer-events-none opacity-0 translate-y-4 cursor-pointer will-change-transform', isVisible ? 'opacity-80 transform-none pointer-events-auto' : '')}
      >
        <Button
            aria-label='Scroll to Top'
            className='fixed cursor-pointer bottom-6 right-6'
            onClick={goToTop}
            variant={'default'}
        >
          <ChevronUp className='w-4 h-4 cursor-pointer' />
        </Button>

      </Tooltip>
    </div>
  )
}

export default ScrollToTop