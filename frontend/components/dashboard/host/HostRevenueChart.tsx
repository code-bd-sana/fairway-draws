interface HostRevenueChartProps {
  totalRevenue?: number;
}

export default function HostRevenueChart({ totalRevenue }: HostRevenueChartProps) {
  const displayRevenue = totalRevenue !== undefined 
    ? `£${Number(totalRevenue).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "£0.00";

  return (
    <div className="bg-surface border border-border rounded-card p-6 w-full flex flex-col h-full min-h-[362px] shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-heading font-black text-lg text-text-primary uppercase tracking-tight">
          Earnings Overview
        </h2>
        
        {/* Time filters */}
        <div className="flex gap-1.5">
          {["7D", "1M", "3M", "1Y"].map((filter) => (
            <button
              key={filter}
              className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
                filter === "1M"
                  ? "bg-accent-bg border border-primary text-text-brand shadow-xs"
                  : "bg-elevated border border-border text-text-muted hover:text-text-primary hover:bg-surface"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <p className="font-heading font-black text-3xl md:text-4xl text-text-primary tracking-tight">
          {displayRevenue}
        </p>
        <div className="bg-success-bg border border-[#BBF7D0] rounded-full px-2.5 py-1 flex items-center justify-center">
          <p className="font-sans font-bold text-[11px] text-success-text uppercase tracking-wide">
            ▲ Live
          </p>
        </div>
      </div>

      <div className="flex-1 w-full pt-5 relative min-h-[200px]">
        {/* Area Chart SVG */}
        <div className="absolute inset-0 w-full h-full">
          <svg preserveAspectRatio="none" viewBox="0 0 875 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#0b4d35]">
            {/* Grid lines */}
            <path d="M47.5 170H875" stroke="#EFF4ED" strokeDasharray="4 4" />
            <path d="M47.5 127.5H875" stroke="#EFF4ED" strokeDasharray="4 4" />
            <path d="M47.5 85H875" stroke="#EFF4ED" strokeDasharray="4 4" />
            <path d="M47.5 42.5H875" stroke="#EFF4ED" strokeDasharray="4 4" />
            <path d="M47.5 0H875" stroke="#EFF4ED" strokeDasharray="4 4" />
            
            {/* Area Fill */}
            <path d="M47.5 150.5C124.5 150.5 201.5 120 278.5 120C355.5 120 432.5 70.5 509.5 70.5C586.5 70.5 663.5 130 740.5 130C817.5 130 875 42.5 875 42.5V170H47.5V150.5Z" fill="url(#paint0_linear)" fillOpacity="0.15" />
            
            {/* Line Path */}
            <path d="M47.5 150.5C124.5 150.5 201.5 120 278.5 120C355.5 120 432.5 70.5 509.5 70.5C586.5 70.5 663.5 130 740.5 130C817.5 130 875 42.5 875 42.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            
            <defs>
              <linearGradient id="paint0_linear" x1="461.25" y1="42.5" x2="461.25" y2="170" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0b4d35" />
                <stop offset="1" stopColor="#0b4d35" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
