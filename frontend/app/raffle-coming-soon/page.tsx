import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ComingSoonHero from "../../components/website/coming-soon/ComingSoonHero";
import EarlyAccessForm from "../../components/website/coming-soon/EarlyAccessForm";
import InterestBenefits from "../../components/website/coming-soon/InterestBenefits";

export const metadata: Metadata = {
  title: "Charity Draws | Raffles That Change Lives",
  description: "Join the Charity Draws waitlist and help charities raise more through safe, simple competitions.",
};

export default function RaffleComingSoonPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfaff] text-[#27105d]">
      <div className="pointer-events-none fixed inset-0 -z-0 opacity-70 [background:radial-gradient(circle_at_8%_10%,rgba(193,112,255,.25),transparent_23%),radial-gradient(circle_at_92%_32%,rgba(22,183,255,.19),transparent_24%),radial-gradient(circle_at_50%_96%,rgba(115,64,229,.14),transparent_30%)]" />

      <header className="relative z-20 border-b border-[#6c36d5]/10 bg-white/75 backdrop-blur-xl">
        <div className="container-custom flex h-[74px] items-center justify-between">
          <Link href="/raffle-coming-soon" className="flex items-center gap-2.5" aria-label="Charity Draws home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7b2ed4] to-[#11b6ee] text-xl shadow-[0_8px_18px_rgba(104,52,204,.28)]">♥</span>
            <span className="leading-none"><span className="block text-lg font-black tracking-[-.05em] text-[#4d1ca5]">CHARITY <em className="not-italic text-[#10aee8]">DRAWS</em></span><span className="block pt-1 text-[8px] font-black tracking-[.22em] text-[#7048b4]">RAFFLES THAT CHANGE LIVES</span></span>
          </Link>
          <span className="hidden rounded-full border border-[#8648df]/20 bg-[#f5efff] px-4 py-2 text-[10px] font-black uppercase tracking-[.14em] text-[#6830c4] sm:inline-flex">Launching soon · for charities</span>
        </div>
      </header>

      <section className="relative z-10 pt-10 sm:pt-14">
        <div className="container-custom"><ComingSoonHero /></div>
      </section>

      <section id="join-waitlist" className="relative z-10 mt-14 bg-gradient-to-br from-[#6624c7] via-[#8f38df] to-[#0cafe9] py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="container-custom relative grid items-center gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <div className="max-w-md text-center lg:text-left">
            <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[10px] font-black tracking-[.18em] text-white uppercase">Founding member access</span>
            <h2 className="mt-5 text-4xl font-black leading-[.9] tracking-[-.06em] text-white sm:text-5xl">BE THERE<br />FROM DAY ONE.</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/85 sm:text-base">Join the waitlist for first access, launch-day giveaways, and a platform built to help charities do more good.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-bold text-white/85 lg:justify-start"><span>✓ No payment needed</span><span>✓ Leave anytime</span><span>✓ Data protected</span></div>
          </div>
          <EarlyAccessForm />
        </div>
      </section>

      <section className="relative z-10 py-16 sm:py-20"><div className="container-custom"><InterestBenefits /></div></section>

      <footer className="relative z-10 border-t border-[#6c36d5]/10 bg-white py-8">
        <div className="container-custom flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"><div><p className="text-sm font-black text-[#5520af]">CHARITY <span className="text-[#0daee9]">DRAWS</span></p><p className="mt-1 text-[10px] font-bold tracking-wider text-[#7954a4] uppercase">Together, we can create change.</p></div><p className="text-[11px] text-[#7954a4]">© 2026 Charity Draws · Built for meaningful fundraising</p></div>
      </footer>
    </main>
  );
}
