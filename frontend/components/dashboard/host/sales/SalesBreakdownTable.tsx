"use client";

import React, { useState } from "react";
import { HostRaffleDetail } from "../../../../types/host-dashboard.types";
import { cn } from "../../../../lib/utils";

interface Props {
  raffles: HostRaffleDetail[];
}

export default function SalesBreakdownTable({ raffles }: Props) {
  const [activeTab, setActiveTab] = useState("All");
  
  const tabs = ["All", "Active", "Completed"];
  
  const filteredRaffles = raffles.filter(r => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return r.status === "Live";
    if (activeTab === "Completed") return r.status === "Completed";
    return true;
  });

  return (
    <div className="w-full bg-surface border border-border rounded-card overflow-hidden flex flex-col mt-6 shadow-card">
      
      {/* Header & Tabs */}
      <div className="p-6 lg:p-8 border-b border-divider flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface">
        <div>
          <h3 className="font-heading font-black text-lg text-text-primary uppercase tracking-tight">
            Competition Breakdown
          </h3>
          <p className="font-sans text-xs text-text-muted">
            Individual performance metrics for your competitions.
          </p>
        </div>
        
        <div className="flex items-center gap-1 bg-elevated p-1 rounded-xl border border-border-medium">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 rounded-lg font-sans font-bold text-xs transition-all cursor-pointer",
                activeTab === tab
                  ? "bg-surface text-text-brand border border-border shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="border-b border-divider bg-elevated/70">
              <th className="py-4 px-6 font-sans font-bold text-[11px] text-text-muted uppercase tracking-wider">
                Item
              </th>
              <th className="py-4 px-6 font-sans font-bold text-[11px] text-text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="py-4 px-6 font-sans font-bold text-[11px] text-text-muted uppercase tracking-wider">
                Tickets Sold
              </th>
              <th className="py-4 px-6 font-sans font-bold text-[11px] text-text-muted uppercase tracking-wider">
                Price
              </th>
              <th className="py-4 px-6 font-sans font-bold text-[11px] text-text-muted uppercase tracking-wider">
                Gross Revenue
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRaffles.map((raffle, index) => (
              <tr 
                key={raffle.id}
                className={cn(
                  "group transition-colors hover:bg-elevated/60",
                  index !== filteredRaffles.length - 1 && "border-b border-divider"
                )}
              >
                <td className="py-5 px-6">
                  <span className="font-heading font-bold text-sm text-text-primary">
                    {raffle.name}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <span className={cn(
                    "inline-flex px-3 py-0.5 rounded-full font-sans font-bold text-[11px] uppercase tracking-wide border",
                    raffle.status === "Live" && "bg-success-bg border-[#BBF7D0] text-success-text",
                    raffle.status === "Completed" && "bg-accent-bg border border-primary/30 text-text-brand",
                    (raffle.status === "Draft" || raffle.status === "Pending Review") && "bg-[#FEE2E2] border-[#FECACA] text-[#DC2626]"
                  )}>
                    {raffle.status}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-sans font-semibold text-xs text-text-primary">
                      {raffle.ticketsSold} <span className="text-text-muted">/ {raffle.totalTickets}</span>
                    </span>
                    {/* Progress bar */}
                    <div className="w-full max-w-[120px] h-1.5 bg-elevated rounded-full overflow-hidden border border-border-medium">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${(raffle.ticketsSold / raffle.totalTickets) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span className="font-sans font-medium text-xs text-text-muted">
                    £{raffle.ticketPrice.toFixed(2)}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <span className="font-heading font-bold text-sm text-text-brand">
                    £{raffle.grossRevenue.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
