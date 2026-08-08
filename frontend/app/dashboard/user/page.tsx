import React from "react";
import Image from "next/image";

export default function UserDashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading font-black text-2xl lg:text-3xl text-text-primary uppercase tracking-tight">
          Player Dashboard
        </h1>
        <p className="font-sans text-xs text-text-muted">
          Welcome back! Track your active competition entries, ticket spend, and recent prize wins.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
        {/* Total Tickets */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col gap-3 shadow-card">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Total Tickets Purchased
          </p>
          <p className="font-heading font-black text-3xl lg:text-4xl leading-tight text-text-primary">
            142
          </p>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-success-bg border border-[#BBF7D0] w-fit">
            <span className="font-sans text-[10px] font-bold text-success-text">
              ▲ 12 this month
            </span>
          </div>
        </div>

        {/* Active Entries */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col gap-3 shadow-card">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Active Entries
          </p>
          <p className="font-heading font-black text-3xl lg:text-4xl leading-tight text-text-primary">
            8
          </p>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent-bg border border-primary/30 w-fit">
            <span className="font-sans text-[10px] font-bold text-text-brand">
              Awaiting live draw
            </span>
          </div>
        </div>

        {/* Won Competitions */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col gap-3 shadow-card">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Won Competitions
          </p>
          <p className="font-heading font-black text-3xl lg:text-4xl leading-tight text-text-primary">
            3
          </p>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-success-bg border border-[#BBF7D0] w-fit">
            <span className="font-sans text-[10px] font-bold text-success-text">
              🏆 1 new prize
            </span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col gap-3 shadow-card">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Total Lifetime Spent
          </p>
          <p className="font-heading font-black text-3xl lg:text-4xl leading-tight text-text-primary">
            £286.50
          </p>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-elevated border border-border-medium w-fit">
            <span className="font-sans text-[10px] font-bold text-text-muted">
              Lifetime total
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Chart & Affordability */}
      <div className="flex flex-col xl:flex-row gap-5 w-full">
        {/* Ticket Spend Overview */}
        <div className="flex-[3] bg-surface border border-border rounded-card p-6 flex flex-col min-h-[346px] shadow-card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 sm:gap-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="font-heading font-black text-3xl text-text-primary leading-none">
                  £286.50
                </span>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-success-bg border border-[#BBF7D0]">
                  <span className="font-sans text-[11px] font-bold text-success-text">
                    ▲ 8%
                  </span>
                </div>
              </div>
              <span className="font-sans text-xs text-text-muted mt-1">
                Ticket Spend Overview
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-elevated p-1 rounded-xl border border-border-medium">
              <button className="px-3 py-1 rounded-lg border border-transparent font-heading font-bold text-xs text-text-muted hover:text-text-primary cursor-pointer">
                7D
              </button>
              <button className="px-3 py-1 rounded-lg border border-border bg-surface font-heading font-bold text-xs text-text-brand shadow-xs cursor-pointer">
                1M
              </button>
              <button className="px-3 py-1 rounded-lg border border-transparent font-heading font-bold text-xs text-text-muted hover:text-text-primary cursor-pointer">
                3M
              </button>
              <button className="px-3 py-1 rounded-lg border border-transparent font-heading font-bold text-xs text-text-muted hover:text-text-primary cursor-pointer">
                1Y
              </button>
            </div>
          </div>

          <div className="mt-8 flex-1 w-full relative min-h-[200px]">
            {/* Area Chart Graphic */}
            <svg
              className="absolute inset-0 w-full h-full text-primary opacity-10"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M0 100 V 50 Q 15 70 25 40 T 50 60 T 75 30 T 100 45 V 100 Z" />
            </svg>
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
              fill="none"
              stroke="#0b4d35"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            >
              <path d="M0 50 Q 15 70 25 40 T 50 60 T 75 30 T 100 45" />
            </svg>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 w-full flex justify-between px-4">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map(
                (month, i) => (
                  <span
                    key={i}
                    className="font-sans font-semibold text-[10px] text-text-muted"
                  >
                    {month}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* How Many Tickets Can I Afford? */}
        <div className="flex-[2] bg-surface border border-border rounded-card p-6 flex flex-col justify-between min-h-[346px] shadow-card">
          <div>
            <h3 className="font-heading font-black text-lg text-text-primary uppercase tracking-tight mb-5">
              Ticket Budget Calculator
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-bold text-[11px] tracking-wider uppercase text-text-muted">
                  Total Budget (£)
                </label>
                <div className="bg-elevated border border-border-medium h-10 rounded-xl flex items-center px-3 focus-within:border-primary transition-all">
                  <input
                    type="text"
                    defaultValue="50"
                    className="bg-transparent border-none outline-none text-text-primary text-sm font-sans w-full font-bold"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-bold text-[11px] tracking-wider uppercase text-text-muted">
                  Ticket Price (£)
                </label>
                <div className="bg-elevated border border-border-medium h-10 rounded-xl flex items-center px-3 focus-within:border-primary transition-all">
                  <input
                    type="text"
                    defaultValue="2.50"
                    className="bg-transparent border-none outline-none text-text-primary text-sm font-sans w-full font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <button className="btn-glossy-red h-11 rounded-xl w-full font-heading font-bold text-xs uppercase tracking-wider text-white shadow-md active:scale-98 cursor-pointer">
              Calculate Tickets
            </button>
            <div className="border-t border-divider pt-4 flex justify-between items-center">
              <span className="font-sans font-bold text-[11px] tracking-wider uppercase text-text-muted">
                Tickets You Can Buy
              </span>
              <span className="font-heading font-black text-2xl text-text-brand">
                20 tickets
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Active Entries & Recent Wins */}
      <div className="flex flex-col xl:flex-row gap-5 w-full">
        {/* My Active Entries */}
        <div className="flex-[3] bg-surface border border-border rounded-card p-6 flex flex-col shadow-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-black text-lg text-text-primary uppercase tracking-tight">
              My Active Entries
            </h3>
            <button className="flex items-center gap-1 font-sans font-bold text-xs text-text-brand hover:underline transition-all cursor-pointer">
              View All
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col">
            {/* List Header */}
            <div className="grid grid-cols-12 gap-4 pb-3 border-b border-divider font-sans text-[11px] font-bold text-text-muted uppercase tracking-wider">
              <div className="col-span-6">Competition</div>
              <div className="col-span-3">Draw Date</div>
              <div className="col-span-3 text-right">Tickets</div>
            </div>
            
            {/* List Item 1 */}
            <div className="grid grid-cols-12 gap-4 py-4 border-b border-divider items-center hover:bg-elevated/40 transition-colors">
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-bg border border-primary/30 flex items-center justify-center shrink-0 text-primary shadow-xs">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-sm text-text-primary">Tokyo Marui MK18</span>
                  <span className="font-sans text-xs text-text-muted">Hosted by Tactical Gear UK</span>
                </div>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="font-sans font-semibold text-xs text-text-primary">12 Oct 2024</span>
              </div>
              <div className="col-span-3 flex items-center justify-end">
                <div className="px-3 py-1 bg-elevated border border-border-medium rounded-lg">
                  <span className="font-sans font-bold text-xs text-text-brand">15</span>
                </div>
              </div>
            </div>

            {/* List Item 2 */}
            <div className="grid grid-cols-12 gap-4 py-4 border-b border-divider items-center hover:bg-elevated/40 transition-colors">
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-bg border border-primary/30 flex items-center justify-center shrink-0 text-primary shadow-xs">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-sm text-text-primary">VFC BCM MCMR</span>
                  <span className="font-sans text-xs text-text-muted">Hosted by Golf Hub</span>
                </div>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="font-sans font-semibold text-xs text-text-primary">15 Oct 2024</span>
              </div>
              <div className="col-span-3 flex items-center justify-end">
                <div className="px-3 py-1 bg-elevated border border-border-medium rounded-lg">
                  <span className="font-sans font-bold text-xs text-text-brand">3</span>
                </div>
              </div>
            </div>
            
            {/* List Item 3 */}
            <div className="grid grid-cols-12 gap-4 py-4 items-center hover:bg-elevated/40 transition-colors">
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-bg border border-primary/30 flex items-center justify-center shrink-0 text-primary shadow-xs">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-sm text-text-primary">Novritsch SSP5</span>
                  <span className="font-sans text-xs text-text-muted">Hosted by Precision Golf</span>
                </div>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="font-sans font-semibold text-xs text-text-primary">22 Oct 2024</span>
              </div>
              <div className="col-span-3 flex items-center justify-end">
                <div className="px-3 py-1 bg-elevated border border-border-medium rounded-lg">
                  <span className="font-sans font-bold text-xs text-text-brand">10</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Wins */}
        <div className="flex-[2] bg-surface border border-border rounded-card p-6 flex flex-col shadow-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-black text-lg text-text-primary uppercase tracking-tight">
              Recent Wins
            </h3>
            <button className="flex items-center gap-1 font-sans font-bold text-xs text-text-brand hover:underline transition-all cursor-pointer">
              View All
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col h-full justify-center min-h-[220px]">
             {/* Empty State for Wins */}
             <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 bg-accent-bg rounded-full border border-primary/30 flex items-center justify-center mb-4 text-primary shadow-xs">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                   </svg>
                </div>
                <h4 className="font-heading font-bold text-sm text-text-primary mb-1">No wins recorded yet</h4>
                <p className="font-sans text-xs text-text-muted max-w-[220px]">
                   Enter active competitions for a chance to win premium golf gear &amp; prizes.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
