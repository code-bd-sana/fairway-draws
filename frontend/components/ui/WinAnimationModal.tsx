"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export interface WinPrizeItem {
  id?: string;
  title: string;
  ticketNumber: number;
  rrpValue?: number | null;
  prizeImage?: string | null;
  raffleTitle?: string;
}

interface WinAnimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim?: () => void | Promise<void>;
  prizes: WinPrizeItem[];
  userTickets?: Array<{ ticketNumber: number; id?: string }>;
}

function FastRollingDigits({ userTicketNumbers }: { userTicketNumbers: number[] }) {
  const [digits, setDigits] = useState(["0", "0", "0", "0"]);
  const [displayTicket, setDisplayTicket] = useState<number | null>(null);

  useEffect(() => {
    const digitInterval = setInterval(() => {
      setDigits([
        Math.floor(Math.random() * 10).toString(),
        Math.floor(Math.random() * 10).toString(),
        Math.floor(Math.random() * 10).toString(),
        Math.floor(Math.random() * 10).toString(),
      ]);
    }, 45);

    let ticketInterval: NodeJS.Timeout | null = null;
    if (userTicketNumbers.length > 0) {
      ticketInterval = setInterval(() => {
        const randomTk = userTicketNumbers[Math.floor(Math.random() * userTicketNumbers.length)];
        setDisplayTicket(randomTk);
      }, 140);
    }

    return () => {
      clearInterval(digitInterval);
      if (ticketInterval) clearInterval(ticketInterval);
    };
  }, [userTicketNumbers]);

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Fairway Digital Reel */}
      <div className="flex gap-2 items-center justify-center font-heading text-3xl sm:text-4xl font-black text-primary">
        {digits.map((num, i) => (
          <div
            key={i}
            className="w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center bg-accent-bg rounded-xl border border-primary/30 shadow-xs transform hover:scale-105 transition-transform"
          >
            <span>{num}</span>
          </div>
        ))}
      </div>

      {/* Ticket Number Scan Indicator */}
      {displayTicket !== null && (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-bg border border-primary/30 text-[11px] font-mono text-text-brand animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Verifying Ticket #{displayTicket}</span>
        </div>
      )}
    </div>
  );
}

