import React from "react";
import Link from "next/link";
import { formatCurrency } from "../../../lib/utils";

const BULLETS = [
  "Set your own ticket price & volume",
  "Secure escrow-protected payouts",
  "Instant exposure to our active golf community",
  "Zero platform fees for your first 3 charity draws",
];

const PREVIEW = {
  activeDraws: 3,
  ticketsSold: 1240,
  totalEarned: 3100,
  targetPercent: 62,
};

/**
 * Host CTA section — split layout with benefits + dashboard preview card.
 */
export default function FinalCtaSection() {
  return (
    <section id="host-info" className="py-20 bg-[#F8FAF6] border-t border-[#EFF4ED]">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">

          {/* LEFT — Host Info */}
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0b4d35]/10 border border-[#0b4d35]/20 text-[#0b4d35] text-[11px] font-bold uppercase tracking-widest mb-7">
              🏌️ For Golf Clubs & Hosts
            </span>

            <h2 className="font-serif text-[40px] sm:text-[48px] font-black leading-[0.92] text-[#0b4d35] uppercase mb-5">
              RUN YOUR OWN<br />
              <span className="text-[#dc2626]">GOLF DRAW</span>
            </h2>

            <p className="font-sans text-base text-[#334e43] leading-relaxed mb-8 max-w-md">
              Turn surplus golf equipment into cash or launch charity competitions as an established club or retailer. We handle payments, compliance, and winner selection.
            </p>

            {/* Bullets */}
            <ul className="flex flex-col gap-3.5 mb-10 w-full">
              {BULLETS.map((b, i) => (
                <li key={i} className="flex items-start gap-3 font-sans text-sm text-[#0e1e17]">
                  <div className="w-5 h-5 rounded-full bg-[#0b4d35]/10 border border-[#0b4d35]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-[#0b4d35]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  {b}
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/host/register"
                className="px-8 py-3.5 bg-[#0b4d35] hover:bg-[#073826] text-white font-sans text-sm font-black tracking-wider uppercase rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                ⚡ Start Hosting
              </Link>
              <Link
                href="#"
                className="px-8 py-3.5 bg-white hover:bg-[#F1F5EE] text-[#0b4d35] font-sans text-sm font-bold tracking-wider uppercase rounded-2xl border border-[#0b4d35]/25 transition-all duration-200 shadow-sm"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* RIGHT — Dashboard Preview */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[480px] bg-white border border-[#0b4d35]/15 rounded-[24px] p-7 shadow-xl hover:shadow-2xl hover:border-[#0b4d35]/30 transition-all duration-300">

              {/* Card Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#EFF4ED] mb-6">
                <div>
                  <h3 className="font-serif font-black text-sm text-[#0b4d35] uppercase tracking-wide">Host Dashboard</h3>
                  <p className="font-sans text-[10px] text-[#5e766c] mt-0.5">Live preview — demo data</p>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#0b4d35] bg-[#0b4d35]/8 px-2.5 py-1.5 rounded-full border border-[#0b4d35]/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                  Live
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { value: PREVIEW.activeDraws, label: "Active Draws" },
                  { value: PREVIEW.ticketsSold.toLocaleString(), label: "Tickets Sold" },
                  { value: formatCurrency(PREVIEW.totalEarned, 0), label: "Total Earned" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#F8FAF6] border border-[#0b4d35]/10 rounded-2xl p-4 text-center">
                    <span className="font-serif text-xl font-black text-[#0b4d35] block">{s.value}</span>
                    <span className="font-sans text-[10px] text-[#5e766c] font-semibold uppercase tracking-wide mt-0.5 block">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="pt-5 border-t border-[#EFF4ED]">
                <div className="flex justify-between items-center text-xs text-[#5e766c] mb-3 font-semibold">
                  <span>Monthly Sales Target</span>
                  <span className="text-[#0b4d35] font-black">{PREVIEW.targetPercent}%</span>
                </div>
                <div className="w-full h-3 bg-[#F1F5EE] rounded-full overflow-hidden border border-[#0b4d35]/10">
                  <div
                    className="h-full bg-gradient-to-r from-[#0b4d35] to-[#16A34A] rounded-full transition-all duration-500"
                    style={{ width: `${PREVIEW.targetPercent}%` }}
                  />
                </div>
                <p className="font-sans text-[10px] text-[#5e766c] mt-2">
                  {PREVIEW.targetPercent}% of monthly target achieved — great pace!
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
