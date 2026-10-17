"use client";

import React, { useState, useMemo } from "react";
import {
  AssignmentCompetitionDetail,
  AssignmentSoldTicket,
  AssignmentInstantWin,
} from "../../../../services/admin.service";
import {
  Check,
  Zap,
  Trash2,
  Grid,
  Shuffle,
  Search,
  Filter,
  Plus,
  Minus,
} from "lucide-react";

interface TicketGridSelectorProps {
  competition: AssignmentCompetitionDetail;
  mode: "specific" | "random";
  setMode: (mode: "specific" | "random") => void;
  selectedNumbers: number[];
  onToggleNumber: (num: number) => void;
  onSetSpecificNumbers: (nums: number[]) => void;
  randomQuantity: number;
  setRandomQuantity: (qty: number) => void;
  onClearSelection: () => void;
}

export default function TicketGridSelector({
  competition,
  mode,
  setMode,
  selectedNumbers,
  onToggleNumber,
  onSetSpecificNumbers,
  randomQuantity,
  setRandomQuantity,
  onClearSelection,
}: TicketGridSelectorProps) {
  // Grid filters & controls
  const [gridFilter, setGridFilter] = useState<
    "all" | "available" | "instant-wins" | "sold"
  >("all");
  const [jumpToNumber, setJumpToNumber] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  // Sold tickets lookup map
  const soldMap = useMemo(() => {
    const map = new Map<number, AssignmentSoldTicket>();
    competition.soldTickets.forEach((t) => map.set(t.ticketNumber, t));
    return map;
  }, [competition.soldTickets]);

  // Instant wins lookup map
  const instantWinMap = useMemo(() => {
    const map = new Map<number, AssignmentInstantWin>();
    competition.instantWins.forEach((iw) => map.set(iw.ticketNumber, iw));
    return map;
  }, [competition.instantWins]);

  // Handle parsing manual comma-separated input
  const handleApplyManualInput = () => {
    setInputError(null);
    if (!manualInput.trim()) return;

    const tokens = manualInput
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const validNumbers: number[] = [];
    const invalidTokens: string[] = [];
    const alreadySoldTokens: number[] = [];

    for (const token of tokens) {
      const num = parseInt(token, 10);
      if (isNaN(num) || num < 1 || num > competition.totalTickets) {
        invalidTokens.push(token);
      } else if (soldMap.has(num)) {
        alreadySoldTokens.push(num);
      } else {
        validNumbers.push(num);
      }
    }

    if (invalidTokens.length > 0) {
      setInputError(
        `Invalid ticket number(s): ${invalidTokens.join(", ")}. Must be between 1 and ${competition.totalTickets}.`
      );
      return;
    }

    if (alreadySoldTokens.length > 0) {
      setInputError(
        `The following numbers are already sold: ${alreadySoldTokens.join(", ")}.`
      );
      return;
    }

    // Merge uniquely with current selections
    const merged = Array.from(new Set([...selectedNumbers, ...validNumbers])).sort(
      (a, b) => a - b
    );

    if (merged.length > competition.remainingTickets) {
      setInputError(
        `Total selected tickets (${merged.length}) exceeds remaining available capacity (${competition.remainingTickets}).`
      );
      return;
    }

    onSetSpecificNumbers(merged);
    setManualInput("");
  };

  // Filtered ticket tiles for grid
  const allTicketNumbers = useMemo(() => {
    const total = competition.totalTickets;
    const nums: number[] = [];
    for (let i = 1; i <= total; i++) {
      nums.push(i);
    }
    return nums;
  }, [competition.totalTickets]);

  const displayedNumbers = useMemo(() => {
    return allTicketNumbers.filter((num) => {
      // Jump to filter
      if (jumpToNumber.trim()) {
        const query = jumpToNumber.trim();
        if (!num.toString().includes(query)) return false;
      }

      const isSold = soldMap.has(num);
      const isIW = instantWinMap.has(num);

      if (gridFilter === "available") return !isSold;
      if (gridFilter === "sold") return isSold;
      if (gridFilter === "instant-wins") return isIW;
      return true;
    });
  }, [allTicketNumbers, jumpToNumber, gridFilter, soldMap, instantWinMap]);

  // Presets for Random Quantity
  const presetQuantities = [1, 5, 10, 25, 50, 100];

  const effectiveCount =
    mode === "specific" ? selectedNumbers.length : randomQuantity;
  const totalPrice = effectiveCount * competition.pricePerTicket;

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-card flex flex-col gap-5">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-divider">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-2xs">
            3
          </div>
          <div>
            <h3 className="font-heading font-black text-base sm:text-lg text-text-primary uppercase tracking-tight">
              Step 3: Ticket Number Selection
            </h3>
            <p className="font-sans text-xs text-text-muted">
              Choose either specific ticket numbers from the visual grid or let the system randomly pick available tickets.
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-elevated p-1 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setMode("specific")}
            className={`px-3 py-1.5 rounded-lg font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === "specific"
                ? "bg-primary text-white shadow-xs"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Specific Numbers</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("random")}
            className={`px-3 py-1.5 rounded-lg font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === "random"
                ? "bg-primary text-white shadow-xs"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Random Quantity</span>
          </button>
        </div>
      </div>

      {/* Selected Numbers Chip Bar */}
      <div className="p-4 rounded-xl bg-elevated/70 border border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-sans text-xs text-text-muted uppercase font-bold tracking-wider">
            Selection Summary:
          </span>
          <span className="px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-text-brand font-heading font-black text-xs">
            {effectiveCount} Ticket{effectiveCount === 1 ? "" : "s"} Selected
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-heading font-black text-xs">
            Total Value: £{totalPrice.toFixed(2)}
          </span>
        </div>

        {mode === "specific" && selectedNumbers.length > 0 && (
          <button
            type="button"
            onClick={onClearSelection}
            className="px-3 py-1 rounded-lg bg-surface border border-red-500/30 text-red-500 hover:bg-red-500/10 font-sans text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Selection</span>
          </button>
        )}
      </div>

      {/* MODE A: SPECIFIC NUMBERS */}
      {mode === "specific" ? (
        <div className="flex flex-col gap-4">
          {/* Quick paste / comma input */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-bold text-text-primary">
              Type or Paste Ticket Numbers (comma-separated):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyManualInput();
                  }
                }}
                placeholder="e.g. 7, 14, 21, 42, 99"
                className="flex-1 px-3.5 py-2 rounded-xl bg-elevated border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary font-mono"
              />
              <button
                type="button"
                onClick={handleApplyManualInput}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
              >
                Add Numbers
              </button>
            </div>
            {inputError && (
              <p className="text-red-500 text-xs font-sans mt-0.5">{inputError}</p>
            )}
          </div>

          {/* Active selections badge pill bar */}
          {selectedNumbers.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-surface border border-border max-h-24 overflow-y-auto custom-scrollbar">
              {selectedNumbers.map((num) => {
                const isIW = instantWinMap.has(num);
                return (
                  <span
                    key={num}
                    onClick={() => onToggleNumber(num)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all border ${
                      isIW
                        ? "bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300 hover:bg-red-500/20"
                        : "bg-primary/20 border-primary text-text-brand hover:bg-red-500/20 hover:border-red-500 hover:text-red-500"
                    }`}
                    title="Click to remove from selection"
                  >
                    {isIW && <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />}
                    #{num}
                    <span className="text-[10px] opacity-70">✕</span>
                  </span>
                );
              })}
            </div>
          )}

          {/* Grid Toolbar & Legend */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-sans text-xs text-text-muted flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {(
                [
                  { id: "all", label: "Show All" },
                  { id: "available", label: "Available Only" },
                  { id: "instant-wins", label: "Instant Wins Only" },
                  { id: "sold", label: "Sold Only" },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setGridFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    gridFilter === f.id
                      ? "bg-primary text-white"
                      : "bg-elevated border border-border text-text-muted hover:text-text-primary"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Jump to number search */}
            <div className="relative w-full md:w-44">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input
                type="text"
                value={jumpToNumber}
                onChange={(e) => setJumpToNumber(e.target.value)}
                placeholder="Find ticket #..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-elevated border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary font-mono"
              />
            </div>
          </div>

          {/* Visual Grid Legend */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-sans text-text-muted py-1 border-t border-divider">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-elevated border border-border inline-block" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-primary border border-primary text-white inline-flex items-center justify-center text-[8px]">
                ✓
              </span>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-500/20 border-2 border-amber-500 inline-flex items-center justify-center text-amber-500 text-[8px]">
                ⚡
              </span>
              <span>Instant Win</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-surface border border-border line-through text-text-muted opacity-50 inline-block" />
              <span>Sold (hover for buyer)</span>
            </div>
          </div>

          {/* Interactive Visual Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-1.5 max-h-[360px] overflow-y-auto p-2 rounded-xl bg-elevated/40 border border-border custom-scrollbar">
            {displayedNumbers.map((num) => {
              const isSelected = selectedNumbers.includes(num);
              const soldTicket = soldMap.get(num);
              const isSold = Boolean(soldTicket);
              const instantWin = instantWinMap.get(num);
              const isInstantWin = Boolean(instantWin);

              // Sold ticket tooltip content
              const soldTooltip = soldTicket
                ? `Sold to: ${soldTicket.buyer.name} (${soldTicket.buyer.email || "No email"})\nDate: ${new Date(
                    soldTicket.purchaseDate
                  ).toLocaleDateString()}\nGateway: ${soldTicket.paymentGateway}`
                : undefined;

              return (
                <button
                  key={num}
                  type="button"
                  disabled={isSold}
                  title={
                    isSold
                      ? soldTooltip
                      : isInstantWin
                      ? `⚡ INSTANT WIN: ${instantWin?.prizeName}`
                      : `Ticket #${num} (Available)`
                  }
                  onClick={() => onToggleNumber(num)}
                  className={`relative h-10 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center select-none ${
                    isSold
                      ? "bg-surface/60 border border-border/40 text-text-muted/40 line-through cursor-not-allowed opacity-50"
                      : isSelected
                      ? "bg-primary text-white shadow-xs border-2 border-primary scale-[1.03] ring-2 ring-primary/40 cursor-pointer"
                      : isInstantWin
                      ? "bg-amber-500/15 border-2 border-amber-500 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 cursor-pointer shadow-2xs"
                      : "bg-surface border border-border text-text-primary hover:border-primary hover:bg-elevated cursor-pointer"
                  }`}
                >
                  {isInstantWin && !isSold && !isSelected && (
                    <span className="absolute top-0.5 right-0.5 text-[9px] text-amber-500 leading-none">
                      ⚡
                    </span>
                  )}
                  {isSelected && (
                    <Check className="absolute top-0.5 right-0.5 w-2.5 h-2.5 stroke-[3]" />
                  )}
                  <span>{num}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* MODE B: RANDOM QUANTITY */
        <div className="flex flex-col gap-5 py-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-elevated/80 border border-border">
            <div className="flex flex-col gap-1">
              <h4 className="font-heading font-black text-sm uppercase text-text-primary">
                Select Random Quantity
              </h4>
              <p className="font-sans text-xs text-text-muted">
                System will securely shuffle and allocate {randomQuantity} available numbers without conflicts.
              </p>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRandomQuantity(Math.max(1, randomQuantity - 1))}
                className="w-10 h-10 rounded-xl bg-surface border border-border hover:border-border-medium flex items-center justify-center text-text-primary font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                min={1}
                max={competition.remainingTickets}
                value={randomQuantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    setRandomQuantity(
                      Math.max(1, Math.min(competition.remainingTickets, val))
                    );
                  }
                }}
                className="w-24 text-center py-2 rounded-xl bg-surface border border-border text-lg font-heading font-black text-text-brand focus:outline-none focus:border-primary"
              />

              <button
                type="button"
                onClick={() =>
                  setRandomQuantity(
                    Math.min(competition.remainingTickets, randomQuantity + 1)
                  )
                }
                className="w-10 h-10 rounded-xl bg-surface border border-border hover:border-border-medium flex items-center justify-center text-text-primary font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-xs text-text-muted font-bold mr-1">
              Quick Presets:
            </span>
            {presetQuantities.map((preset) => (
              <button
                key={preset}
                type="button"
                disabled={preset > competition.remainingTickets}
                onClick={() =>
                  setRandomQuantity(Math.min(competition.remainingTickets, preset))
                }
                className={`px-4 py-2 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  randomQuantity === preset
                    ? "bg-primary text-white shadow-xs"
                    : "bg-elevated border border-border text-text-secondary hover:text-text-primary hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                +{preset}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
