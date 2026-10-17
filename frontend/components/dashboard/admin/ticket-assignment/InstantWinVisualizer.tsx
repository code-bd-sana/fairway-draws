"use client";

import React from "react";
import { AssignmentInstantWin } from "../../../../services/admin.service";
import { Zap, Check, Gift } from "lucide-react";

interface InstantWinVisualizerProps {
  instantWins: AssignmentInstantWin[];
  selectedNumbers: number[];
  onToggleNumber: (ticketNumber: number) => void;
}

export default function InstantWinVisualizer({
  instantWins,
  selectedNumbers,
  onToggleNumber,
}: InstantWinVisualizerProps) {
  if (!instantWins || instantWins.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-card flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold shadow-2xs">
            2
          </div>
          <div>
            <h3 className="font-heading font-black text-base sm:text-lg text-text-primary uppercase tracking-tight">
              Step 2: Instant Win Visualizer
            </h3>
            <p className="font-sans text-xs text-text-muted">
              This competition does not have instant win prizes configured.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const unclaimedWins = instantWins.filter((iw) => !iw.isClaimed);
  const claimedWins = instantWins.filter((iw) => iw.isClaimed);

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-card flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-divider">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold shadow-2xs">
            2
          </div>
          <div>
            <h3 className="font-heading font-black text-base sm:text-lg text-text-primary uppercase tracking-tight flex items-center gap-2">
              <span>Step 2: Instant Win Visualizer</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[10px] font-sans font-bold">
                ⚡ {instantWins.length} Configured
              </span>
            </h3>
            <p className="font-sans text-xs text-text-muted">
              Inspect instant win tickets. Click any available prize ticket to immediately add it to your allocation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-sans text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-[11px]">
            {unclaimedWins.length} Available
          </span>
          <span className="px-3 py-1 rounded-full bg-elevated border border-border text-text-muted text-[11px]">
            {claimedWins.length} Claimed
          </span>
        </div>
      </div>

      {/* Instant Win Cards Horizontal Carousel / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {instantWins.map((iw) => {
          const isSelected = selectedNumbers.includes(iw.ticketNumber);
          const isClaimed = iw.isClaimed;

          return (
            <div
              key={iw.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 relative ${
                isClaimed
                  ? "bg-elevated/40 border-border/60 opacity-60"
                  : isSelected
                  ? "bg-amber-500/10 border-amber-500 shadow-xs ring-1 ring-amber-500"
                  : "bg-elevated/70 border-amber-500/30 hover:border-amber-500 hover:bg-elevated"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-black text-xs px-2 py-0.5 rounded-lg border flex items-center gap-1 ${
                      isClaimed
                        ? "bg-surface border-border text-text-muted line-through"
                        : "bg-amber-500/20 border-amber-500/40 text-amber-800 dark:text-amber-300"
                    }`}
                  >
                    <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                    #{iw.ticketNumber}
                  </span>
                  {iw.rrpValue && (
                    <span className="font-sans text-[10px] font-bold text-text-muted">
                      RRP £{iw.rrpValue.toFixed(2)}
                    </span>
                  )}
                </div>

                {isClaimed ? (
                  <span className="px-2 py-0.5 rounded-full bg-surface border border-border text-[9px] font-bold text-text-muted uppercase tracking-wider">
                    Claimed
                  </span>
                ) : isSelected ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" /> Selected
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                    Available
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0 text-amber-500">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className="font-heading font-black text-xs text-text-primary truncate"
                    title={iw.prizeName}
                  >
                    {iw.prizeName}
                  </span>
                  <span className="font-sans text-[10px] text-text-muted">
                    Ticket #{iw.ticketNumber}
                  </span>
                </div>
              </div>

              {/* 1-Click Quick Action Button */}
              {!isClaimed ? (
                <button
                  type="button"
                  onClick={() => onToggleNumber(iw.ticketNumber)}
                  className={`w-full py-1.5 px-3 rounded-lg font-heading font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-amber-500 hover:bg-amber-600 text-black shadow-xs"
                      : "bg-surface border border-amber-500/40 hover:bg-amber-500/15 text-amber-700 dark:text-amber-400"
                  }`}
                >
                  <Zap className="w-3 h-3 fill-current" />
                  {isSelected ? "Deselect Instant Win" : "1-Click Select Ticket"}
                </button>
              ) : (
                <div className="w-full py-1 text-center font-sans text-[10px] text-text-muted italic bg-surface/50 rounded-lg">
                  Already claimed by buyer
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
