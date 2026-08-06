import React from 'react';
import Link from 'next/link';
import { cn } from '../../../lib/utils';

interface FairwayDrawsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  href?: string;
}

/**
  * Official Fairway Draws logo component.
  * Recreates the embroidered cap logo aesthetic:
  * "FAIRWAY" in deep golf green serif, "DRAWS" in crimson red serif flanked by green golf tee lines.
  */
export default function FairwayDrawsLogo({
  className,
  size = 'md',
  showIcon = true,
  href = '/',
}: FairwayDrawsLogoProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const logoContent = (
    <div className={cn('inline-flex items-center gap-3 select-none group', className)}>
      {showIcon && (
        <div className={cn(
          'relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0F4C2E] via-[#0A2218] to-[#051610] border border-[#1C4634] shadow-md transition-transform duration-300 group-hover:scale-105 shrink-0',
          isSm ? 'w-8 h-8' : isLg ? 'w-12 h-12' : 'w-10 h-10'
        )}>
          {/* Custom Golf Flag & Ball Icon */}
          <svg viewBox="0 0 24 24" fill="none" className={cn(isSm ? 'w-5 h-5' : isLg ? 'w-7 h-7' : 'w-6 h-6')}>
            {/* Flag Pole */}
            <path d="M6 3V21" stroke="#D4AF37" strokeWidth="1.75" strokeLinecap="round"/>
            {/* Flag Triangular */}
            <path d="M6 4L16 8L6 12V4Z" fill="#B91C1C" stroke="#B91C1C" strokeWidth="1.5" strokeLinejoin="round"/>
            {/* Golf Ball */}
            <circle cx="16" cy="18" r="3.2" fill="#F8F6F0" stroke="#0F4C2E" strokeWidth="1"/>
            <circle cx="15.2" cy="17.2" r="0.4" fill="#0A2218"/>
            <circle cx="16.8" cy="17.2" r="0.4" fill="#0A2218"/>
            <circle cx="16" cy="18.8" r="0.4" fill="#0A2218"/>
          </svg>
        </div>
      )}

      <div className="flex flex-col leading-none">
        {/* FAIRWAY in Serif */}
        <span className={cn(
          'font-serif font-extrabold uppercase tracking-[0.16em] text-[#F8F6F0] group-hover:text-[#4ADE80] transition-colors duration-200 drop-shadow-sm',
          isSm ? 'text-base' : isLg ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
        )}>
          FAIRWAY
        </span>

        {/* DRAWS flanked by golf tee lines */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="h-[2px] w-3 sm:w-4 bg-[#15803D] rounded-full" />
          <span className={cn(
            'font-serif font-bold uppercase tracking-[0.28em] text-[#B91C1C]',
            isSm ? 'text-[9px]' : isLg ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-[11px]'
          )}>
            DRAWS
          </span>
          <span className="h-[2px] w-3 sm:w-4 bg-[#15803D] rounded-full" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{logoContent}</Link>;
  }

  return logoContent;
}
