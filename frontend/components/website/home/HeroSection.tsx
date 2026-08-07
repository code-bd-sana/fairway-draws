'use client';

import React, { useEffect, useState } from 'react';
import { heroData } from '../../../data/homepage/hero.data';
import Link from 'next/link';
import DrawCard from '../shared/DrawCard';
import { raffleService } from '../../../services/raffle.service';
import type { Draw } from '../../../types/draw.types';

/**
 * Premium hero section for Fairway Draws homepage.
 * Split layout: left = brand headline + stats, right = featured draw card.
 */
export default function HeroSection() {
  const [dynamicFeaturedDraw, setDynamicFeaturedDraw] = useState<Draw | null>(null);
  const [dynamicStats, setDynamicStats] = useState<{ id: number; value: string; label: string }[] | null>(null);

  useEffect(() => {
    async function fetchFeaturedRaffle() {
      try {
        const res = await raffleService.getPublicRaffles({ limit: 1, sort: 'Most Popular' });
        if (res.data && res.data.length > 0) {
          const r = res.data[0];
          setDynamicFeaturedDraw({
            id: r.id, title: r.title, description: r.description,
            image: r.mainImage || '', ticketPrice: Number(r.pricePerTicket),
            totalTickets: r.totalTickets, soldTickets: r.ticketsSold,
            endDate: new Date(r.endDate).toLocaleDateString(),
            status: (r.status === 'ACTIVE' ? 'live' : 'ended') as 'live' | 'ended',
            category: 'general', slug: r.slug,
          });
        }
      } catch { /* fallback to static */ }
    }
    async function fetchStats() {
      try {
        const stats = await raffleService.getPublicStats();
        if (stats && stats.length > 0) setDynamicStats(stats);
      } catch { /* ignore */ }
    }
    fetchFeaturedRaffle();
    fetchStats();
  }, []);

  const { badgeText, paragraphText, stats: fallbackStats, featuredDraw } = heroData;
  const statsToShow = dynamicStats || fallbackStats;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#F8FAF6]">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[25%] -right-[15%] w-[65%] h-[65%] bg-[#0b4d35]/8 rounded-full blur-[180px]" />
        <div className="absolute -bottom-[15%] -left-[10%] w-[50%] h-[50%] bg-[#dc2626]/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#0b4d3510_1px,transparent_1px)] bg-[size:28px_28px]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">

          {/* LEFT — Brand Copy */}
          <div className="flex flex-col items-start">

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0b4d35]/10 border border-[#0b4d35]/20 text-[#0b4d35] text-[11px] font-bold uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse" />
              {badgeText}
            </div>

            {/* Wordmark Heading */}
            <div className="mb-4">
              <h1 className="font-serif text-[52px] sm:text-[64px] lg:text-[72px] font-black leading-[0.88] tracking-tight text-[#0b4d35] uppercase">
                WIN PREMIUM
              </h1>
              <div className="flex items-center gap-4 mt-2 mb-2">
                <div className="h-[3px] w-10 bg-gradient-to-r from-[#0b4d35] to-transparent rounded-full" />
                <span className="font-sans text-[28px] sm:text-[36px] font-black tracking-[0.18em] text-[#dc2626] uppercase">
                  GOLF GEAR
                </span>
                <div className="h-[3px] flex-1 max-w-[80px] bg-gradient-to-r from-[#dc2626]/40 to-transparent rounded-full" />
              </div>
              <span className="font-serif text-[52px] sm:text-[64px] lg:text-[72px] font-black leading-[0.88] tracking-tight text-[#0b4d35] uppercase block">
                FOR LESS
              </span>
            </div>

            {/* Paragraph */}
            <p className="font-sans text-base text-[#334e43] leading-relaxed mb-8 max-w-lg mt-4">
              {paragraphText}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link
                href="/live-raffles"
                className="px-8 py-3.5 bg-[#0b4d35] hover:bg-[#073826] active:scale-[0.98] text-white font-sans text-sm font-black tracking-wider uppercase rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                View All Competitions →
              </Link>
              <Link
                href="/how-it-works"
                className="px-8 py-3.5 bg-white hover:bg-[#F1F5EE] text-[#0b4d35] font-sans text-sm font-bold tracking-wider uppercase rounded-2xl border border-[#0b4d35]/25 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                How It Works
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#0b4d35]/15 w-full">
              {statsToShow.map((stat) => (
                <div key={stat.id} className="flex flex-col">
                  <div className="font-serif font-black text-2xl md:text-3xl text-[#0b4d35]">
                    {stat.value}
                  </div>
                  <div className="font-sans text-[10px] text-[#5e766c] font-semibold uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Featured Draw Card */}
          <div className="flex justify-center lg:justify-end w-full min-h-[420px]">
            {dynamicFeaturedDraw ? (
              <DrawCard draw={dynamicFeaturedDraw} variant="featured" />
            ) : (
              <div className="w-full max-w-[500px] flex flex-col items-center justify-center bg-white border-2 border-dashed border-[#0b4d35]/20 rounded-[24px] text-center p-10 shadow-sm">
                <div className="text-5xl mb-4">⛳</div>
                <h3 className="font-serif font-black text-xl text-[#0b4d35] mb-2">New Competitions Dropping Soon</h3>
                <p className="font-sans text-sm text-[#5e766c]">We&apos;re preparing the next big prize draw. Check back soon!</p>
                <Link
                  href="/raffle-coming-soon"
                  className="mt-6 px-6 py-2.5 bg-[#0b4d35] text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#073826] transition-colors"
                >
                  Join VIP Waitlist
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
