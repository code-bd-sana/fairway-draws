import React from "react";
import AdminTicketAssignmentManager from "../../../../components/dashboard/admin/ticket-assignment/AdminTicketAssignmentManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Manual Ticket Assignment | Admin Dashboard",
  description:
    "Directly assign tickets to users with complete financial integrity, host wallet crediting, and instant win prize automation.",
};

export default function AdminTicketAssignmentPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-divider">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold shadow-2xs">
              🛡️
            </div>
            <h1 className="font-heading font-black text-2xl lg:text-3xl text-text-primary uppercase tracking-tight">
              Admin Manual Ticket Assignment
            </h1>
          </div>
          <p className="font-sans text-xs text-text-muted">
            Issue competition tickets directly to any user account with 100% financial consistency, host wallet crediting, and instant win prize claims.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 font-heading font-black text-xs uppercase tracking-wider shadow-2xs flex items-center gap-1.5">
            <span>🛡️</span>
            <span>Channel: ADMIN_MANUAL</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Manager */}
      <AdminTicketAssignmentManager />
    </div>
  );
}
