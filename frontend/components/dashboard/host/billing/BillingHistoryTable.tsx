"use client";

import React from "react";
import { BillingHistoryItem } from "../../../../types/host-dashboard.types";

interface Props {
  history: BillingHistoryItem[];
}

export default function BillingHistoryTable({ history }: Props) {
  return (
    <div className="w-full bg-surface border border-border rounded-card overflow-hidden flex flex-col shadow-card">
      
      {/* Header */}
      <div className="p-6 lg:p-8 border-b border-divider bg-surface">
        <h3 className="font-heading font-black text-lg text-text-primary uppercase tracking-tight">
          Billing History
        </h3>
      </div>

      {/* Table Content */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-divider bg-elevated/70">
              <th className="py-4 px-6 lg:px-8 text-left font-sans font-bold text-[11px] text-text-muted uppercase tracking-wider">
                Date
              </th>
              <th className="py-4 px-6 lg:px-8 text-left font-sans font-bold text-[11px] text-text-muted uppercase tracking-wider">
                Description
              </th>
              <th className="py-4 px-6 lg:px-8 text-left font-sans font-bold text-[11px] text-text-muted uppercase tracking-wider">
                Amount
              </th>
              <th className="py-4 px-6 lg:px-8 text-left font-sans font-bold text-[11px] text-text-muted uppercase tracking-wider">
                Invoice / Reference
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr 
                key={item.id} 
                className={`
                  hover:bg-elevated/60 transition-colors
                  ${index !== history.length - 1 ? 'border-b border-divider' : ''}
                `}
              >
                <td className="py-5 px-6 lg:px-8 font-sans font-semibold text-xs text-text-muted">
                  {item.date}
                </td>
                <td className="py-5 px-6 lg:px-8 font-sans font-medium text-xs text-text-primary">
                  {item.description}
                </td>
                <td className="py-5 px-6 lg:px-8 font-heading font-bold text-sm text-text-brand">
                  £{item.amount.toFixed(2)}
                </td>
                <td className="py-5 px-6 lg:px-8 font-sans font-medium text-xs text-text-muted font-mono">
                  {item.invoice || item.id}
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center font-sans text-sm text-text-muted">
                  No billing history recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}