export default function WinAnimationModal({
  isOpen,
  onClose,
  onClaim,
  prizes,
  userTickets = [],
}: WinAnimationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<"scanning" | "revealed">("scanning");
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasPrizes = prizes.length > 0;

  useEffect(() => {
    if (isOpen) {
      setStage("scanning");
      // 2.5 seconds verification animation
      const timer = setTimeout(() => {
        setStage("revealed");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const userTicketNumbers = useMemo(() => {
    return userTickets.map((t) => t.ticketNumber).filter((n) => typeof n === "number");
  }, [userTickets]);

  if (!isOpen || !mounted) return null;

  const handleClaimClick = async () => {
    if (onClaim) {
      try {
        setIsClaiming(true);
        await onClaim();
      } catch (err) {
        console.error("Failed to claim instant win prize:", err);
      } finally {
        setIsClaiming(false);
      }
    } else {
      onClose();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4 sm:p-6 overflow-y-auto">
      <div className="relative bg-surface border border-border rounded-card w-full max-w-lg overflow-hidden shadow-card flex flex-col z-[10000]">
        
        {/* Fairway Signature Brand Top Accent Line */}
        <div className="h-1.5 w-full bg-primary" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-divider bg-surface flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-accent-bg border border-primary/30 flex items-center justify-center shrink-0 shadow-xs">
              {stage === "scanning" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                  stroke="currentColor"
                  className="w-6 h-6 text-text-brand animate-spin"
                  style={{ animationDuration: "2.5s" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              ) : hasPrizes ? (
                <span className="text-2xl animate-bounce">🏆</span>
              ) : (
                <svg className="w-6 h-6 text-text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </div>

            <div>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-text-primary uppercase tracking-tight leading-tight">
                {stage === "scanning"
                  ? "Checking Instant Wins..."
                  : hasPrizes
                  ? "Instant Win Detected!"
                  : "Tickets Confirmed!"}
              </h2>
              <p className="font-sans text-xs text-text-muted mt-0.5">
                {stage === "scanning"
                  ? "Scanning allocated ticket numbers"
                  : hasPrizes
                  ? `Congratulations! You won ${prizes.length} Instant Prize${prizes.length > 1 ? "s" : ""}!`
                  : "All tickets entered into the main competition draw"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isClaiming}
            aria-label="Close"
            className="p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-elevated transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 bg-surface">
          {/* Main Display Stage Container */}
          <div className="w-full bg-elevated border border-border rounded-xl p-4 sm:p-5 relative min-h-[140px] flex items-center justify-center">
            
            {/* STAGE 1: Scanning / Digital Reels */}
            {stage === "scanning" ? (
              <div className="w-full py-2 flex flex-col items-center justify-center">
                <FastRollingDigits userTicketNumbers={userTicketNumbers} />
              </div>
            ) : hasPrizes ? (
              /* STAGE 2A: WINNER DETECTED - Clean Fairway Cards */
              <div className="w-full flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
                {prizes.map((prize, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-surface border border-primary/25 p-3 rounded-xl shadow-xs text-left"
                  >
                    {/* Prize Image */}
                    {prize.prizeImage ? (
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-elevated border border-border shrink-0">
                        <Image
                          src={prize.prizeImage}
                          alt={prize.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-accent-bg border border-primary/20 flex items-center justify-center shrink-0 text-xl">
                        🎁
                      </div>
                    )}

                    <div className="flex flex-col flex-1 min-w-0">
                      {prize.raffleTitle && (
                        <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider truncate">
                          {prize.raffleTitle}
                        </span>
                      )}
                      <h4 className="font-heading font-bold text-text-primary text-sm sm:text-base leading-tight truncate">
                        {prize.title}
                      </h4>
                      {prize.rrpValue ? (
                        <span className="font-sans text-xs font-semibold text-text-brand mt-0.5">
                          Value: £{prize.rrpValue.toLocaleString()}
                        </span>
                      ) : null}
                    </div>

                    {/* Ticket Badge */}
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="font-mono text-xs font-bold text-text-brand bg-accent-bg border border-primary/30 px-2.5 py-1 rounded-lg">
                        #{prize.ticketNumber}
                      </span>
                      <span className="text-[10px] font-sans font-bold text-[#15803D] bg-[#DCFCE7] border border-[#BBF7D0] px-2 py-0.5 rounded-full">
                        Instant Win
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* STAGE 2B: NO INSTANT WIN - Clean Confirmation */
              <div className="w-full py-4 text-center">
                <div className="w-10 h-10 rounded-full bg-accent-bg text-text-brand flex items-center justify-center mx-auto mb-2.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h4 className="font-heading font-bold text-sm text-text-primary mb-1">
                  Ready for the Main Live Draw!
                </h4>
                <p className="font-sans text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
                  Your ticket numbers are official and 100% active in the database for the main draw when competition closes.
                </p>
              </div>
            )}
          </div>

          {/* Additional Info Box for Winners */}
          {hasPrizes && stage === "revealed" && (
            <div className="bg-accent-bg border border-primary/20 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-text-brand font-medium">
              <span>ℹ️</span>
              <span>
                Please claim your instant win prize below. Your tickets also remain entered into the main competition draw!
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-divider bg-elevated flex flex-col sm:flex-row gap-3 items-center justify-end">
          {stage === "scanning" ? (
            <div className="w-full flex items-center justify-center py-1 gap-2 text-xs font-sans text-text-muted">
              <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Verifying instant win ticket allocations...</span>
            </div>
          ) : hasPrizes ? (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isClaiming}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-elevated text-text-primary font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Claim Later
              </button>

              <button
                type="button"
                onClick={handleClaimClick}
                disabled={isClaiming}
                className="btn-glossy-red w-full sm:w-auto px-6 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider text-white shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isClaiming ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Claiming Prize...</span>
                  </>
                ) : (
                  <>
                    <span>🎁 Claim Instant Win Prize{prizes.length > 1 ? "s" : ""}</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-heading font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Order & Tickets</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          )}
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
