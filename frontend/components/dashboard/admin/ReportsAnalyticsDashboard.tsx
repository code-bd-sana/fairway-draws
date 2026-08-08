"use client";

import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

const REVENUE_DATA = [
  { name: 'Feb', value: 15000 },
  { name: 'Mar', value: 18000 },
  { name: 'Apr', value: 14000 },
  { name: 'May', value: 22000 },
  { name: 'Jun', value: 28400 },
  { name: 'Jul', value: 31000 },
  { name: 'Aug', value: 29000 },
  { name: 'Sep', value: 34000 },
  { name: 'Oct', value: 32000 },
  { name: 'Nov', value: 25000 },
  { name: 'Dec', value: 20000 },
];

const USER_GROWTH_DATA = [
  { name: 'Feb', users: 1500 },
  { name: 'Mar', users: 2400 },
  { name: 'Apr', users: 2900 },
  { name: 'May', users: 3800 },
  { name: 'Jun', users: 5100 },
];

const CATEGORY_DATA = [
  { name: 'Golf Clubs', value: 45, color: '#0B4D35' },
  { name: 'Apparel', value: 25, color: '#15803D' },
  { name: 'Gear & Bags', value: 20, color: '#16A34A' },
  { name: 'Accessories', value: 10, color: '#4ADE80' },
];

const POPULAR_COMPETITIONS = [
  { name: 'Callaway Paradym Driver', value: 420 },
  { name: 'Taylormade Qi10 Iron Set', value: 345 },
  { name: 'Titleist Pro V1 Golf Bundle', value: 250 },
  { name: 'Garmin Approach S70 Watch', value: 200 },
  { name: 'Bushnell Pro X3 Rangefinder', value: 150 },
];

const HOST_PERFORMANCE = [
  { name: 'Fairway Elite', percent: 90 },
  { name: 'Golf World UK', percent: 75 },
  { name: 'Pro Tour Gear', percent: 65 },
  { name: 'Scottish Links', percent: 55 },
  { name: 'Strike Golf', percent: 45 },
];

const GEOGRAPHIC_DATA = [
  { name: 'England', value: 55 },
  { name: 'Scotland', value: 18 },
  { name: 'Wales', value: 12 },
  { name: 'N. Ireland', value: 8 },
  { name: 'Other', value: 7 },
];

const CustomTooltip = ({ active, payload, label, prefix = "", suffix = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border rounded-xl p-3 shadow-card font-sans">
        <p className="text-xs font-bold text-text-muted mb-0.5">{label}</p>
        <p className="font-heading font-black text-sm text-text-primary">
          {prefix}{payload[0].value.toLocaleString()}{suffix}
        </p>
      </div>
    );
  }
  return null;
};

export default function ReportsAnalyticsDashboard() {
  const [timeFilter, setTimeFilter] = useState("3M");
  const filters = ["7D", "1M", "3M", "1Y"];

  return (
    <div className="flex flex-col w-full animate-fadeIn gap-6">
      
      {/* Time Filter Pills */}
      <div className="flex items-center justify-end gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`px-4 py-1.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              timeFilter === filter
                ? "bg-primary text-white shadow-xs border border-primary"
                : "bg-surface border border-border text-text-muted hover:text-text-primary"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-4">
        
        {/* Revenue Trend */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col h-[320px] shadow-card">
          <h3 className="font-heading font-black text-base text-text-primary uppercase tracking-tight mb-4">Revenue Trend</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0B4D35" />
                    <stop offset="100%" stopColor="#15803D" />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'inherit' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip prefix="£" />} cursor={{ stroke: '#E2EADF', strokeWidth: 1 }} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="url(#lineGradient)" 
                  strokeWidth={2.5} 
                  dot={false}
                  activeDot={{ r: 6, fill: '#0B4D35', stroke: '#FFFFFF', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col h-[320px] shadow-card">
          <h3 className="font-heading font-black text-base text-text-primary uppercase tracking-tight mb-2">Sales by Category</h3>
          <div className="flex-1 w-full flex items-center justify-center relative min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="35%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  stroke="none"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip suffix="%" />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="absolute right-[5%] top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {CATEGORY_DATA.map((cat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></div>
                  <span className="font-sans font-semibold text-xs text-text-muted w-[75px] truncate">{cat.name}</span>
                  <span className="font-heading font-bold text-xs text-text-primary">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Most Popular Competitions */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col h-[320px] shadow-card">
          <h3 className="font-heading font-black text-base text-text-primary uppercase tracking-tight mb-4">Most Popular Competitions</h3>
          <div className="flex flex-col gap-4 flex-1 justify-center">
            {POPULAR_COMPETITIONS.map((comp, i) => {
              // Calculate width based on max value (420)
              const width = Math.max((comp.value / 420) * 100, 5);
              return (
                <div key={i} className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-sans font-semibold text-xs text-text-muted truncate max-w-[200px]">{comp.name}</span>
                    <span className="font-heading font-bold text-xs text-text-primary">{comp.value} entries</span>
                  </div>
                  <div className="w-full bg-elevated h-2 rounded-full overflow-hidden border border-border-medium">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${width}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Growth Over Time */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col h-[320px] shadow-card">
          <h3 className="font-heading font-black text-base text-text-primary uppercase tracking-tight mb-4">User Growth Over Time</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={USER_GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B4D35" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0B4D35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'inherit' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip prefix="users: " />} cursor={{ stroke: '#E2EADF', strokeWidth: 1 }} />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#0B4D35" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#areaGradient)" 
                  activeDot={{ r: 6, fill: '#0B4D35', stroke: '#FFFFFF', strokeWidth: 2 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Host Performance */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col h-[320px] shadow-card">
          <h3 className="font-heading font-black text-base text-text-primary uppercase tracking-tight mb-4">Host Performance</h3>
          <div className="flex flex-col flex-1 justify-center gap-3.5">
            {HOST_PERFORMANCE.map((host, i) => (
              <div key={i} className="flex items-center gap-3 w-full">
                <span className="font-sans font-semibold text-xs text-text-muted w-[90px] text-right truncate shrink-0">{host.name}</span>
                <div className="flex-1 h-5 bg-elevated border border-border-medium rounded-md overflow-hidden flex items-center group">
                  <div 
                    className="h-full bg-primary rounded-r-md transition-all duration-500 ease-out flex items-center justify-end pr-2 group-hover:bg-primary/90" 
                    style={{ width: `${host.percent}%` }}
                  >
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Entry Distribution */}
        <div className="bg-surface border border-border rounded-card p-6 flex flex-col h-[320px] shadow-card">
          <h3 className="font-heading font-black text-base text-text-primary uppercase tracking-tight mb-4">Geographic Entry Distribution</h3>
          <div className="flex flex-col gap-4 flex-1 justify-center">
            {GEOGRAPHIC_DATA.map((geo, i) => {
              const width = Math.max(geo.value, 2);
              return (
                <div key={i} className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-sans font-semibold text-xs text-text-muted">{geo.name}</span>
                    <span className="font-heading font-bold text-xs text-text-primary">{geo.value}%</span>
                  </div>
                  <div className="w-full bg-elevated h-2 rounded-full overflow-hidden border border-border-medium">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${width}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
