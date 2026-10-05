"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RaffleDetail, RaffleTabId, RaffleTab } from "../../../types/raffle-details.types";
import { cn } from "../../../lib/utils";

interface RaffleDetailsTabsProps {
  raffle: RaffleDetail;
}

export default function RaffleDetailsTabs({ raffle }: RaffleDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<RaffleTabId>("details");

  const tabs: RaffleTab[] = [
    { id: "details", label: "Description" },
    { id: "how-to-enter", label: "How to Enter" },
    { id: "terms", label: "Terms" },
  ];

  const checkIcon = (
    <div className="w-6 h-6 rounded-full bg-accent-bg border border-primary/20 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </div>
  );

  const instantWins = raffle.instantWinPrizes || [];
  const sortedInstantWins = [...instantWins].sort((a, b) => a.ticketNumber - b.ticketNumber);
  const availableCount = instantWins.filter((p) => !p.isClaimed).length;
  const wonCount = instantWins.filter((p) => p.isClaimed).length;

  return (
    <div className="w-full flex flex-col font-sans mt-2 bg-surface border border-border rounded-card p-6 shadow-card">
      {/* Tabs Header */}
      <div className="flex items-center gap-6 border-b border-divider mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-3 text-xs font-heading font-bold uppercase tracking-wider transition-colors duration-200 border-b-2 -mb-[1px] cursor-pointer",
              activeTab === tab.id
                ? "border-primary text-text-brand"
                : "border-transparent text-text-muted hover:text-text-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[140px]">
        {activeTab === "details" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <p className="text-xs text-text-secondary leading-relaxed">
              {raffle.description}
            </p>
            {raffle.highlights.length > 0 && (
              <ul className="flex flex-col gap-2 mt-2">
                {raffle.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-text-primary font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "how-to-enter" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="flex gap-3.5 items-start">
              <div className="bg-accent-bg border border-primary/30 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-text-brand text-xs">
                1
              </div>
              <div>
                <h4 className="font-heading font-bold text-text-primary text-xs">Select your tickets</h4>
                <p className="text-xs text-text-muted mt-0.5">Choose how many tickets you&apos;d like to purchase. More tickets = more chances to win.</p>
              </div>
            </div>
            <div className="flex gap-3.5 items-start">
              <div className="bg-accent-bg border border-primary/30 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-text-brand text-xs">
                2
              </div>
              <div>
                <h4 className="font-heading font-bold text-text-primary text-xs">Complete checkout</h4>
                <p className="text-xs text-text-muted mt-0.5">Pay securely via card or gateway. Free postal entry also available — see T&Cs.</p>
              </div>
            </div>
            <div className="flex gap-3.5 items-start">
              <div className="bg-accent-bg border border-primary/30 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-text-brand text-xs">
                3
              </div>
              <div>
                <h4 className="font-heading font-bold text-text-primary text-xs">Instant win check</h4>
                <p className="text-xs text-text-muted mt-0.5">Your ticket numbers are checked against instant win outcomes automatically. If you win, you&apos;ll know straight away.</p>
              </div>
            </div>
            <div className="flex gap-3.5 items-start">
              <div className="bg-accent-bg border border-primary/30 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-text-brand text-xs">
                4
              </div>
              <div>
                <h4 className="font-heading font-bold text-text-primary text-xs">Watch the live draw</h4>
                <p className="text-xs text-text-muted mt-0.5">The main draw goes live when the timer ends or tickets sell out. Watch the live selection!</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "terms" && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            <p className="text-xs text-text-muted mb-1 font-semibold">Please read the terms carefully before entering.</p>
            <ul className="flex flex-col gap-2">
              {raffle.terms.map((term, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Instant Win Prizes (Fairway Draws Theme) */}
      {sortedInstantWins.length > 0 && (
        <div className="mt-6 bg-elevated/60 border border-border-medium rounded-xl p-5 md:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎁</span>
              <h3 className="font-heading font-bold text-sm md:text-base text-text-primary">
                Instant Win Prizes
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-sans">
              <span className="text-[#15803D] bg-[#DCFCE7] border border-[#BBF7D0] px-2.5 py-0.5 rounded-full font-bold">
                {availableCount} Available
              </span>
              <span className="text-text-muted">•</span>
              <span className="text-[#B45309] bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-0.5 rounded-full font-bold">
                {wonCount} Won
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {sortedInstantWins.map((prize) => {
              const isWon = Boolean(prize.isClaimed);
              return (
                <div
                  key={prize.id}
                  className={cn(
                    "flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-150",
                    isWon
                      ? "bg-surface/60 border-border/80 opacity-80"
                      : "bg-surface border-border hover:border-primary/40 shadow-xs"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {prize.image ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-accent-bg border border-primary/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={prize.image} alt={prize.title} className="w-full h-full object-cover" />
                      </div>
                    ) : isWon ? (
                      <div className="w-6 h-6 rounded-full bg-[#FEE2E2] border border-[#FECACA] flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.01-6.166 2.49 1.196a2.25 2.25 0 0 1 1.258 2.016v.831a2.25 2.25 0 0 1-2.25 2.25H8.25a2.25 2.25 0 0 1-2.25-2.25v-.831a2.25 2.25 0 0 1 1.258-2.016l2.49-1.196m5.01-6.166V3a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v1.084m4.5 0a9 9 0 0 1-4.5 0" />
                        </svg>
                      </div>
                    ) : (
                      checkIcon
                    )}
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="font-heading font-bold text-xs sm:text-sm text-text-primary truncate">
                        {prize.title}
                      </span>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-elevated border border-border-medium font-mono text-[11px] font-bold text-text-secondary">
                          Ticket #{prize.ticketNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right shrink-0">
                    <span
                      className={cn(
                        "font-sans font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs",
                        isWon
                          ? "bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626]"
                          : "bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D]"
                      )}
                    >
                      {isWon ? "Won" : "Available"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Host Profile Banner */}
      {raffle.hostName && (() => {
        const isImage = Boolean(
          raffle.hostLogo &&
          (raffle.hostLogo.startsWith('http://') ||
           raffle.hostLogo.startsWith('https://') ||
           raffle.hostLogo.startsWith('/') ||
           raffle.hostLogo.startsWith('data:image/'))
        );
        const initials = raffle.hostName
          ? raffle.hostName.split(' ').filter(Boolean).map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()
          : 'FD';
        const hostSlug = (raffle as any).hostSlug || raffle.hostName.toLowerCase().replace(/\s+/g, '-');

        return (
          <div className="mt-6 bg-elevated border border-border-medium rounded-xl p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-bg border border-primary/30 flex items-center justify-center shrink-0 overflow-hidden">
                {isImage ? (
                  <img
                    src={raffle.hostLogo}
                    alt={raffle.hostName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="font-heading font-bold text-text-brand text-sm">{initials}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[10px] text-text-muted uppercase tracking-wider font-bold">Hosted by</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-heading font-bold text-sm text-text-primary">{raffle.hostName}</span>
                  {raffle.hostVerified && (
                    <span className="bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide">Verified</span>
                  )}
                </div>
              </div>
            </div>
            <Link 
              href={`/hosts/${hostSlug}`}
              className="text-xs font-heading font-bold text-text-brand hover:underline transition-colors"
            >
              View Host Profile
            </Link>
          </div>
        );
      })()}
    </div>
  );
}
