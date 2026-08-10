import React from "react";
import SalesMetricsCards from "../../../../components/dashboard/host/sales/SalesMetricsCards";
import SalesChart from "../../../../components/dashboard/host/sales/SalesChart";
import SalesBreakdownTable from "../../../../components/dashboard/host/sales/SalesBreakdownTable";
import { 
  mockSalesMetrics, 
  mockSalesChartData, 
  mockHostRafflesList 
} from "../../../../data/dashboard/host-dashboard.data";

export const metadata = {
  title: "Competition Sales | Host Dashboard",
};

export default function CompetitionSalesPage() {
  return (
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-heading font-black text-2xl lg:text-3xl text-text-primary uppercase tracking-tight">
          Competition Sales
        </h1>
        <p className="font-sans text-sm text-text-muted">
          Monitor your revenue, ticket sales, and overall competition performance.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <SalesMetricsCards metrics={mockSalesMetrics} />

      {/* Sales Trend Chart */}
      <SalesChart data={mockSalesChartData} />

      {/* Competition Breakdown Table */}
      <SalesBreakdownTable raffles={mockHostRafflesList} />
    </div>
  );
}
