"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BillingCycle } from "../../../types/pricing.types";
import PricingPlanGrid from "./PricingPlanGrid";
import { cn } from "../../../lib/utils";

/**
 * Pricing hero section with billing toggle (monthly/yearly) and pricing plan cards.
 */
export default function PricingHero() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <section className="relative isolate w-full overflow-hidden border-b border-[#174f36] bg-[#073826] pt-28 pb-16 md:pt-32 md:pb-20">
      <Image src="/hero-banner.jpg" alt="Golf course at golden hour" fill priority className="-z-20 object-cover object-[68%_center] opacity-90" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#032b1d]/95 via-[#06452f]/72 to-[#073826]/18" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f8faf6]/82 to-transparent" />

      <div className="container-custom relative flex flex-col items-center z-10">
        
        {/* Host Badge Label */}
        <div className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-[#073826]/85 px-4 py-2 text-[10px] font-black tracking-[.16em] text-white uppercase shadow-lg backdrop-blur-sm">
          FOR HOSTS
        </div>

        {/* Hero Headers */}
        <h1 className="mb-4 max-w-3xl text-center font-heading text-3xl font-black leading-[.92] tracking-[-.055em] text-white uppercase [text-shadow:0_5px_18px_rgba(0,0,0,.3)] md:text-5xl">
          Choose Your Hosting Plan
        </h1>
        
        <p className="mb-8 max-w-xl rounded-2xl border border-white/15 bg-[#042d1e]/58 p-3.5 text-center font-sans text-sm text-white/85 shadow-xl backdrop-blur-sm md:text-lg">
          Start free, upgrade as you grow. No hidden fees.
        </p>

        {/* Custom Toggle Billing Switcher */}
        <div className="mb-14 flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-[#e8f2e5] p-1.5 shadow-xl select-none">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "rounded-full px-5 py-2 text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer",
              billingCycle === "monthly"
                ? "bg-primary text-primary-text shadow-sm"
                : "text-[#426256] hover:text-[#0b4d35]"
            )}
          >
            Monthly
          </button>
          
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "rounded-full px-5 py-2 text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1.5",
              billingCycle === "yearly"
                ? "bg-primary text-primary-text shadow-sm"
                : "text-[#426256] hover:text-[#0b4d35]"
            )}
          >
            Yearly
            <span className={cn(
              "text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide",
              billingCycle === "yearly"
                ? "bg-[#1a230a] text-primary"
                : "bg-accent-bg text-text-brand"
            )}>
              save 20%
            </span>
          </button>
        </div>

        {/* Render Plans Grid */}
        <PricingPlanGrid billingCycle={billingCycle} />

      </div>
    </section>
  );
}
