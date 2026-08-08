'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Homepage hero: a mobile-first, high-impact golf course composition.
 * The product image is deliberately allowed to lead the right side of the
 * frame, while the copy stays readable through layered gradients.
 */
export default function HeroSection() {
  return (
    <section className="relative min-h-[810px] overflow-hidden bg-[#F8FAF6] pt-24 sm:min-h-[770px] md:pt-32 lg:min-h-[690px]">
      {/* Golden Hour Golf Course Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-banner.jpg"
          alt="Fairway Draws Golf Background"
          fill
          priority
          className="object-cover object-[58%_center] sm:object-center lg:object-right opacity-95"
        />
        {/* Responsive Readability Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8FAF6]/97 via-[#F8FAF6]/82 to-transparent lg:w-[64%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAF6]/45 via-transparent to-[#073826]/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,.28),transparent_35%)]" />
      </div>

      <div className="container-custom relative z-10 flex min-h-[670px] items-start pt-5 pb-32 sm:min-h-[625px] sm:items-center sm:pb-28 lg:min-h-[600px] lg:pb-20">
        <div className="grid w-full grid-cols-1 items-center lg:grid-cols-12">
          {/* LEFT — Main Hero Headline & CTAs */}
          <div className="flex max-w-[720px] flex-col items-start text-left lg:col-span-8">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#073826] border border-[#16A34A]/40 text-white text-[11px] font-bold uppercase tracking-widest mb-6 shadow-md">
              <span className="text-sm">🏆</span>
              <span>PREMIUM GOLF COMPETITIONS</span>
            </div>

            {/* Main 3-Tier Headline */}
            <div className="mb-5">
              <h1 className="font-heading text-[clamp(3.35rem,14vw,5.3rem)] font-black leading-[0.82] tracking-[-0.075em] text-[#073826] uppercase text-shadow-hero-green sm:tracking-[-0.06em]">
                WIN PREMIUM
              </h1>
              <div className="my-2 flex items-center gap-2.5 sm:gap-4">
                <span className="text-xl font-black text-[#b91c1c] sm:text-3xl">—</span>
                <span className="font-heading text-[clamp(2.55rem,10.5vw,4rem)] font-black leading-none tracking-[-0.055em] text-[#b91c1c] uppercase text-shadow-hero-red">
                  GOLF GEAR
                </span>
                <span className="text-xl font-black text-[#b91c1c] sm:text-3xl">—</span>
              </div>
              <span className="font-heading block text-[clamp(3.35rem,14vw,5.3rem)] font-black leading-[0.82] tracking-[-0.075em] text-[#073826] uppercase text-shadow-hero-green sm:tracking-[-0.06em]">
                FOR LESS
              </span>
            </div>

            {/* Description Subtitle */}
            <p className="mb-8 max-w-[20rem] rounded-2xl border border-white/55 bg-white/40 p-3.5 font-sans text-sm font-medium leading-relaxed text-[#1e342b] shadow-xs backdrop-blur-xs sm:max-w-xl sm:text-base">
              Enter charity golf draws from just <strong className="text-[#073826] font-bold">£1 per ticket</strong>. Fair, transparent &amp; fully verified. Over <strong className="text-[#b91c1c] font-bold">£180k+</strong> in luxury prizes already won by our community.
            </p>

            {/* Action Buttons */}
            <div className="flex w-full flex-wrap items-center gap-3.5 sm:w-auto sm:gap-4">
              <Link
                href="/live-raffles"
                className="btn-glossy-red px-7 py-3.5 rounded-2xl text-white font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                <span>VIEW ALL COMPETITIONS</span>
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <Link
                href="/how-it-works"
                className="btn-glossy-white px-6 py-3.5 rounded-2xl text-[#073826] font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                <span className="w-5 h-5 rounded-full bg-[#073826] text-white flex items-center justify-center text-xs font-serif font-bold italic">
                  i
                </span>
                <span>HOW IT WORKS</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Dark Green Curved Stats Section */}
      <div className="relative z-10 mt-6 bg-gradient-to-r from-[#073826] via-[#0b4d35] to-[#073826] rounded-t-[32px] sm:rounded-t-[44px] border-t-2 border-[#16A34A]/30 pt-8 pb-10 shadow-[0_-10px_35px_rgba(0,0,0,0.25)]">
        <div className="container-custom">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
            {/* Stat Card 1 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 sm:p-5 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.03]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#dc2626] flex items-center justify-center text-white text-lg sm:text-xl shadow-lg mb-2 border border-white/20">
                🏆
              </div>
              <span className="font-heading font-black text-lg sm:text-2xl lg:text-3xl text-white tracking-tight">
                2,400+
              </span>
              <span className="font-sans text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-white/80 mt-1">
                DRAWS COMPLETED
              </span>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 sm:p-5 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.03]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#dc2626] flex items-center justify-center text-white text-lg sm:text-xl shadow-lg mb-2 border border-white/20">
                🎫
              </div>
              <span className="font-heading font-black text-lg sm:text-2xl lg:text-3xl text-white tracking-tight">
                £1
              </span>
              <span className="font-sans text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-white/80 mt-1">
                MINIMUM ENTRY
              </span>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 sm:p-5 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.03]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#dc2626] flex items-center justify-center text-white text-lg sm:text-xl shadow-lg mb-2 border border-white/20">
                🛡️
              </div>
              <span className="font-heading font-black text-lg sm:text-2xl lg:text-3xl text-white tracking-tight">
                VERIFIED
              </span>
              <span className="font-sans text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-white/80 mt-1">
                FAIR DRAWS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
