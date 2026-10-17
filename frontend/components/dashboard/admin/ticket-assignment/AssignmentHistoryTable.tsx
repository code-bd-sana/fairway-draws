"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { useAdminTicketAssignmentHistory } from "../../../../hooks/useAdminHooks";
import { AssignmentHistoryItem } from "../../../../services/admin.service";
import {
  Search,
  Filter,
  ShieldCheck,
  Zap,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
} from "lucide-react";

export default function AssignmentHistoryTable() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<AssignmentHistoryItem | null>(null);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError } = useAdminTicketAssignmentHistory({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
  });

  const history = data?.history || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  return (
    <div className="w-full bg-surface border border-border rounded-2xl p-5 sm:p-7 flex flex-col gap-6 shadow-card">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-divider">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h3 className="font-heading font-black text-lg sm:text-xl text-text-primary uppercase tracking-tight">
              Manual Assignment Audit History
            </h3>
          </div>
          <p className="font-sans text-xs text-text-muted">
            Permanent record of all tickets manually issued by administrators.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order ID, recipient, notes..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-elevated border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary font-sans"
          />
        </div>
      </div>

      {/* History Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-xs text-text-muted">Loading assignment audit logs...</p>
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-red-500 font-sans text-xs">
          Failed to load assignment history.
        </div>
      ) : history.length === 0 ? (
        <div className="p-12 text-center text-text-muted font-sans text-xs flex flex-col items-center justify-center gap-2">
          <span className="text-3xl">🛡️</span>
          <p className="font-heading font-bold text-sm text-text-primary">No manual assignments found</p>
          <p className="text-text-muted">When you manually assign tickets from Tab 1, they will be archived here.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[960px] flex flex-col">
            {/* Table Header Row */}
            <div className="grid grid-cols-12 gap-4 pb-3 border-b border-border font-sans text-[11px] font-bold text-text-muted uppercase tracking-wider bg-elevated/40 px-3 py-2 rounded-xl mb-1">
              <div className="col-span-2">Date &amp; Order ID</div>
              <div className="col-span-3">Recipient</div>
              <div className="col-span-3">Competition</div>
              <div className="col-span-1 text-center">Tickets</div>
              <div className="col-span-1 text-right">Value</div>
              <div className="col-span-1 text-center">Channel</div>
              <div className="col-span-1 text-right pr-2">Action</div>
            </div>

            {/* Table Body Rows */}
            <div className="flex flex-col">
              {history.map((item, index) => {
                const hasInstantWins = item.instantWinsCount > 0;

                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 gap-4 py-3.5 px-3 items-center font-sans border-b border-divider hover:bg-elevated/50 transition-colors rounded-xl ${
                      index === history.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    {/* Date & Order ID */}
                    <div className="col-span-2 flex flex-col gap-0.5 min-w-0">
                      <span className="font-mono font-bold text-xs text-text-brand truncate" title={item.gatewayTransactionId}>
                        {item.gatewayTransactionId.slice(0, 19)}...
                      </span>
                      <span className="font-sans text-[11px] text-text-muted">
                        {format(new Date(item.date), "dd MMM yyyy, HH:mm")}
                      </span>
                    </div>

                    {/* Recipient */}
                    <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-accent-bg border border-border flex items-center justify-center font-heading font-black text-xs text-text-brand shrink-0 overflow-hidden">
                        {item.recipient.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.recipient.avatarUrl}
                            alt={item.recipient.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-3.5 h-3.5 text-text-muted" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-heading font-bold text-xs text-text-primary truncate">
                          {item.recipient.name}
                        </span>
                        <span className="font-sans text-[11px] text-text-muted truncate">
                          {item.recipient.email}
                        </span>
                      </div>
                    </div>

                    {/* Competition */}
                    <div className="col-span-3 flex flex-col min-w-0 gap-0.5">
                      <span
                        className="font-heading font-bold text-xs text-text-primary truncate"
                        title={item.competition?.title || "Competition"}
                      >
                        {item.competition?.title || "Competition"}
                      </span>
                      {hasInstantWins && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-amber-500">
                          <Zap className="w-3 h-3 fill-amber-500" />
                          <span>{item.instantWinsCount} Instant Win Prize Won!</span>
                        </span>
                      )}
                    </div>

                    {/* Tickets */}
                    <div className="col-span-1 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-text-brand font-mono font-bold text-xs">
                        {item.ticketsCount}
                      </span>
                    </div>

                    {/* Value */}
                    <div className="col-span-1 text-right font-heading font-black text-xs text-text-primary">
                      £{item.totalAmount.toFixed(2)}
                    </div>

                    {/* Channel Badge */}
                    <div className="col-span-1 flex justify-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black uppercase tracking-wider bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 whitespace-nowrap shadow-2xs">
                        <span>🛡️</span>
                        <span>ADMIN MANUAL</span>
                      </span>
                    </div>

                    {/* Action */}
                    <div className="col-span-1 text-right pr-2">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="p-1.5 rounded-lg bg-elevated hover:bg-surface border border-border text-text-muted hover:text-text-primary transition-all cursor-pointer"
                        title="View Full Audit Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-divider text-xs font-sans">
          <span className="text-text-muted">
            Showing Page <strong className="text-text-primary">{meta.page}</strong> of{" "}
            <strong className="text-text-primary">{meta.totalPages}</strong> ({meta.total} Total Entries)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-lg bg-elevated border border-border text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-lg bg-elevated border border-border text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Assignment Detail Inspection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl p-6 sm:p-7 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-divider">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-heading font-black text-base uppercase text-text-primary">
                  Allocation Audit Record
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-elevated cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs font-sans">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Transaction ID:</span>
                <span className="font-mono text-text-brand select-all">{selectedItem.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Gateway Ref:</span>
                <span className="font-mono text-text-primary select-all">
                  {selectedItem.gatewayTransactionId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Date:</span>
                <span className="text-text-primary">
                  {format(new Date(selectedItem.date), "dd MMM yyyy, HH:mm:ss")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Recipient:</span>
                <span className="font-bold text-text-primary">
                  {selectedItem.recipient.name} ({selectedItem.recipient.email})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Competition:</span>
                <span className="font-bold text-text-primary">
                  {selectedItem.competition?.title || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Total Accounting Value:</span>
                <span className="font-heading font-black text-sm text-text-brand">
                  £{selectedItem.totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Assigned Ticket Numbers */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-divider">
                <span className="text-text-muted font-bold">
                  Assigned Ticket Numbers ({selectedItem.assignedNumbers.length}):
                </span>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 rounded-lg bg-elevated border border-border custom-scrollbar">
                  {selectedItem.assignedNumbers.map((num) => (
                    <span
                      key={num}
                      className="px-2 py-0.5 rounded bg-surface border border-border font-mono text-xs text-text-primary"
                    >
                      #{num}
                    </span>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              {selectedItem.adminNotes && (
                <div className="p-3 rounded-lg bg-elevated border border-border flex flex-col gap-1">
                  <span className="font-bold text-text-muted text-[11px] flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Admin Reason / Notes:
                  </span>
                  <p className="text-text-primary italic">{selectedItem.adminNotes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-elevated hover:bg-surface border border-border font-heading font-bold text-xs uppercase tracking-wider text-text-primary cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
