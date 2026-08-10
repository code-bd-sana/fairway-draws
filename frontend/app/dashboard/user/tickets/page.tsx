"use client";

import React from "react";
import TicketsTable, { Ticket } from "@/components/dashboard/TicketsTable";
import { useMyTicketsQuery } from "../../../../hooks/useTicketHooks";
import { format } from "date-fns";

export default function UserTicketsPage() {
  const { data: ticketsData, isLoading, isError } = useMyTicketsQuery();

  if (isLoading) {
    return <div className="p-8 text-center text-[#72943A]">Loading tickets...</div>;
  }
  if (isError) {
    return <div className="p-8 text-center text-red-500">Failed to load tickets.</div>;
  }

  const backendTickets = ticketsData || [];

  const formattedTickets: Ticket[] = backendTickets.map((t: any) => {
    let status: Ticket["status"] = "live";
    if (t.raffle.status === "ENDED") {
      // Check if user won
      const hasWon = t.winners && t.winners.length > 0;
      status = hasWon ? "drawn-won" : "drawn-lost";
    } else {
      // If still active but they won an instant win
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
      pricePaid: "Paid", // Backend currently doesn't return exact price per ticket easily without transaction join
      status,
      raw: t,
    };
  });

  const totalOwned = formattedTickets.length;
  const activeTickets = formattedTickets.filter((t) => t.status === "live" || t.status === "instant-win").length;
  const wonTickets = formattedTickets.filter((t) => t.status === "drawn-won" || t.status === "instant-win").length;

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading font-black text-2xl lg:text-3xl text-text-primary uppercase tracking-tight">
          My Tickets &amp; Entries
        </h1>
        <p className="font-sans text-xs text-text-muted">
          View all your purchased ticket numbers, draw dates, and winning status.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {/* Total Tickets Owned */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col gap-3 shadow-card">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Total Tickets Owned
          </p>
          <p className="font-heading font-black text-3xl lg:text-4xl leading-tight text-text-primary">
            {totalOwned}
          </p>
          <span className="font-sans font-semibold text-xs text-text-muted">
            Lifetime total
          </span>
        </div>

        {/* Active Tickets */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col gap-3 shadow-card">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Active Competition Tickets
          </p>
          <p className="font-heading font-black text-3xl lg:text-4xl leading-tight text-text-primary">
            {activeTickets}
          </p>
          <span className="font-sans font-bold text-xs text-text-brand">
            Awaiting live draws
          </span>
        </div>

        {/* Tickets in Won Competitions */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col gap-3 shadow-card">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Tickets in Won Competitions
          </p>
          <p className="font-heading font-black text-3xl lg:text-4xl leading-tight text-text-primary">
            {wonTickets}
          </p>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-success-bg border border-[#BBF7D0] w-fit">
            <span className="font-sans text-[10px] font-bold text-success-text">
              🏆 {wonTickets} winning entries
            </span>
          </div>
        </div>
      </div>

      {/* Tickets Data Table Component */}
      <TicketsTable tickets={formattedTickets} />
    </div>
  );
}
