import React from "react";
import Link from "next/link";
import ComingSoonHero from "../components/website/coming-soon/ComingSoonHero";
import InterestBenefits from "../components/website/coming-soon/InterestBenefits";

const STEPS = [
  ["01", "Choose your cause", "Find a charity you believe in and discover the competitions supporting their work."],
  ["02", "Enjoy the excitement", "Enter simple, engaging raffles designed to bring supporters together."],
  ["03", "Create more change", "Every competition helps charities unlock more fundraising potential."],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfaff] text-[#27105d]">
      <div className="pointer-events-none fixed inset-0 -z-0 [background:radial-gradient(circle_at_7%_8%,rgba(198,115,255,.24),transparent_23%),radial-gradient(circle_at_94%_28%,rgba(22,183,255,.18),transparent_24%),radial-gradient(circle_at_50%_96%,rgba(115,64,229,.14),transparent_30%)]" />

      <header className="relative z-20 border-b border-[#6c36d5]/10 bg-white/80 backdrop-blur-xl">
        <div className="container-custom flex h-[74px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Charity Draws home"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7b2ed4] to-[#11b6ee] text-xl text-white shadow-[0_8px_18px_rgba(104,52,204,.28)]">♥</span><span className="leading-none"><span className="block text-lg font-black tracking-[-.05em] text-[#4d1ca5]">CHARITY <em className="not-italic text-[#10aee8]">DRAWS</em></span><span className="block pt-1 text-[8px] font-black tracking-[.22em] text-[#7048b4]">RAFFLES THAT CHANGE LIVES</span></span></Link>
          <nav className="hidden items-center gap-7 text-[11px] font-black tracking-wider text-[#65458a] uppercase md:flex"><a href="#how-it-works" className="hover:text-[#6224be]">How it works</a><a href="#impact" className="hover:text-[#6224be]">Our impact</a></nav>
          <Link href="/raffle-coming-soon#join-waitlist" className="rounded-full bg-gradient-to-r from-[#6827c8] to-[#12aeea] px-4 py-2.5 text-[10px] font-black tracking-[.1em] text-white uppercase shadow-[0_8px_20px_rgba(85,37,186,.22)] transition hover:brightness-110 sm:px-5">Join the movement</Link>
        </div>
      </header>

      <section className="relative z-10 pt-10 sm:pt-14"><div className="container-custom"><ComingSoonHero /></div></section>

      <section id="how-it-works" className="relative z-10 mt-12 bg-white py-16 sm:py-20"><div className="container-custom"><div className="mx-auto max-w-xl text-center"><span className="text-[10px] font-black tracking-[.2em] text-[#6c2ac7] uppercase">Simple by design</span><h2 className="mt-4 text-4xl font-black leading-[.92] tracking-[-.055em] text-[#4e1ca6] sm:text-5xl">GOOD CAUSES DESERVE<br /><span className="text-[#10aee8]">GREAT MOMENTUM.</span></h2></div><div className="relative mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3"><div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-[#a746e2] via-[#23b9f0] to-[#a746e2] md:block" />{STEPS.map(([number, title, copy]) => <article key={number} className="relative rounded-[24px] border border-[#8850d5]/13 bg-[#fcfaff] p-6 shadow-[0_10px_28px_rgba(79,26,169,.07)]"><span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#782dcf] to-[#18b7ee] text-lg font-black text-white shadow-lg">{number}</span><h3 className="mt-6 text-xl font-black text-[#5920af]">{title}</h3><p className="mt-3 text-sm leading-relaxed text-[#71518f]">{copy}</p></article>)}</div></div></section>

      <section id="impact" className="relative z-10 py-16 sm:py-20"><div className="container-custom"><InterestBenefits /></div></section>

      <section className="relative z-10 overflow-hidden bg-gradient-to-r from-[#6022bd] via-[#8f3dde] to-[#0daee9] py-16 text-center sm:py-20"><div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:21px_21px]" /><div className="container-custom relative"><span className="text-4xl text-white">♥</span><h2 className="mt-4 text-4xl font-black tracking-[-.055em] text-white sm:text-5xl">TOGETHER, WE CAN<br />CREATE CHANGE.</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">Charity Draws is coming soon. Be part of a better way for charities to raise funds and bring their supporters closer.</p><Link href="/raffle-coming-soon#join-waitlist" className="mt-8 inline-flex rounded-2xl bg-white px-7 py-4 text-xs font-black tracking-[.12em] text-[#6324bf] uppercase shadow-xl transition hover:-translate-y-0.5">Get launch updates →</Link></div></section>

      <footer className="relative z-10 bg-white py-8"><div className="container-custom flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left"><div><p className="text-sm font-black text-[#5520af]">CHARITY <span className="text-[#0daee9]">DRAWS</span></p><p className="mt-1 text-[10px] font-bold tracking-wider text-[#7954a4] uppercase">Raffles that change lives</p></div><p className="text-[11px] text-[#7954a4]">© 2026 Charity Draws · Built for meaningful fundraising</p></div></footer>
    </main>
  );
}
