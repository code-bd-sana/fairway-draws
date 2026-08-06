"use client";

import React from "react";

const BENEFITS = [
  {
    title: "Launch Day Raffles",
    description: "Be the first to enter inaugural competitions for Titleist, TaylorMade, Scotty Cameron gear, and VIP PGA tickets.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 text-[#0b4d35]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75c-.621 0-1.125.504-1.125 1.125v3.375m9 0h3.75a1.125 1.125 0 0 0 1.125-1.125v-9.25a1.125 1.125 0 0 0-1.125-1.125h-3.75m-9 11.625H3.75A1.125 1.125 0 0 1 2.625 17.625v-9.25A1.125 1.125 0 0 1 3.75 7.25h3.75m0 0V5.625c0-.621.504-1.125 1.125-1.125h6.75c.621 0 1.125.504 1.125 1.125V7.25m-9 0h9" />
      </svg>
    ),
  },
  {
    title: "Exclusive Host Perks",
    description: "Golf clubs and organizers who register early lock in zero platform fees for their initial 3 Fairway draws.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 text-[#0b4d35]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "100% Certified Gear",
    description: "Every item in our draws is verified authentic, brand-new, and legally compliant under UK raffle regulations.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 text-[#0b4d35]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
  },
];

/**
 * Grid component showcasing waitlist rewards and value-adding points for Fairway Draws.
 */
export default function InterestBenefits() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-0 py-8">
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#dc2626] block mb-1">
          Why Register Early?
        </span>
        <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#0b4d35]">
          VIP Waitlist Privileges
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {BENEFITS.map((benefit, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#0b4d35]/15 rounded-[16px] p-6 flex flex-col items-start hover:border-[#0b4d35]/40 hover:shadow-lg transition-all duration-300 group"
          >
            {/* Rounded Icon Ring */}
            <div className="w-12 h-12 rounded-2xl bg-[#0b4d35]/10 border border-[#0b4d35]/20 flex items-center justify-center mb-4 shrink-0 group-hover:bg-[#0b4d35] group-hover:text-white transition-colors duration-300">
              {benefit.icon}
            </div>

            {/* Title */}
            <h4 className="font-serif font-bold text-base md:text-lg text-[#0b4d35] tracking-wide mb-2">
              {benefit.title}
            </h4>

            {/* Description */}
            <p className="font-sans text-xs md:text-sm text-text-secondary leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
