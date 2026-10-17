"use client";

import React, { useMemo } from "react";
import {
  AssignmentCompetitionDetail,
  AssignmentUser,
  AssignmentInstantWin,
} from "../../../../services/admin.service";
import {
  ShieldCheck,
  Zap,
  Wallet,
  AlertTriangle,
  ArrowRight,
  FileText,
} from "lucide-react";

interface AccountingBreakdownProps {
  competition: AssignmentCompetitionDetail | null;
  recipient: AssignmentUser | null;
  mode: "specific" | "random";
  selectedNumbers: number[];
  randomQuantity: number;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  onRequestConfirm: () => void;
  isSubmitting?: boolean;
}

export default function AccountingBreakdown({
  competition,
  recipient,
  mode,
  selectedNumbers,
  randomQuantity,
  adminNotes,
  setAdminNotes,
  onRequestConfirm,
  isSubmitting = false,
}: AccountingBreakdownProps) {
  // Determine ticket count
  const ticketCount =
    mode === "specific" ? selectedNumbers.length : randomQuantity;
  const unitPrice = competition ? competition.pricePerTicket : 0;
  const totalFinancialValue = ticketCount * unitPrice;

  // Identify any selected numbers that are Instant Wins
  const triggeredInstantWins = useMemo(() => {
    if (!competition || mode !== "specific") return [];
    const wins: AssignmentInstantWin[] = [];
    selectedNumbers.forEach((num) => {
      const iw = competition.instantWins.find(
        (w) => w.ticketNumber === num && !w.isClaimed
      );
      if (iw) wins.push(iw);
    });
    return wins;
  }, [competition, mode, selectedNumbers]);

  const canSubmit = Boolean(
    competition && recipient && ticketCount > 0 && !isSubmitting
  );

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-card flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-divider">
        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-2xs">
          5
        </div>
        <div>
          <h3 className="font-heading font-black text-base sm:text-lg text-text-primary uppercase tracking-tight">
            Step 5: Accounting Breakdown &amp; Execution
          </h3>
          <p className="font-sans text-xs text-text-muted">
            Verify financial integrity, host revenue crediting, and confirm assignment.
          </p>
        </div>
      </div>

      {/* Instant Win Warning Banner */}
      {triggeredInstantWins.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-950 dark:text-amber-200 flex flex-col gap-2 animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2 font-heading font-black text-xs sm:text-sm uppercase tracking-tight">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span>⚡ Instant Win Prize Alert ({triggeredInstantWins.length})</span>
          </div>
          <p className="font-sans text-xs">
            The selected allocation includes ticket number(s) configured for unclaimed Instant Win prizes. If assigned, the prize will automatically be claimed and awarded to the recipient!
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {triggeredInstantWins.map((win) => (
              <span
                key={win.id}
                className="px-2.5 py-1 rounded-lg bg-surface border border-amber-500/40 font-mono text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1 shadow-2xs"
              >
                <span>⚡ #{win.ticketNumber}:</span>
                <strong className="text-text-primary">{win.prizeName}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Accounting Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recipient & Competition Summary */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-border flex flex-col gap-2.5">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Allocation Details
          </span>

          <div className="flex justify-between items-center text-xs font-sans">
            <span className="text-text-muted">Recipient User:</span>
            <span className="font-heading font-bold text-text-primary text-right truncate max-w-[200px]">
              {recipient ? recipient.name : "Not selected"}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-sans">
            <span className="text-text-muted">Competition:</span>
            <span className="font-heading font-bold text-text-primary text-right truncate max-w-[200px]">
              {competition ? competition.title : "Not selected"}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-sans">
            <span className="text-text-muted">Allocation Mode:</span>
            <span className="font-sans font-bold text-text-brand uppercase text-[11px]">
              {mode === "specific" ? "Specific Numbers" : "Random Available Quantity"}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-sans">
            <span className="text-text-muted">Ticket Numbers:</span>
            <span className="font-mono font-bold text-text-primary text-right truncate max-w-[200px]">
              {mode === "specific" && selectedNumbers.length > 0
                ? `#${selectedNumbers.join(", #")}`
                : `${ticketCount} auto-picked`}
            </span>
          </div>
        </div>

        {/* Financial Consistency & Host Crediting */}
        <div className="p-4 rounded-xl bg-elevated/70 border border-border flex flex-col gap-2.5">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-text-brand" />
            Financial &amp; Wallet Consistency
          </span>

          <div className="flex justify-between items-center text-xs font-sans">
            <span className="text-text-muted">Ticket Quantity:</span>
            <span className="font-heading font-bold text-text-primary">
              {ticketCount}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-sans">
            <span className="text-text-muted">Unit Price:</span>
            <span className="font-heading font-bold text-text-primary">
              £{unitPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-sans pt-1 border-t border-divider">
            <span className="font-bold text-text-primary">Total Accounting Value:</span>
            <span className="font-heading font-black text-sm text-text-brand">
              £{totalFinancialValue.toFixed(2)}
            </span>
          </div>

          {/* Host Wallet Statement */}
          <div className="mt-1 p-2.5 rounded-lg bg-accent-bg/60 border border-primary/25 flex items-start gap-2 text-[11px] font-sans">
            <ShieldCheck className="w-4 h-4 text-text-brand shrink-0 mt-0.5" />
            <div className="text-text-secondary leading-snug">
              Host Wallet Balance will automatically receive{" "}
              <strong className="text-text-brand font-bold">
                +£{totalFinancialValue.toFixed(2)}
              </strong>{" "}
              upon completion (Host: {competition?.host.businessName || "Host"}).
            </div>
          </div>
        </div>
      </div>

      {/* Admin Notes Field */}
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-xs font-bold text-text-primary flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-text-muted" />
          Admin Allocation Reason / Audit Notes (Optional):
        </label>
        <input
          type="text"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="e.g. VIP Giveaway winner, Loyalty reward, Social media promo compensation"
          className="w-full px-3.5 py-2.5 rounded-xl bg-elevated border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary font-sans"
        />
        <span className="font-sans text-[11px] text-text-muted">
          These notes will be permanently logged in the audit trail and visible in order receipts.
        </span>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-divider">
        <div className="flex items-center gap-2 text-xs font-sans text-text-muted">
          <ShieldCheck className="w-4 h-4 text-emerald-800 dark:text-emerald-400 shrink-0" />
          <span>Payment Gateway marker: <strong className="font-mono text-text-primary">ADMIN_MANUAL</strong></span>
        </div>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={onRequestConfirm}
          className={`h-12 px-7 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
            canSubmit
              ? "bg-primary hover:bg-primary-hover text-white hover:scale-[1.02] active:scale-[0.98]"
              : "bg-elevated border border-border text-text-muted cursor-not-allowed opacity-50"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing Assignment...</span>
            </>
          ) : (
            <>
              <span>Assign {ticketCount} Tickets</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
