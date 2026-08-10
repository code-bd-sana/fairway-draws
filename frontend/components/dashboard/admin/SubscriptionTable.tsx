"use client";

import { useAllSubscriptionsAdmin } from '@/hooks/useSubscriptionHooks';
import React from "react";


export default function SubscriptionTable() {
  const { data: subscriptions, isLoading } = useAllSubscriptionsAdmin();

  if (isLoading) {
    return (
      <div className="w-full bg-surface border border-border rounded-card p-8 flex items-center justify-center shadow-card">
        <span className="font-sans text-xs text-text-muted font-bold animate-pulse">Loading subscription records...</span>
      </div>
    );
  }

  const subs = subscriptions || [];

  const getStatusPill = (status: string) => {
    switch (status) {
      case "Active":
        return <span className="px-3 py-1 rounded-full border border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D] font-sans font-bold text-[10px] uppercase tracking-wider shadow-xs">Active</span>;
      case "Past Due":
        return <span className="px-3 py-1 rounded-full border border-[#FDE68A] bg-[#FEF3C7] text-[#D97706] font-sans font-bold text-[10px] uppercase tracking-wider shadow-xs">Past Due</span>;
      case "Cancelled":
        return <span className="px-3 py-1 rounded-full border border-[#FECACA] bg-[#FEE2E2] text-[#DC2626] font-sans font-bold text-[10px] uppercase tracking-wider shadow-xs">Cancelled</span>;
      default:
        return null;
    }
  };

  const getPlanPill = (plan: string) => {
    switch (plan) {
      case "Pro":
      case "Premium":
      case "Free":
        return <span className="px-3 py-1 rounded-full border border-primary/30 bg-accent-bg text-text-brand font-sans font-bold text-[10px] uppercase tracking-wider shadow-xs">{plan}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-surface border border-border rounded-card overflow-hidden overflow-x-auto h-full flex flex-col shadow-card">
      <table className="w-full min-w-[1000px] text-left border-collapse">
        <thead>
          <tr className="border-b border-divider bg-elevated">
            <th className="py-3.5 px-6 font-sans text-[10px] font-bold text-text-muted uppercase tracking-wider w-[25%]">HOST OPERATOR</th>
            <th className="py-3.5 px-6 font-sans text-[10px] font-bold text-text-muted uppercase tracking-wider w-[12%]">PLAN</th>
            <th className="py-3.5 px-6 font-sans text-[10px] font-bold text-text-muted uppercase tracking-wider w-[18%]">PURCHASE DATE</th>
            <th className="py-3.5 px-6 font-sans text-[10px] font-bold text-text-muted uppercase tracking-wider w-[18%]">NEXT RENEWAL</th>
            <th className="py-3.5 px-6 font-sans text-[10px] font-bold text-text-muted uppercase tracking-wider w-[17%]">PAYMENT</th>
            <th className="py-3.5 px-6 font-sans text-[10px] font-bold text-text-muted uppercase tracking-wider w-[10%] text-center">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((sub: any, i: number) => {
            const hostName = sub.host?.businessName || sub.host?.user?.firstName + ' ' + sub.host?.user?.lastName || 'Unknown Host';
            const initials = hostName.substring(0, 2).toUpperCase();
            const endDate = new Date(sub.endDate);
            const startDate = new Date(sub.startDate || sub.createdAt);
            const formattedDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(endDate);
            const formattedStartDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(startDate);
            const displayStatus = sub.status === 'ACTIVE' ? 'Active' : sub.status === 'CANCELLED' ? 'Cancelled' : 'Past Due';
            const tx = sub.transaction;

            return (
              <tr key={sub.id} className={`${i !== subs.length - 1 ? 'border-b border-divider' : ''} hover:bg-elevated/40 transition-colors`}>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-bg border border-primary/30 flex items-center justify-center shrink-0 shadow-xs">
                      <span className="font-sans font-bold text-xs text-text-brand">{initials}</span>
                    </div>
                    <span className="font-heading font-bold text-xs text-text-primary">{hostName}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {getPlanPill(sub.plan?.name || "Free")}
                </td>
                <td className="py-4 px-6">
                  <span className="font-sans font-semibold text-xs text-text-muted">{formattedStartDate}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="font-sans font-semibold text-xs text-text-muted">{formattedDate}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="font-heading font-bold text-xs text-text-primary">£{sub.plan?.price} - {tx?.status || 'COMPLETED'}</span>
                    {tx?.gatewayTransactionId && <span className="font-mono text-[11px] text-text-muted mt-0.5">{tx.gatewayTransactionId}</span>}
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  {getStatusPill(displayStatus)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
