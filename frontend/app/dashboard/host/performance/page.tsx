"use client";

import React, { useState } from "react";
import RevenueTrendChart from "../../../../components/dashboard/host/performance/RevenueTrendChart";
import CategorySalesChart from "../../../../components/dashboard/host/performance/CategorySalesChart";
import TopRafflesList from "../../../../components/dashboard/host/performance/TopRafflesList";
import DemographicsList from "../../../../components/dashboard/host/performance/DemographicsList";
import { 
  mockPerformanceRevenue, 
  mockPerformanceCategories, 
  mockPerformanceTopRaffles, 
  mockPerformanceDemographics 
} from "../../../../data/dashboard/host-dashboard.data";
import { cn } from "../../../../lib/utils";

const TIMEFRAMES = ["7D", "1M", "3M", "1Y"];

export default function PerformanceStatsPage() {
  const [activeTimeframe, setActiveTimeframe] = useState("1M");

  return (
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header & Timeframe Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading font-black text-2xl lg:text-3xl text-text-primary uppercase tracking-tight">
            Performance Analytics
          </h1>
          <p className="font-sans text-xs text-text-muted">
            Track competition revenue trends, category breakdowns, and entrant demographics.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-elevated p-1 rounded-xl border border-border-medium w-fit">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={cn(
                "h-8 px-3 rounded-lg flex items-center justify-center font-heading font-bold text-xs transition-all cursor-pointer",
                activeTimeframe === tf
                  ? "bg-surface text-text-brand border border-border shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Top Row: Revenue Trend & Category Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        <div className="lg:col-span-2">
          <RevenueTrendChart data={mockPerformanceRevenue} />
        </div>
        <div className="lg:col-span-1">
          <CategorySalesChart data={mockPerformanceCategories} />
        </div>
      </div>

      {/* Bottom Row: Top Raffles & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
        <TopRafflesList data={mockPerformanceTopRaffles} />
        <DemographicsList data={mockPerformanceDemographics} />
      </div>

    </div>
  );
}
