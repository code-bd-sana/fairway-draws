'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { heroData } from '../../../data/homepage/hero.data';
import DrawCard from '../shared/DrawCard';
import { raffleService } from '../../../services/raffle.service';
import type { Draw } from '../../../types/draw.types';

/**
 * High-fidelity 3D Hero section for Fairway Draws matching reference design.
 * Features:
 * - Sunset golf course background with PING golf bag banner visual
 * - 3-tier headline typography (WIN PREMIUM — GOLF GEAR — FOR LESS)
 * - Glossy 3D red primary action button & pristine white info pill
 * - Dark forest green bottom stats panel with 3 glassmorphic cards
 */
export default function HeroSection() {
  const [dynamicFeaturedDraw, setDynamicFeaturedDraw] = useState<Draw | null>(null);

  useEffect(() => {
    async function fetchFeaturedRaffle() {
      try {
        const res = await raffleService.getPublicRaffles({ limit: 1, sort: 'Most Popular' });
        if (res.data && res.data.length > 0) {
          const r = res.data[0];
          setDynamicFeaturedDraw({
            id: r.id,
            title: r.title,
            description: r.description,
            image: r.mainImage || '',
            ticketPrice: Number(r.pricePerTicket),
            totalTickets: r.totalTickets,
            soldTickets: r.ticketsSold,
            endDate: new Date(r.endDate).toLocaleDateString(),
            status: (r.status === 'ACTIVE' ? 'live' : 'ended') as 'live' | 'ended',
            category: 'general',
            slug: r.slug,
          });
        }
      } catch {
        /* fallback to static */
      }
    }
    fetchFeaturedRaffle();
  }, []);

  return (
    <section className="relative pt-24 md:pt-32 overflow-hidden bg-[#F8FAF6]">
      {/* Golden Hour Golf Course Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-banner.jpg"
          alt="Fairway Draws Golf Background"
          fill
          priority
          className="object-cover object-center lg:object-right opacity-95"
        />
        {/* Responsive Readability Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8FAF6]/95 via-[#F8FAF6]/85 to-transparent lg:w-[65%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAF6]/60 via-transparent to-[#073826]/30" />
      </div>

      <div className="container-custom relative z-10 pt-4 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT — Main Hero Headline & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#073826] border border-[#16A34A]/40 text-white text-[11px] font-bold uppercase tracking-widest mb-6 shadow-md">
              <span className="text-sm">🏆</span>
              <span>PREMIUM GOLF COMPETITIONS</span>
            </div>

            {/* Main 3-Tier Headline */}
            <div className="mb-4">
              <h1 className="font-heading text-[44px] sm:text-[62px] md:text-[76px] xl:text-[84px] font-black leading-[0.9] tracking-tight text-[#073826] uppercase text-shadow-hero-green">
                WIN PREMIUM
              </h1>
              <div className="flex items-center gap-3 sm:gap-4 my-1.5 sm:my-2">
                <span className="text-[#b91c1c] text-xl sm:text-3xl font-black">—</span>
                <span className="font-heading text-[32px] sm:text-[48px] md:text-[58px] xl:text-[64px] font-black tracking-wider text-[#b91c1c] uppercase text-shadow-hero-red">
                  GOLF GEAR
                </span>
                <span className="text-[#b91c1c] text-xl sm:text-3xl font-black">—</span>
              </div>
              <span className="font-heading text-[44px] sm:text-[62px] md:text-[76px] xl:text-[84px] font-black leading-[0.9] tracking-tight text-[#073826] uppercase block text-shadow-hero-green">
                FOR LESS
              </span>
            </div>

            {/* Description Subtitle */}
            <p className="font-sans text-sm sm:text-base text-[#1e342b] font-medium leading-relaxed mb-8 max-w-xl bg-white/40 backdrop-blur-xs p-3.5 rounded-2xl border border-white/60 shadow-xs">
              Enter charity golf draws from just <strong className="text-[#073826] font-bold">£1 per ticket</strong>. Fair, transparent &amp; fully verified. Over <strong className="text-[#b91c1c] font-bold">£180k+</strong> in luxury prizes already won by our community.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8 w-full sm:w-auto">
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

          {/* RIGHT — Featured Competition Card Visual Overlay */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full mt-4 lg:mt-0">
            {dynamicFeaturedDraw ? (
              <div className="w-full max-w-[420px] transform hover:scale-[1.01] transition-transform duration-300 shadow-2xl rounded-3xl">
                <DrawCard draw={dynamicFeaturedDraw} variant="featured" />
              </div>
            ) : (
              <div className="w-full max-w-[400px] bg-white/90 backdrop-blur-md border border-[#073826]/20 rounded-3xl p-6 text-center shadow-xl">
                <div className="inline-flex p-3 rounded-full bg-[#ECF5EE] mb-3">
                  <span className="text-3xl">⛳</span>
                </div>
                <h3 className="font-heading font-black text-lg text-[#073826] uppercase">
                  Featured Competition
                </h3>
                <p className="font-sans text-xs text-[#5e766c] mt-1.5">
                  Win top-tier clubs, bags, and golf gadgets for just £1 per ticket.
                </p>
                <Link
                  href="/live-raffles"
                  className="mt-4 inline-block btn-glossy-red px-5 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider"
                >
                  Browse All Raffles
                </Link>
              </div>
            )}
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
