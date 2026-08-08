"use client";

import React, { useState } from "react";
import CompetitionDetailsModal from "./CompetitionDetailsModal";

export interface Ticket {
  id: string;
  ticketId: string;
  competitionName: string;
  purchaseDate: string;
  pricePaid: string;
  status: "live" | "drawn-won" | "drawn-lost" | "instant-win";
  raw?: any; // The raw backend ticket data for the modal
}

interface TicketsTableProps {
  tickets: Ticket[];
}

export default function TicketsTable({ tickets }: TicketsTableProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <>
      <div className="w-full bg-surface border border-border rounded-card p-6 flex flex-col shadow-card">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-heading font-black text-lg text-text-primary uppercase tracking-tight">
            All Purchased Tickets
          </h3>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-elevated border border-border-medium hover:bg-surface text-text-muted hover:text-text-primary font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Table/Grid */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[900px] flex flex-col">
            {/* Table Header Row */}
            <div className="grid grid-cols-12 gap-4 pb-3 border-b border-divider font-sans text-[11px] font-bold text-text-muted uppercase tracking-wider">
              <div className="col-span-2 pl-4">Ticket ID</div>
              <div className="col-span-4">Competition Name</div>
              <div className="col-span-2">Purchase Date</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-center">Result Status</div>
              <div className="col-span-1 text-right pr-4">Action</div>
            </div>

            {/* Table Body Rows */}
            <div className="flex flex-col">
              {tickets.map((ticket, index) => (
                <div 
                  key={ticket.id} 
                  className={`grid grid-cols-12 gap-4 py-4 items-center font-sans border-b border-divider hover:bg-elevated/40 transition-colors ${index === tickets.length - 1 ? 'border-b-0' : ''}`}
                >
                  {/* Ticket ID */}
                  <div className="col-span-2 pl-4 font-mono font-bold text-xs text-text-brand">
                    {ticket.ticketId}
                  </div>

                  {/* Competition Name */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent-bg border border-primary/30 flex items-center justify-center shrink-0 overflow-hidden relative shadow-xs">
                      {ticket.raw?.raffle?.mainImage ? (
                        <img src={ticket.raw.raffle.mainImage} alt={ticket.competitionName} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-5 h-5 text-primary" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                          <circle cx="50" cy="50" r="30" />
                          <circle cx="50" cy="50" r="15" />
                        </svg>
                      )}
                    </div>
                    <span className="font-heading font-bold text-xs text-text-primary truncate pr-4">
                      {ticket.competitionName}
                    </span>
                  </div>

                  {/* Purchase Date */}
                  <div className="col-span-2 font-sans font-semibold text-xs text-text-muted">
                    {ticket.purchaseDate}
                  </div>

                  {/* Price Paid */}
                  <div className="col-span-1 font-sans font-bold text-xs text-text-primary">
                    {ticket.pricePaid}
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex justify-center">
                    {ticket.status === "live" && (
                      <div className="px-3 py-1 rounded-full border border-primary/30 bg-accent-bg">
                        <span className="text-[10px] font-bold text-text-brand uppercase tracking-wider">Live</span>
                      </div>
                    )}
                    {ticket.status === "instant-win" && (
                      <div className="px-3 py-1 rounded-full border border-[#FDE68A] bg-[#FEF3C7] shadow-xs">
                        <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">⚡ Instant Win</span>
                      </div>
                    )}
                    {ticket.status === "drawn-won" && (
                      <div className="px-3 py-1 rounded-full border border-[#BBF7D0] bg-[#DCFCE7] shadow-xs">
                        <span className="text-[10px] font-bold text-[#15803D] uppercase tracking-wider">🏆 Drawn — Won</span>
                      </div>
                    )}
                    {ticket.status === "drawn-lost" && (
                      <div className="px-3 py-1 rounded-full border border-border-medium bg-elevated">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Drawn — Lost</span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="col-span-1 text-right pr-4">
                    <button 
                      onClick={() => setSelectedTicket(ticket)}
                      className="font-sans font-bold text-xs text-text-brand hover:underline transition-all whitespace-nowrap group flex items-center justify-end gap-1 w-full cursor-pointer"
                    >
                      View <span className="hidden sm:inline">Details</span>
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CompetitionDetailsModal 
        isOpen={!!selectedTicket} 
        onClose={() => setSelectedTicket(null)} 
        ticket={selectedTicket} 
        allTickets={tickets}
      />
    </>
  );
}
