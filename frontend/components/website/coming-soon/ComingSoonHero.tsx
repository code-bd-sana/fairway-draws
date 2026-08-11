"use client";

import React, { useEffect, useState } from "react";

const TARGET_LAUNCH_TIMESTAMP = new Date("2026-09-05T12:00:00Z").getTime();

function RaffleMachine() {
  const balls = ["#1ebcf0", "#a446e4", "#ffffff", "#19b5ea", "#8d35df", "#ffffff", "#ac55eb", "#18b8ed", "#ffffff"];
  return <div className="relative mx-auto h-[270px] w-[280px] sm:h-[330px] sm:w-[340px]">
    <div className="absolute left-1/2 top-0 h-[140px] w-[116px] -translate-x-1/2 rounded-t-xl border-[5px] border-[#5d1ab8] bg-white/55 p-3 shadow-[inset_0_0_16px_rgba(127,60,210,.2),0_12px_25px_rgba(92,26,184,.16)] sm:h-[165px] sm:w-[138px]">
      <div className="grid grid-cols-3 gap-2">{balls.map((color, index) => <span key={index} className="aspect-square rounded-full border border-[#5420ad]/25 shadow-[inset_-3px_-4px_5px_rgba(35,8,91,.2),inset_3px_3px_5px_white]" style={{ background: color }} />)}</div>
    </div>
    <div className="absolute left-1/2 top-[120px] h-[118px] w-[152px] -translate-x-1/2 rounded-full border-[5px] border-[#5d1ab8] bg-white/70 shadow-[inset_0_0_20px_rgba(127,60,210,.16),0_10px_24px_rgba(92,26,184,.16)] sm:top-[144px] sm:h-[138px] sm:w-[180px]">
      <span className="absolute left-[20%] top-[56%] h-9 w-9 rounded-full border border-[#5420ad]/25 bg-[#a446e4] shadow-[inset_4px_4px_6px_white]" /><span className="absolute right-[20%] top-[50%] h-9 w-9 rounded-full border border-[#5420ad]/25 bg-[#18b8ed] shadow-[inset_4px_4px_6px_white]" />
      <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#5d1ab8] bg-white" />
      <i className="absolute left-1/2 top-1/2 h-[4px] w-[51px] origin-left -rotate-[18deg] bg-[#5d1ab8]" /><i className="absolute left-1/2 top-1/2 h-[4px] w-[42px] origin-left rotate-[145deg] bg-[#5d1ab8]" /><i className="absolute left-1/2 top-1/2 h-[4px] w-[48px] origin-left -rotate-90 bg-[#5d1ab8]" />
    </div>
    <div className="absolute bottom-2 left-1/2 h-[5px] w-[236px] -translate-x-1/2 rounded-full bg-[#5d1ab8] shadow-lg sm:w-[278px]" />
    <div className="absolute left-1 top-8 h-48 w-32 rounded-[100%] border-[8px] border-[#a446e4] border-r-0 opacity-90" /><div className="absolute right-1 top-8 h-48 w-32 rounded-[100%] border-[8px] border-[#18b8ed] border-l-0 opacity-90" />
  </div>;
}

export default function ComingSoonHero() {
  const [timeLeft, setTimeLeft] = useState({ days: 30, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => { const tick = () => { const diff = Math.max(0, TARGET_LAUNCH_TIMESTAMP - Date.now()); setTimeLeft({ days: Math.floor(diff / 86400000), hours: Math.floor(diff / 3600000 % 24), minutes: Math.floor(diff / 60000 % 60), seconds: Math.floor(diff / 1000 % 60) }); }; tick(); const id = window.setInterval(tick, 1000); return () => window.clearInterval(id); }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return <section className="mx-auto max-w-6xl py-3 text-center">
    <div className="relative mx-auto max-w-3xl"><span className="absolute left-[7%] top-36 text-4xl text-[#a446e4] sm:left-0">♡</span><span className="absolute right-[7%] top-40 text-4xl text-[#18b8ed] sm:right-0">♡</span><RaffleMachine /></div>
    <p className="mt-1 text-[10px] font-black tracking-[.28em] text-[#5730af] uppercase sm:text-xs">Raffles that change lives</p>
    <h1 className="mt-6 text-6xl font-black leading-[.8] tracking-[-.075em] sm:text-8xl"><span className="block bg-gradient-to-b from-[#b351e9] to-[#5d16c8] bg-clip-text text-transparent [text-shadow:0_6px_1px_rgba(74,16,163,.09)]">COMING</span><span className="block bg-gradient-to-b from-[#2fc8fa] to-[#088bdb] bg-clip-text text-transparent">SOON!</span></h1>
    <div className="mx-auto mt-7 max-w-xl rounded-2xl border border-[#a550df]/25 bg-white/70 px-5 py-4 shadow-[0_12px_30px_rgba(89,39,180,.1)] backdrop-blur-sm"><p className="text-[11px] font-black uppercase tracking-[.16em] text-[#6e2dc5] sm:text-xs">A new platform dedicated to charities</p><p className="mt-2 text-sm leading-relaxed text-[#54367e]">Helping charities maximise fundraising opportunities through simple, exciting and fully supported competitions.</p></div>
    <div className="mx-auto mt-8 flex max-w-md justify-center gap-2 sm:gap-3">{[[timeLeft.days,"Days"],[timeLeft.hours,"Hours"],[timeLeft.minutes,"Mins"],[timeLeft.seconds,"Secs"]].map(([value,label], i) => <div key={String(label)} className="min-w-[62px] rounded-xl border border-[#833bd8]/16 bg-white px-2 py-3 shadow-sm sm:min-w-[78px]"><b className={i === 3 ? "text-[#14aee9]" : "text-[#6324c2]"}>{pad(value as number)}</b><span className="mt-1 block text-[8px] font-black tracking-wider text-[#7d5ba6] uppercase">{label}</span></div>)}</div>
  </section>;
}
