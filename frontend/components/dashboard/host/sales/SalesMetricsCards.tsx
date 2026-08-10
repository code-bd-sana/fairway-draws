import React from "react";
import { HostDashboardStat } from "../../../../types/host-dashboard.types";
import { cn } from "../../../../lib/utils";

interface Props {
  metrics: HostDashboardStat[];
}

export default function SalesMetricsCards({ metrics }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div 
          key={metric.id}
          className="flex flex-col p-6 bg-surface border border-border rounded-card hover:border-border-medium transition-all shadow-card"
        >
          <span className="font-sans font-bold text-xs uppercase tracking-wider text-text-muted mb-3">
            {metric.label}
          </span>
          <div className="flex items-end justify-between">
            <span className="font-heading font-black text-3xl text-text-primary leading-none">
              {metric.value}
            </span>
            <span 
              className={cn(
                "font-sans font-bold text-[11px] px-2.5 py-0.5 rounded-full border",
                metric.trend === "up" 
                  ? "bg-success-bg border-[#BBF7D0] text-success-text" 
                  : "bg-[#FEE2E2] border-[#FECACA] text-[#DC2626]"
              )}
            >
              {metric.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
