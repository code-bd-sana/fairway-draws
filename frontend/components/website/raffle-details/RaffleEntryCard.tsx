"use client";

import React, { useState, useEffect } from "react";
import { RaffleDetail } from "../../../types/raffle-details.types";
import { usePurchaseTicketsMutation } from "../../../hooks/useTicketHooks";
import { useAuth } from "../../../features/auth/AuthContext";
import { useRouter } from "next/navigation";
import TicketPurchaseSuccessModal, { TicketPurchaseSuccessData } from "./TicketPurchaseSuccessModal";
import FreePostalEntryButton from "../legal/FreePostalEntryButton";

interface RaffleEntryCardProps {
  raffle: RaffleDetail;
}

export default function RaffleEntryCard({ raffle }: RaffleEntryCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [statusMessage, setStatusMessage] = useState<{type: 'success'|'error'|'info', text: string} | null>(null);
  const [purchaseSuccessData, setPurchaseSuccessData] = useState<TicketPurchaseSuccessData | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const purchaseMutation = usePurchaseTicketsMutation(raffle.id);

  const {
    ticketPrice,
    totalPoolValue,
    worthPrice,
    totalTickets,
    soldTickets,
    endDate,
  } = raffle;

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
  const totalPrice = quantity * ticketPrice;

  const handleQuickPick = (val: number) => setQuantity(val);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const handleIncrement = () => setQuantity(prev => prev + 1);

  const handlePurchase = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (quantity > remainingTickets) {
      setStatusMessage({ type: 'error', text: `Only ${remainingTickets} tickets left.` });
      return;
    }
    
    setStatusMessage(null);
    purchaseMutation.mutate(quantity, {
      onSuccess: (data) => {
        if (data?.url) {
          window.location.href = data.url;
          return;
        }

        const formattedWins = (data.instantWins || []).map((iw: any) => {
          const tk = (data.tickets || []).find((t: any) => t.id === iw.ticketId);
          return {
            id: iw.id,
            ticketId: iw.ticketId,
            prizeName: iw.prizeName,
            ticketNumber: tk ? tk.ticketNumber : undefined,
          };
        });

        setPurchaseSuccessData({
          raffleTitle: raffle.title,
          tickets: data.tickets || [],
          instantWins: formattedWins,
          totalAmount: totalPrice,
        });

        setQuantity(1);
      },
      onError: (error: any) => {
        setStatusMessage({ 
          type: 'error', 
          text: error.response?.data?.message || 'Failed to purchase tickets' 
        });
      }
    });
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
          {[1, 5, 10, 20].map((num) => (
            <button
              key={num}
              onClick={() => handleQuickPick(num)}
              className={`h-9 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
                quantity === num 
                  ? "bg-primary text-white border border-primary shadow-xs" 
                  : "bg-surface border border-border text-text-muted hover:border-border-medium hover:text-text-primary"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="flex items-center h-11 bg-elevated border border-border-medium rounded-xl overflow-hidden mt-1">
          <button 
            onClick={handleDecrement}
            className="w-11 h-full flex items-center justify-center bg-surface hover:bg-accent-bg text-text-primary font-bold transition-colors cursor-pointer"
          >
            -
          </button>
          <div className="flex-1 h-full flex items-center justify-center font-heading font-bold text-sm text-text-primary border-x border-border-medium">
            {quantity}
          </div>
          <button 
            onClick={handleIncrement}
            className="w-11 h-full flex items-center justify-center bg-surface hover:bg-accent-bg text-text-primary font-bold transition-colors cursor-pointer"
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

        <button 
          onClick={handlePurchase}
          disabled={purchaseMutation.isPending || remainingTickets === 0}
          className={`w-full h-12 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center shadow-md active:scale-98 cursor-pointer ${
            purchaseMutation.isPending || remainingTickets === 0
              ? 'bg-elevated border border-border text-text-muted cursor-not-allowed'
              : 'bg-primary hover:bg-primary-hover text-white'
          }`}
        >
          {purchaseMutation.isPending ? 'Processing...' : `Enter Draw — £${totalPrice.toFixed(2)}`}
        </button>

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
        isOpen={!!purchaseSuccessData}
        onClose={() => setPurchaseSuccessData(null)}
        data={purchaseSuccessData}
      />
    </div>
  );
}
