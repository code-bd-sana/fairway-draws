"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TicketsTable, { Ticket } from "@/components/dashboard/TicketsTable";
import { useMyTicketsQuery, useMyPendingOrdersQuery, usePayPendingOrderMutation } from "../../../../hooks/useTicketHooks";
import { format } from "date-fns";
import { toast } from "sonner";

export default function UserTicketsPage() {
  const [activeTab, setActiveTab] = useState<"tickets" | "pending">("tickets");
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  const { data: ticketsData, isLoading: isTicketsLoading, isError: isTicketsError } = useMyTicketsQuery();
  const { data: pendingOrdersData, isLoading: isPendingLoading } = useMyPendingOrdersQuery();
  const payOrderMutation = usePayPendingOrderMutation();

  const backendTickets = ticketsData || [];
  const pendingOrders: any[] = pendingOrdersData || [];

  const handlePayOrder = async (orderId: string) => {
    setPayingOrderId(orderId);
    try {
      const res = await payOrderMutation.mutateAsync(orderId);
      if (res?.url) {
        toast.success("Redirecting to secure payment checkout...");
        window.location.href = res.url;
      } else {
        toast.success("Payment confirmed! Tickets allocated to your account.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setPayingOrderId(null);
    }
  };

  if (isTicketsLoading && isPendingLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-xs text-text-muted">Loading your tickets and orders...</p>
      </div>
    );
  }

  if (isTicketsError) {
    return (
      <div className="p-8 text-center text-red-500 font-sans text-sm">
        Failed to load tickets. Please refresh the page.
      </div>
    );
  }

  const formattedTickets: Ticket[] = backendTickets.map((t: any) => {
    let status: Ticket["status"] = "live";
    if (t.raffle.status === "ENDED") {
      const hasWon = t.winners && t.winners.length > 0;
      status = hasWon ? "drawn-won" : "drawn-lost";
    } else {
      const hasInstantWin = t.winners?.some((w: any) => w.winType === 'INSTANT_WIN');
      if (hasInstantWin) {
        status = "instant-win";
      }
    }
    return {
      id: t.id,
      ticketId: `#TKT-${t.ticketNumber}`,
      competitionName: t.raffle.title,
      purchaseDate: format(new Date(t.createdAt), "dd MMM yyyy"),
      pricePaid: "Paid",
      status,
      raw: t,
    };
  });

  const totalOwned = formattedTickets.length;
  const activeTickets = formattedTickets.filter((t) => t.status === "live" || t.status === "instant-win").length;
  const wonTickets = formattedTickets.filter((t) => t.status === "drawn-won" || t.status === "instant-win").length;
  const unpaidOrdersCount = pendingOrders.length;

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading font-black text-2xl lg:text-3xl text-text-primary uppercase tracking-tight">
          My Tickets &amp; Orders
        </h1>
        <p className="font-sans text-xs text-text-muted">
          View all your confirmed ticket numbers, pending checkout orders, and competition outcomes.
        </p>
      </div>

      {/* Warning notification banner if there are unpaid orders */}
      {unpaidOrdersCount > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">⏳</span>
            <span>
              You have <strong className="font-bold">{unpaidOrdersCount} unpaid order(s)</strong>. Complete payment now before competitions sell out!
            </span>
          </div>
          <button
            onClick={() => setActiveTab("pending")}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-heading font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer shrink-0"
          >
            Review Unpaid Orders
          </button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
        {/* Total Tickets Owned */}
        <div className="bg-surface border border-border rounded-card p-5 sm:p-6 flex flex-col gap-2.5 shadow-card">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Confirmed Tickets
          </p>
          <p className="font-heading font-black text-3xl lg:text-4xl leading-tight text-text-primary">
            {totalOwned}
          </p>
          <span className="font-sans font-semibold text-xs text-text-muted">
            Lifetime entries
          </span>
        </div>

        {/* Active Tickets */}
        <div className="bg-surface border border-border rounded-card p-5 sm:p-6 flex flex-col gap-2.5 shadow-card">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Live Draw Tickets
          </p>
          <p className="font-heading font-black text-3xl lg:text-4xl leading-tight text-text-primary">
            {activeTickets}
          </p>
          <span className="font-sans font-bold text-xs text-text-brand">
            Awaiting live draw
          </span>
        </div>

        {/* Tickets in Won Competitions */}
        <div className="bg-surface border border-border rounded-card p-5 sm:p-6 flex flex-col gap-2.5 shadow-card">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Won Prizes
          </p>
          <p className="font-heading font-black text-3xl lg:text-4xl leading-tight text-text-primary">
            {wonTickets}
          </p>
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-success-bg border border-[#BBF7D0] w-fit">
            <span className="font-sans text-[10px] font-bold text-success-text">
              🏆 {wonTickets} winning entries
            </span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-surface border border-border rounded-card p-5 sm:p-6 flex flex-col gap-2.5 shadow-card">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Unpaid Orders
          </p>
          <p className="font-heading font-black text-3xl lg:text-4xl leading-tight text-amber-600 dark:text-amber-400">
            {unpaidOrdersCount}
          </p>
          <span className="font-sans font-semibold text-xs text-text-muted">
            {unpaidOrdersCount > 0 ? "Awaiting payment" : "No pending checkouts"}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-divider gap-3 mt-2">
        <button
          onClick={() => setActiveTab("tickets")}
          className={`py-3 px-4 text-xs font-heading font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "tickets"
              ? "border-primary text-text-brand"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <span>🎟️ Confirmed Tickets</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-accent-bg border border-primary/20 text-text-brand font-bold">
            {totalOwned}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`py-3 px-4 text-xs font-heading font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "pending"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <span>⏳ Pending / Unpaid Orders</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              unpaidOrdersCount > 0
                ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 font-bold"
                : "bg-elevated text-text-muted"
            }`}
          >
            {unpaidOrdersCount}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "tickets" ? (
        <TicketsTable tickets={formattedTickets} />
      ) : (
        /* PENDING ORDERS TAB */
        <div className="flex flex-col gap-4">
          {pendingOrders.length === 0 ? (
            <div className="w-full bg-surface border border-border rounded-card p-12 text-center flex flex-col items-center justify-center gap-2">
              <span className="text-4xl">🎉</span>
              <p className="font-heading font-bold text-base text-text-primary">
                No Pending Orders
              </p>
              <p className="font-sans text-xs text-text-muted max-w-md">
                You do not have any pending orders. When you enter a competition and proceed to checkout, any unpaid orders will be stored here.
              </p>
              <Link
                href="/raffles"
                className="mt-3 px-4 py-2 rounded-xl bg-primary text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-primary-hover transition-all"
              >
                Browse Competitions
              </Link>
            </div>
          ) : (
            pendingOrders.map((order) => {
              const hasSoldOut = order.items.some((i: any) => i.isSoldOut);
              const hasExpired = order.items.some((i: any) => i.isExpired);
              const canPay = order.canPay && !hasSoldOut && !hasExpired;

              return (
                <div
                  key={order.id}
                  className="bg-surface border border-border rounded-card p-5 sm:p-6 shadow-card flex flex-col gap-5 transition-all"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-divider">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-mono font-bold text-xs text-text-brand bg-accent-bg border border-primary/20 px-2.5 py-1 rounded-lg">
                        #{order.orderNumber ? order.orderNumber.slice(0, 16) : order.id.slice(0, 8)}
                      </span>
                      <span className="font-sans text-xs text-text-muted">
                        Initiated {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-sans font-bold text-[10px] uppercase tracking-wider">
                        ⏳ Awaiting Payment
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-sans text-[10px] text-text-muted uppercase block">Total Due</span>
                        <span className="font-heading font-black text-xl text-text-primary">
                          £{Number(order.amount).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => handlePayOrder(order.id)}
                        disabled={!canPay || payingOrderId === order.id}
                        className={`h-[40px] px-5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                          canPay
                            ? "btn-glossy-red text-white hover:scale-102 active:scale-98"
                            : "bg-elevated border border-border text-text-muted cursor-not-allowed opacity-60"
                        }`}
                      >
                        {payingOrderId === order.id ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : canPay ? (
                          <>
                            <span>💳 Pay Now</span>
                          </>
                        ) : hasSoldOut ? (
                          <span>🚫 Sold Out</span>
                        ) : (
                          <span>⛔ Expired</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="flex flex-col gap-3">
                    {order.items.map((item: any) => (
                      <div
                        key={item.raffleId}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl bg-elevated/60 border border-divider"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surface shrink-0 border border-border">
                            <Image
                              src={item.raffleImage || "https://placehold.co/400x300/1a230a/8cb34a?text=Draw"}
                              alt={item.raffleTitle}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>

                          <div className="flex flex-col min-w-0">
                            <h4 className="font-heading font-bold text-sm text-text-primary truncate" title={item.raffleTitle}>
                              {item.raffleTitle}
                            </h4>
                            <span className="font-sans text-xs text-text-muted">
                              {item.quantity} {item.quantity === 1 ? "ticket" : "tickets"} × £{Number(item.pricePerTicket).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Status Guard for this item */}
                        <div className="flex items-center gap-3 shrink-0">
                          {item.isSoldOut ? (
                            <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 font-sans font-bold text-xs flex items-center gap-1.5">
                              <span>🚫</span>
                              <span>SOLD OUT! Capacity reached.</span>
                            </span>
                          ) : item.isExpired ? (
                            <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 font-sans font-bold text-xs flex items-center gap-1.5">
                              <span>⛔</span>
                              <span>Draw Ended</span>
                            </span>
                          ) : item.remainingTickets < item.quantity ? (
                            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800 font-sans font-bold text-xs flex items-center gap-1.5">
                              <span>⚠️</span>
                              <span>Only {item.remainingTickets} tickets left</span>
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800 font-sans font-semibold text-xs flex items-center gap-1.5">
                              <span>✅</span>
                              <span>Tickets Available ({item.remainingTickets} left)</span>
                            </span>
                          )}

                          <span className="font-heading font-bold text-sm text-text-primary min-w-[70px] text-right">
                            £{Number(item.subtotal).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Informational warning if sold out */}
                  {hasSoldOut && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
                      <span className="text-base">⚠️</span>
                      <span>
                        One or more competitions in this pending order reached 100% capacity before payment was made. You cannot pay for sold-out draws.
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
