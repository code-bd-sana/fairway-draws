"use client";

import React from "react";
import {
  AssignmentCompetitionDetail,
  AssignmentUser,
  AssignTicketsResponse,
} from "../../../../services/admin.service";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  X,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  competition: AssignmentCompetitionDetail;
  recipient: AssignmentUser;
  mode: "specific" | "random";
  selectedNumbers: number[];
  randomQuantity: number;
  adminNotes: string;
  isSubmitting: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  competition,
  recipient,
  mode,
  selectedNumbers,
  randomQuantity,
  adminNotes,
  isSubmitting,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const ticketCount =
    mode === "specific" ? selectedNumbers.length : randomQuantity;
  const totalValue = ticketCount * competition.pricePerTicket;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl p-6 sm:p-7 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-divider">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl shadow-2xs">
              🛡️
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-text-primary uppercase tracking-tight">
                Confirm Manual Ticket Assignment
              </h3>
              <p className="font-sans text-xs text-text-muted">
                Review the transaction details before committing to the database.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-elevated transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Breakdown Summary */}
        <div className="flex flex-col gap-3 p-4 rounded-xl bg-elevated/80 border border-border text-xs font-sans">
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Recipient User:</span>
            <span className="font-heading font-bold text-text-primary">
              {recipient.name} ({recipient.email})
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted">Target Competition:</span>
            <span className="font-heading font-bold text-text-primary">
              {competition.title}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted">Ticket Quantity:</span>
            <span className="font-heading font-bold text-text-primary">
              {ticketCount} {ticketCount === 1 ? "ticket" : "tickets"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted">Ticket Numbers:</span>
            <span className="font-mono font-bold text-text-brand">
              {mode === "specific"
                ? `#${selectedNumbers.join(", #")}`
                : "Randomly selected available numbers"}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-divider">
            <span className="font-bold text-text-primary">Total Accounting Value:</span>
            <span className="font-heading font-black text-sm text-text-brand">
              £{totalValue.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center text-text-secondary">
            <span>Host Wallet Credit:</span>
            <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">
              +£{totalValue.toFixed(2)} ({competition.host.businessName})
            </span>
          </div>

          <div className="flex justify-between items-center text-text-muted">
            <span>Payment Gateway Tag:</span>
            <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
              ADMIN_MANUAL
            </span>
          </div>

          {adminNotes && (
            <div className="pt-2 border-t border-divider">
              <span className="text-text-muted block text-[11px]">Audit Reason:</span>
              <span className="italic text-text-secondary">{adminNotes}</span>
            </div>
          )}
        </div>

        {/* Accounting Warning Callout */}
        <div className="p-3 rounded-xl bg-accent-bg/40 border border-primary/20 flex items-start gap-2.5 text-xs font-sans text-text-secondary">
          <ShieldCheck className="w-4 h-4 text-text-brand shrink-0 mt-0.5" />
          <span>
            This action creates an atomic order record, issues active tickets, credits the competition host's wallet balance, and triggers instant win prizes if numbers match.
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-elevated border border-border hover:bg-surface text-text-secondary font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Assigning Tickets...</span>
              </>
            ) : (
              <span>Confirm &amp; Assign</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewHistory: () => void;
  result: AssignTicketsResponse | null;
}

export function SuccessModal({
  isOpen,
  onClose,
  onViewHistory,
  result,
}: SuccessModalProps) {
  if (!isOpen || !result) return null;

  const hasInstantWins = result.instantWins && result.instantWins.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl p-6 sm:p-7 flex flex-col gap-5 overflow-hidden">
        {/* Animated Celebration Banner if Instant Win was triggered */}
        {hasInstantWins && (
          <div className="relative -mx-7 -mt-7 p-6 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border-b border-amber-500/40 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-lg animate-bounce">
              ⚡
            </div>
            <div className="flex items-center gap-1.5 font-heading font-black text-base uppercase text-amber-500 tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Instant Win Prize Unlocked!</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <p className="font-sans text-xs text-text-primary max-w-sm">
              One or more assigned tickets matched an Instant Win prize! Winner records and notifications were automatically generated.
            </p>
          </div>
        )}

        {/* Regular Header if no Instant Win */}
        {!hasInstantWins && (
          <div className="flex items-center gap-3 pb-3 border-b border-divider">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl text-emerald-800 dark:text-emerald-400">
              🎉
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-text-primary uppercase tracking-tight">
                Tickets Successfully Assigned!
              </h3>
              <p className="font-sans text-xs text-text-muted">
                Transaction finalized and host wallet credited.
              </p>
            </div>
          </div>
        )}

        {/* Instant Wins List */}
        {hasInstantWins && (
          <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <span className="font-heading font-black text-xs uppercase text-amber-800 dark:text-amber-300">
              Unlocked Prizes ({result.instantWins.length}):
            </span>
            <div className="flex flex-col gap-1.5">
              {result.instantWins.map((win, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs font-sans p-2 rounded-lg bg-surface border border-border"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-mono font-bold text-text-brand">
                      Ticket #{win.ticketNumber}
                    </span>
                    <span className="font-heading font-bold text-text-primary truncate">
                      {win.prizeName}
                    </span>
                  </div>
                  {win.rrpValue && (
                    <span className="font-mono text-text-muted text-[11px]">
                      £{win.rrpValue.toFixed(2)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details Card */}
        <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-elevated/70 border border-border text-xs font-sans">
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Recipient:</span>
            <span className="font-heading font-bold text-text-primary">
              {result.recipient.name} ({result.recipient.email})
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted">Competition:</span>
            <span className="font-heading font-bold text-text-primary">
              {result.competition.title}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted">Assigned Numbers:</span>
            <span className="font-mono font-bold text-text-brand">
              #{result.assignedNumbers.join(", #")}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted">Total Accounting Value:</span>
            <span className="font-heading font-black text-sm text-text-primary">
              £{result.totalFinancialValue.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted">Host Balance Credited:</span>
            <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">
              +£{result.hostWalletCredited.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-divider">
            <span className="text-text-muted">Reference Order ID:</span>
            <span className="font-mono text-[11px] text-text-muted">
              {result.transaction.gatewayTransactionId}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onViewHistory}
            className="px-4 py-2.5 rounded-xl bg-elevated border border-border hover:bg-surface text-text-primary font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            View in History
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            Assign More Tickets
          </button>
        </div>
      </div>
    </div>
  );
}
