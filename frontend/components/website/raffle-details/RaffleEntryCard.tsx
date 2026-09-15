"use client";

import React, { useState, useEffect } from "react";
import { RaffleDetail } from "../../../types/raffle-details.types";
import { useAuth } from "../../../features/auth/AuthContext";
import { useRouter } from "next/navigation";
import TicketPurchaseSuccessModal, { TicketPurchaseSuccessData } from "./TicketPurchaseSuccessModal";
import WinAnimationModal, { WinPrizeItem } from "../../ui/WinAnimationModal";
import FreePostalEntryButton from "../legal/FreePostalEntryButton";
import { paymentService } from "../../../services/payment.service";
import { userService } from "../../../services/user.service";
import { useBasket } from "../../../features/basket/BasketContext";
import { useMyTicketsQuery } from "../../../hooks/useTicketHooks";
import { toast } from "sonner";

interface RaffleEntryCardProps {
  raffle: RaffleDetail;
}

export default function RaffleEntryCard({ raffle }: RaffleEntryCardProps) {
  const { isAuthenticated } = useAuth();
  const { addItem, clearBasket } = useBasket();
  const router = useRouter();

  const minAllowed = raffle.minTickets || raffle.minimumTickets || 1;
  const maxPerPerson = raffle.maxTickets || raffle.maximumTicketsPerOrder;

  const { data: myTickets = [] } = useMyTicketsQuery();
  const userOwnedTickets =
    isAuthenticated && Array.isArray(myTickets)
      ? myTickets.filter(
          (t: any) => t.raffleId === raffle.id || t.raffle?.id === raffle.id,
        ).length
      : 0;

  const [quantity, setQuantity] = useState(minAllowed);
  const [statusMessage, setStatusMessage] = useState<{type: 'success'|'error'|'info', text: string} | null>(null);
  const [purchaseSuccessData, setPurchaseSuccessData] = useState<TicketPurchaseSuccessData | null>(null);
  const [winAnimationPrizes, setWinAnimationPrizes] = useState<WinPrizeItem[]>([]);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const {
    ticketPrice,
    totalPoolValue,
    worthPrice,
    totalTickets,
    soldTickets,
    endDate,
  } = raffle;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment");
    const orderNumber = urlParams.get("ordernumber") || urlParams.get("orderNumber");
    const paymentJobRef = urlParams.get("paymentJobReference") || urlParams.get("paymentJobRef");

    if (paymentStatus === "cancel") {
      setStatusMessage({ type: "error", text: "Payment was cancelled." });
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (paymentStatus === "success" || orderNumber || paymentJobRef) {
      setStatusMessage({ type: "info", text: "Confirming ticket purchase..." });
      clearBasket();
      try {
        localStorage.removeItem("fairway_basket_v1");
        localStorage.setItem("fairway_basket_v1", "[]");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("fairway_basket_cleared"));
        }
      } catch {}
      paymentService
        .confirmPayment({ orderNumber: orderNumber || undefined, paymentJobRef: paymentJobRef || undefined })
        .then((res) => {
          window.history.replaceState({}, document.title, window.location.pathname);
          if (res.tickets && res.tickets.length > 0) {
            const formattedWins = (res.instantWins || []).map((iw: any) => {
              const tk = (res.tickets || []).find((t: any) => t.id === iw.ticketId);
              return {
                id: iw.id,
                ticketId: iw.ticketId,
                prizeName: iw.prizeName,
                ticketNumber: tk ? tk.ticketNumber : undefined,
              };
            });

            if (res.instantWins && res.instantWins.length > 0) {
              const instantPrizes: WinPrizeItem[] = res.instantWins.map((iw: any) => {
                const tk = (res.tickets || []).find((t: any) => t.id === iw.ticketId);
                return {
                  id: iw.id,
                  title: iw.prizeName || iw.title || "Instant Win Prize",
                  ticketNumber: tk ? tk.ticketNumber : (iw.ticketNumber || 0),
                  rrpValue: iw.rrpValue,
                  prizeImage: iw.prizeImage || iw.image,
                };
              });
              setWinAnimationPrizes(instantPrizes);
              setIsWinModalOpen(true);
            }

            setPurchaseSuccessData({
              raffleTitle: raffle.title,
              tickets: res.tickets,
              instantWins: formattedWins,
              totalAmount: res.tickets.length * ticketPrice,
            });
            setStatusMessage(null);
          } else {
            setStatusMessage({ type: "success", text: "Payment confirmed successfully!" });
          }
        })
        .catch((err) => {
          console.error("Payment confirmation error:", err);
          window.history.replaceState({}, document.title, window.location.pathname);
          setStatusMessage({
            type: "error",
            text: err?.response?.data?.message || "Failed to confirm payment status.",
          });
        });
    }
  }, [raffle.title, ticketPrice]);

  useEffect(() => {
    if (!endDate) {
      setTimeLeft("Ended");
      return;
    }
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) return "Ended";
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      const pad = (n: number) => n.toString().padStart(2, '0');
      
      if (d > 0) return `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
      return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
    };
    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [endDate]);


  const soldPercent = Math.min(Math.round((soldTickets / totalTickets) * 100), 100);
  const remainingTickets = Math.max(totalTickets - soldTickets, 0);

  const maxRemainingForPerson =
    maxPerPerson !== undefined && maxPerPerson !== null
      ? Math.max(0, maxPerPerson - userOwnedTickets)
      : remainingTickets;

  const effectiveMax = Math.min(remainingTickets, maxRemainingForPerson);
  const isPersonalLimitReached =
    maxPerPerson !== undefined &&
    maxPerPerson !== null &&
    userOwnedTickets >= maxPerPerson;

  useEffect(() => {
    setQuantity((prev) => {
      if (effectiveMax <= 0) return 1;
      if (prev < minAllowed) return Math.min(minAllowed, effectiveMax);
      if (prev > effectiveMax) return effectiveMax;
      return prev;
    });
  }, [minAllowed, effectiveMax]);

  const totalPrice = quantity * ticketPrice;

  const handleQuickPick = (val: number) => {
    if (effectiveMax <= 0) return;
    const clamped = Math.max(minAllowed, Math.min(val, effectiveMax));
    setQuantity(clamped);
  };
  const handleDecrement = () =>
    setQuantity((prev) => (prev > minAllowed ? prev - 1 : minAllowed));
  const handleIncrement = () =>
    setQuantity((prev) => (prev < effectiveMax ? prev + 1 : prev));

  const handleAddToBasket = () => {
    if (isPersonalLimitReached) {
      setStatusMessage({
        type: 'error',
        text: `You have reached the maximum allowed limit of ${maxPerPerson} tickets for this competition.`,
      });
      return;
    }
    if (quantity < minAllowed) {
      setStatusMessage({
        type: 'error',
        text: `Minimum ${minAllowed} tickets required for this competition.`,
      });
      return;
    }
    if (quantity > remainingTickets) {
      setStatusMessage({ type: 'error', text: `Only ${remainingTickets} tickets left.` });
      return;
    }
    if (quantity > effectiveMax) {
      setStatusMessage({
        type: 'error',
        text: `You can only purchase up to ${effectiveMax} tickets before reaching your limit of ${maxPerPerson}.`,
      });
      return;
    }

    addItem(
      {
        raffleId: raffle.id,
        slug: raffle.slug || raffle.id,
        title: raffle.title,
        image: raffle.images?.[0] || '',
        pricePerTicket: ticketPrice,
        totalTickets,
        ticketsSold: soldTickets,
        category: raffle.category,
        minTickets: raffle.minTickets,
        maxTickets: raffle.maxTickets,
      },
      quantity,
    );
  };

  const handlePurchase = () => {
    if (isPersonalLimitReached) {
      setStatusMessage({
        type: 'error',
        text: `You have reached the maximum allowed limit of ${maxPerPerson} tickets for this competition.`,
      });
      return;
    }
    if (quantity < minAllowed) {
      setStatusMessage({
        type: 'error',
        text: `Minimum ${minAllowed} tickets required for this competition.`,
      });
      return;
    }
    if (quantity > remainingTickets) {
      setStatusMessage({ type: 'error', text: `Only ${remainingTickets} tickets left.` });
      return;
    }
    if (quantity > effectiveMax) {
      setStatusMessage({
        type: 'error',
        text: `You can only purchase up to ${effectiveMax} tickets before reaching your limit of ${maxPerPerson}.`,
      });
      return;
    }

    setStatusMessage(null);

    // Add item to basket
    addItem(
      {
        raffleId: raffle.id,
        slug: raffle.slug || raffle.id,
        title: raffle.title,
        image: raffle.images?.[0] || '',
        pricePerTicket: ticketPrice,
        totalTickets,
        ticketsSold: soldTickets,
        category: raffle.category,
        minTickets: raffle.minTickets,
        maxTickets: raffle.maxTickets,
      },
      quantity,
    );

    // Direct user to checkout to fill shipping details before payment
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  const handleClaimWin = async () => {
    try {
      const winnerIds = winAnimationPrizes.map((p) => p.id).filter((id): id is string => !!id);
      await userService.claimInstantWins(winnerIds.length > 0 ? winnerIds : undefined);
      toast.success("Prize claimed successfully! View your wins in your profile.");
      setIsWinModalOpen(false);
      setWinAnimationPrizes([]);
    } catch (err: any) {
      console.error("Claim error:", err);
      toast.error(err?.response?.data?.message || "Failed to claim prize.");
    }
  };

  return (
    <div className="bg-surface border border-border rounded-card p-6 shadow-card flex flex-col w-full max-w-[400px]">
      
      {/* Top Value Section */}
      <div className="flex flex-col gap-1 mb-6">
        <span className="font-sans text-[10px] text-text-muted uppercase tracking-wider font-bold">Combined Prize Pool</span>
        <span className="font-heading font-black text-[32px] text-text-brand leading-tight">£{totalPoolValue.toLocaleString()}</span>
        <span className="font-sans text-[11px] text-text-muted">
          Worth: £{(worthPrice || totalPoolValue).toLocaleString()}. Est. Valuation: £{((worthPrice || totalPoolValue) * 0.9).toLocaleString()}
        </span>
      </div>

      {/* Stats Rows */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center justify-between pb-3 border-b border-divider">
          <span className="font-sans text-xs font-semibold text-text-muted">End Date</span>
          <span className="font-heading font-bold text-xs text-text-brand tabular-nums tracking-wider animate-pulse">
            {timeLeft || "Ended"}
          </span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-divider">
          <span className="font-sans text-xs font-semibold text-text-muted">Ticket Price</span>
          <span className="font-heading font-bold text-xs text-text-primary">£{ticketPrice.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-divider">
          <span className="font-sans text-xs font-semibold text-text-muted">Tickets</span>
          <span className="font-heading font-bold text-xs text-text-primary">{soldTickets.toLocaleString()} / {totalTickets.toLocaleString()}</span>
        </div>
        {minAllowed > 1 && (
          <div className="flex items-center justify-between pb-3 border-b border-divider">
            <span className="font-sans text-xs font-semibold text-text-muted">Min Entry</span>
            <span className="font-heading font-bold text-xs text-text-primary">{minAllowed} tickets</span>
          </div>
        )}
        {maxPerPerson !== undefined && maxPerPerson !== null && (
          <div className="flex items-center justify-between pb-3 border-b border-divider">
            <span className="font-sans text-xs font-semibold text-text-muted">Max Per Person</span>
            <span className="font-heading font-bold text-xs text-text-primary">
              {maxPerPerson} tickets {isAuthenticated && userOwnedTickets > 0 ? `(${userOwnedTickets} owned)` : ''}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="w-full h-2 bg-elevated border border-border-medium rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${soldPercent}%` }}
          />
        </div>
        <div className="flex justify-end">
          <span className="font-sans text-[11px] text-text-muted font-bold">{remainingTickets.toLocaleString()} tickets left</span>
        </div>
      </div>

      {/* Ticket Selection */}
      <div className="flex flex-col gap-3 mb-6">
        <span className="font-sans text-xs font-bold text-text-primary">Number of tickets</span>
        
        <div className="grid grid-cols-4 gap-2">
          {[1, 5, 10, 20].map((num) => {
            const isOutOfRange = (num < minAllowed && minAllowed > 1) || (effectiveMax > 0 && num > effectiveMax);
            return (
              <button
                key={num}
                onClick={() => handleQuickPick(num)}
                disabled={effectiveMax <= 0 || isPersonalLimitReached}
                className={`h-9 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  quantity === num 
                    ? "bg-primary text-white border border-primary shadow-xs" 
                    : isOutOfRange
                    ? "bg-surface/50 border border-divider text-text-muted/50 hover:border-border-medium"
                    : "bg-surface border border-border text-text-muted hover:border-border-medium hover:text-text-primary"
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        <div className="flex items-center h-11 bg-elevated border border-border-medium rounded-xl overflow-hidden mt-1">
          <button 
            onClick={handleDecrement}
            disabled={quantity <= minAllowed || effectiveMax <= 0 || isPersonalLimitReached}
            className="w-11 h-full flex items-center justify-center bg-surface hover:bg-accent-bg text-text-primary font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            -
          </button>
          <div className="flex-1 h-full flex items-center justify-center font-heading font-bold text-sm text-text-primary border-x border-border-medium">
            {quantity}
          </div>
          <button 
            onClick={handleIncrement}
            disabled={quantity >= effectiveMax || remainingTickets === 0 || isPersonalLimitReached}
            className="w-11 h-full flex items-center justify-center bg-surface hover:bg-accent-bg text-text-primary font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Total & Enter CTA */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs font-semibold text-text-muted">Total ({quantity} tickets)</span>
          <span className="font-heading font-black text-lg text-text-primary">£{totalPrice.toFixed(2)}</span>
        </div>

        {isPersonalLimitReached && (
          <div className="p-3 rounded-xl text-xs font-sans text-center font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
            Personal Limit Reached: You hold {userOwnedTickets} / {maxPerPerson} tickets
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <button 
            type="button"
            onClick={handleAddToBasket}
            disabled={remainingTickets === 0 || isPersonalLimitReached}
            className="w-full h-12 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-2 border-[#15803d] text-[#15803d] hover:bg-[#15803d] hover:text-white shadow-xs active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2.2}
              stroke='currentColor'
              className='w-4 h-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z'
              />
            </svg>
            Add to Basket
          </button>

          <button 
            onClick={handlePurchase}
            disabled={remainingTickets === 0 || isPersonalLimitReached}
            className={`w-full h-12 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center shadow-md active:scale-98 cursor-pointer ${
              remainingTickets === 0 || isPersonalLimitReached
                ? 'bg-elevated border border-border text-text-muted cursor-not-allowed'
                : 'bg-primary hover:bg-primary-hover text-white'
            }`}
          >
            {isPersonalLimitReached ? 'Limit Reached' : `Enter Draw Now — £${totalPrice.toFixed(2)}`}
          </button>
        </div>

        {/* UK-Compliant Free Postal Entry Route Button */}
        <FreePostalEntryButton raffleTitle={raffle.title} variant="button" />

        {statusMessage && (
          <div className={`p-3 rounded-xl text-xs font-sans text-center font-medium ${
            statusMessage.type === 'success' ? 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]' : 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]'
          }`}>
            {statusMessage.text}
          </div>
        )}

        <p className="font-sans text-[10px] text-text-muted text-center">
          Secure checkout. Competitions fully audited. 18+
        </p>
      </div>

      {/* Share Button */}
      <button className="w-full h-10 mt-4 flex items-center justify-center gap-2 rounded-xl bg-surface border border-border hover:bg-elevated text-text-primary font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs">
        <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
        </svg>
        <span>Share this competition</span>
      </button>

      {/* Instant Ticket Numbers & Instant Win Purchase Confirmation Modal */}
      <TicketPurchaseSuccessModal
        isOpen={!!purchaseSuccessData && !isWinModalOpen}
        onClose={() => setPurchaseSuccessData(null)}
        data={purchaseSuccessData}
      />

      {/* Instant Win Rolling Slot Animation Modal */}
      <WinAnimationModal
        isOpen={isWinModalOpen}
        onClose={() => setIsWinModalOpen(false)}
        onClaim={handleClaimWin}
        prizes={winAnimationPrizes}
      />
    </div>
  );
}
