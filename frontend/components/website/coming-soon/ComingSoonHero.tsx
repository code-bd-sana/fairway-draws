"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Fixed target launch date (30 days from today)
const TARGET_LAUNCH_TIMESTAMP = new Date("2026-09-05T12:00:00Z").getTime();

function calculateTimeLeft() {
  const now = Date.now();
  const difference = Math.max(0, TARGET_LAUNCH_TIMESTAMP - now);

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds };
}

/**
 * Hero header section for the Fairway Draws Coming Soon page.
 * Features the official Fairway Draws white cap image, golf aesthetic typography,
 * launch badge, and real-time persistent countdown timer.
 */
export default function ComingSoonHero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Persist target in localStorage if first visit, or use fixed target date
    let target = TARGET_LAUNCH_TIMESTAMP;
    const storedTarget = localStorage.getItem("fairway_launch_timestamp");
    if (storedTarget) {
      target = parseInt(storedTarget, 10);
    } else {
      localStorage.setItem("fairway_launch_timestamp", String(TARGET_LAUNCH_TIMESTAMP));
    }

    const updateTimer = () => {
      const now = Date.now();
      const difference = Math.max(0, target - now);

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center pt-4 md:pt-8 pb-4 text-center max-w-4xl mx-auto">
      {/* VIP Early Access Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0b4d35]/10 border border-[#0b4d35]/20 text-[#0b4d35] text-xs font-semibold uppercase tracking-widest mb-6 animate-pulse shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
        ⛳ VIP Waitlist Now Open
      </div>

      {/* Main Brand Title with matching Fairway Draws Embroidery Typography */}
      <div className="flex flex-col items-center mb-6">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0b4d35] tracking-wider uppercase drop-shadow-sm">
          FAIRWAY
        </h1>
        <div className="flex items-center justify-center gap-3 mt-1">
          <span className="h-[2px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#0b4d35]" />
          <span className="font-sans text-xl sm:text-2xl md:text-3xl font-black text-[#dc2626] tracking-widest uppercase">
            DRAWS
          </span>
          <span className="h-[2px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#0b4d35]" />
        </div>
        <p className="font-sans text-xs sm:text-sm md:text-base text-text-secondary max-w-xl mt-4 leading-relaxed">
          Win luxury golf equipment, premium club memberships & exclusive PGA tournament access — all while making a real difference for charity.
        </p>
      </div>

      {/* Showcase Card featuring the Official Cap Image */}
      <div className="relative w-full max-w-[540px] aspect-[4/3] rounded-[24px] overflow-hidden border-2 border-[#0b4d35]/20 shadow-2xl group transition-all duration-500 hover:shadow-emerald-950/20 hover:border-[#0b4d35]/40 my-4 bg-gradient-to-b from-[#0b4d35]/5 to-transparent p-2">
        <div className="relative w-full h-full rounded-[18px] overflow-hidden">
          <Image
            src="/fairway_cap.jpg"
            alt="Fairway Draws Official Golf Cap"
            fill
            sizes="(max-width: 768px) 100vw, 540px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {/* Subtle Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          {/* Overlay Text & Floating Pill */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-10 text-left">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-200 block">
                Official Gear & Apparel
              </span>
              <span className="font-serif text-lg md:text-xl font-bold tracking-wide text-white drop-shadow">
                Fairway Draws Edition
              </span>
            </div>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-wide border border-white/30 text-white">
              Limited 2026 Batch
            </span>
          </div>
        </div>
      </div>

      {/* Persistent Real-Time Countdown Timer Grid */}
      <div className="w-full max-w-md mt-6 bg-white/80 backdrop-blur-sm border border-[#0b4d35]/15 rounded-2xl p-4 shadow-sm">
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest mb-3">
          Official Launch Countdown
        </p>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="flex flex-col items-center bg-[#0b4d35]/5 p-2 rounded-xl border border-[#0b4d35]/10">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#0b4d35]">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase font-medium text-text-muted">Days</span>
          </div>
          <div className="flex flex-col items-center bg-[#0b4d35]/5 p-2 rounded-xl border border-[#0b4d35]/10">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#0b4d35]">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase font-medium text-text-muted">Hours</span>
          </div>
          <div className="flex flex-col items-center bg-[#0b4d35]/5 p-2 rounded-xl border border-[#0b4d35]/10">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#0b4d35]">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase font-medium text-text-muted">Mins</span>
          </div>
          <div className="flex flex-col items-center bg-[#0b4d35]/5 p-2 rounded-xl border border-[#0b4d35]/10">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#dc2626]">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase font-medium text-text-muted">Secs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
