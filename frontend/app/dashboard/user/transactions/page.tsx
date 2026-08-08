import React from "react";

interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  description: string;
  amount: string;
  paymentMethod: string;
  status: "completed" | "refunded" | "failed";
}

const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    transactionId: "#TRN-8821",
    date: "15 Jun 2025",
    description: "5 tickets — VFC HK416 Bundle",
    amount: "£12.50",
    paymentMethod: "**** 4242",
    status: "completed",
  },
  {
    id: "2",
    transactionId: "#TRN-8820",
    date: "10 Jun 2025",
    description: "3 tickets — Tokyo Marui MWS",
    amount: "£9.00",
    paymentMethod: "**** 4242",
    status: "completed",
  },
  {
    id: "3",
    transactionId: "#TRN-8815",
    date: "05 Jun 2025",
    description: "8 tickets — Sniper Precision Set",
    amount: "£16.00",
    paymentMethod: "**** 4242",
    status: "refunded",
  },
  {
    id: "4",
    transactionId: "#TRN-8800",
    date: "01 Jun 2025",
    description: "2 tickets — Tactical Loadout",
    amount: "£3.00",
    paymentMethod: "**** 4242",
    status: "completed",
  },
  {
    id: "5",
    transactionId: "#TRN-8790",
    date: "28 May 2025",
    description: "10 tickets — G36 Bundle",
    amount: "£25.00",
    paymentMethod: "**** 4242",
    status: "completed",
  },
  {
    id: "6",
    transactionId: "#TRN-8780",
    date: "20 May 2025",
    description: "1 ticket — Pistol Pack",
    amount: "£2.00",
    paymentMethod: "**** 4242",
    status: "failed",
  },
];

export default function UserTransactionsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading font-black text-2xl lg:text-3xl text-text-primary uppercase tracking-tight">
          Transaction History
        </h1>
        <p className="font-sans text-xs text-text-muted">
          Review all ticket purchases, invoice receipts, and refund transaction logs.
        </p>
      </div>

      {/* Top Summary Card */}
      <div className="bg-surface border border-border rounded-card p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-card">
        <div className="flex flex-col gap-2">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Total Spent This Year
          </span>
          <p className="font-heading font-black text-3xl lg:text-4xl leading-tight text-text-primary">
            £286.50
          </p>
        </div>

        <div className="flex flex-col gap-3 md:w-[400px]">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Spend By Category Breakdown
          </span>
          {/* Segmented Progress Bar */}
          <div className="w-full flex h-2 rounded-full overflow-hidden gap-1 bg-elevated border border-border-medium">
            <div className="h-full bg-primary" style={{ width: "45%" }} />
            <div className="h-full bg-success-text" style={{ width: "30%" }} />
            <div className="h-full bg-[#8cb34a]" style={{ width: "25%" }} />
          </div>
          {/* Legend */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="font-sans font-semibold text-xs text-text-primary">Rifles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-success-text" />
              <span className="font-sans font-semibold text-xs text-text-primary">Gear</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#8cb34a]" />
              <span className="font-sans font-semibold text-xs text-text-primary">Other</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border hover:bg-elevated text-text-muted hover:text-text-primary font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          Date Range Filter
          <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button className="px-4 py-1.5 rounded-full bg-primary text-white font-heading font-bold text-xs uppercase tracking-wider shadow-xs cursor-pointer">
          All
        </button>
        <button className="px-4 py-1.5 rounded-full bg-surface border border-border text-text-muted hover:text-text-primary font-heading font-bold text-xs uppercase tracking-wider cursor-pointer transition-all">
          Purchases
        </button>
        <button className="px-4 py-1.5 rounded-full bg-surface border border-border text-text-muted hover:text-text-primary font-heading font-bold text-xs uppercase tracking-wider cursor-pointer transition-all">
          Refunds
        </button>
      </div>

      {/* Transactions Data Table */}
      <div className="w-full bg-surface border border-border rounded-card p-6 overflow-x-auto shadow-card">
        <div className="min-w-[900px] flex flex-col">
          {/* Table Header Row */}
          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-divider font-sans text-[11px] font-bold text-text-muted uppercase tracking-wider">
            <div className="col-span-2 pl-4">Transaction ID</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-1">Amount</div>
            <div className="col-span-2 text-center">Payment Method</div>
            <div className="col-span-1 text-right pr-4">Status</div>
          </div>

          {/* Table Body Rows */}
          <div className="flex flex-col">
            {DUMMY_TRANSACTIONS.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className={`grid grid-cols-12 gap-4 py-4 items-center font-sans border-b border-divider hover:bg-elevated/40 transition-colors ${index === DUMMY_TRANSACTIONS.length - 1 ? 'border-b-0' : ''}`}
              >
                {/* Transaction ID */}
                <div className="col-span-2 pl-4 font-mono font-bold text-xs text-text-brand">
                  {transaction.transactionId}
                </div>

                {/* Date */}
                <div className="col-span-2 font-sans font-semibold text-xs text-text-muted">
                  {transaction.date}
                </div>

                {/* Description */}
                <div className="col-span-4 font-heading font-bold text-xs text-text-primary truncate pr-4">
                  {transaction.description}
                </div>

                {/* Amount */}
                <div className="col-span-1 font-heading font-black text-xs text-text-primary">
                  {transaction.amount}
                </div>

                {/* Payment Method */}
                <div className="col-span-2 text-center font-sans font-semibold text-xs text-text-muted">
                  {transaction.paymentMethod}
                </div>

                {/* Status */}
                <div className="col-span-1 flex justify-end pr-4">
                  {transaction.status === "completed" && (
                    <div className="px-3 py-1 rounded-full border border-[#BBF7D0] bg-[#DCFCE7] shadow-xs">
                      <span className="text-[10px] font-bold text-[#15803D] uppercase tracking-wider">Completed</span>
                    </div>
                  )}
                  {transaction.status === "refunded" && (
                    <div className="px-3 py-1 rounded-full border border-[#FDE68A] bg-[#FEF3C7] shadow-xs">
                      <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">Refunded</span>
                    </div>
                  )}
                  {transaction.status === "failed" && (
                    <div className="px-3 py-1 rounded-full border border-[#FECACA] bg-[#FEE2E2] shadow-xs">
                      <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">Failed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
