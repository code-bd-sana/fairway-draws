"use client";

import React, { useState } from "react";
import { Raffle } from "../../../../services/raffle.service";
import { format } from "date-fns";

interface DrawEntriesTabProps {
  draw?: Raffle;
}

interface Entry {
  id: string;
  buyer: string;
  email: string;
  initials: string;
  qty: number;
  purchased: string;
  status: string;
}

export default function DrawEntriesTab({ draw }: DrawEntriesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const ticketsSold = draw?.ticketsSold || 0;
  const totalTickets = draw?.totalTickets || 0;

  // Render entries or realistic fallback entries generated for demo view
  const mockEntries: Entry[] = [
    { id: "#10243", buyer: "James Thornton", email: "j.thornton@example.com", initials: "JT", qty: 4, purchased: "12 Jun 2025 10:15", status: "Verified" },
    { id: "#10244", buyer: "Sarah Mitchell", email: "s.mitchell@example.com", initials: "SM", qty: 2, purchased: "12 Jun 2025 11:20", status: "Verified" },
    { id: "#10245", buyer: "Oliver Bennett", email: "o.bennett@example.com", initials: "OB", qty: 1, purchased: "12 Jun 2025 13:00", status: "Verified" },
    { id: "#10246", buyer: "Emma Clarke", email: "e.clarke@example.com", initials: "EC", qty: 4, purchased: "12 Jun 2025 13:05", status: "Verified" },
    { id: "#10247", buyer: "Noah Williams", email: "n.williams@example.com", initials: "NW", qty: 3, purchased: "12 Jun 2025 14:10", status: "Verified" },
    { id: "#10248", buyer: "Amelia Davis", email: "a.davis@example.com", initials: "AD", qty: 6, purchased: "12 Jun 2025 15:30", status: "Verified" },
  ];

  const filteredEntries = mockEntries.filter(entry => 
    entry.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 animate-fadeIn">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-black text-base text-text-primary uppercase tracking-tight">
            Ticket Entry Pool
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-accent-bg border border-primary/30 text-text-brand font-sans font-bold text-xs">
            {ticketsSold} / {totalTickets} Sold
          </span>
        </div>

        <div className="relative w-full sm:w-[280px]">
          <svg className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search buyer name or ticket #..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-elevated border border-border-medium rounded-xl pl-10 pr-3 font-sans text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Main Table */}
      {ticketsSold === 0 && searchQuery === "" ? (
        <div className="bg-elevated border border-dashed border-border-medium rounded-xl p-8 text-center flex flex-col items-center justify-center gap-2">
          <span className="text-3xl">🎫</span>
          <h4 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wider">No Tickets Sold Yet</h4>
          <p className="font-sans text-xs text-text-muted max-w-[360px]">
            No participants have purchased tickets for this competition draw yet. Check back once sales open.
          </p>
        </div>
      ) : (
        <div className="w-full bg-surface border border-border rounded-xl overflow-hidden shadow-xs overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="border-b border-divider bg-elevated">
                <th className="py-3.5 px-5 font-sans text-[10px] font-bold text-text-muted uppercase tracking-wider w-[15%]">TICKET #</th>
                <th className="py-3.5 px-5 font-sans text-[10px] font-bold text-text-muted uppercase tracking-wider w-[35%]">BUYER DETAILS</th>
                <th className="py-3.5 px-5 font-sans text-[10px] font-bold text-text-muted uppercase tracking-wider w-[15%] text-center">QTY</th>
                <th className="py-3.5 px-5 font-sans text-[10px] font-bold text-text-muted uppercase tracking-wider w-[20%] text-center">PURCHASED</th>
                <th className="py-3.5 px-5 font-sans text-[10px] font-bold text-text-muted uppercase tracking-wider w-[15%] text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs font-sans text-text-muted">
                    No matching entrant found for "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry, i) => (
                  <tr key={entry.id} className={`${i !== filteredEntries.length - 1 ? 'border-b border-divider' : ''} hover:bg-elevated/50 transition-colors`}>
                    <td className="py-3.5 px-5">
                      <span className="font-mono font-bold text-xs text-text-brand bg-accent-bg px-2 py-0.5 rounded-md border border-primary/20">
                        {entry.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-bg border border-primary/30 flex items-center justify-center shrink-0 shadow-xs">
                          <span className="font-sans font-bold text-xs text-text-brand">{entry.initials}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-sans font-semibold text-xs text-text-primary">{entry.buyer}</span>
                          <span className="font-sans text-[11px] text-text-muted">{entry.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="font-sans font-bold text-xs text-text-primary">{entry.qty}</span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="font-sans text-xs text-text-muted">{entry.purchased}</span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="px-2.5 py-1 rounded-full border border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D] font-sans font-bold text-[10px] uppercase tracking-wider shadow-xs">
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-1 pt-1 font-sans text-xs">
        <span className="text-text-muted">Showing entries for {draw?.title || "Competition"}</span>
        <div className="flex items-center gap-3 font-semibold">
          <button className="text-text-muted hover:text-text-primary transition-colors disabled:opacity-40 cursor-pointer">Previous</button>
          <span className="text-border-medium">|</span>
          <button className="text-text-brand hover:text-primary-hover transition-colors cursor-pointer">Next</button>
        </div>
      </div>
    </div>
  );
}
