"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  useAdminTicketAssignmentCompetitions,
  useAdminTicketAssignmentCompetition,
  useAdminAssignTicketsMutation,
} from "../../../../hooks/useAdminHooks";
import {
  AssignmentCompetitionSummary,
  AssignmentUser,
  AssignTicketsResponse,
} from "../../../../services/admin.service";
import CompetitionSelector from "./CompetitionSelector";
import InstantWinVisualizer from "./InstantWinVisualizer";
import TicketGridSelector from "./TicketGridSelector";
import RecipientUserSearch from "./RecipientUserSearch";
import AccountingBreakdown from "./AccountingBreakdown";
import { ConfirmationModal, SuccessModal } from "./AssignmentModals";
import AssignmentHistoryTable from "./AssignmentHistoryTable";
import { Ticket, History, Shield, Sparkles } from "lucide-react";

export default function AdminTicketAssignmentManager() {
  const [activeTab, setActiveTab] = useState<"assign" | "history">("assign");

  // Selection states
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AssignmentUser | null>(null);
  const [mode, setMode] = useState<"specific" | "random">("specific");
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [randomQuantity, setRandomQuantity] = useState<number>(1);
  const [adminNotes, setAdminNotes] = useState<string>("");

  // Modals & results
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [assignmentResult, setAssignmentResult] = useState<AssignTicketsResponse | null>(null);

  // Queries & Mutations
  const { data: competitionsData, isLoading: isCompsLoading } = useAdminTicketAssignmentCompetitions();
  const { data: competitionDetail, isLoading: isDetailLoading } = useAdminTicketAssignmentCompetition(
    selectedCompetitionId || undefined
  );
  const assignTicketsMutation = useAdminAssignTicketsMutation();

  const competitions = competitionsData || [];

  // Toggle ticket number selection in Specific mode
  const handleToggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else {
      if (competitionDetail && selectedNumbers.length >= competitionDetail.remainingTickets) {
        toast.error(`Cannot select more than remaining tickets (${competitionDetail.remainingTickets})`);
        return;
      }
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
  };

  const handleSelectCompetition = (comp: AssignmentCompetitionSummary) => {
    setSelectedCompetitionId(comp.id);
    setSelectedNumbers([]);
    setRandomQuantity(1);
  };

  const handleClearSelection = () => {
    setSelectedNumbers([]);
    setRandomQuantity(1);
  };

  const handleExecuteAssignment = async () => {
    if (!selectedCompetitionId || !selectedUser) {
      toast.error("Please ensure both a competition and a recipient user are selected");
      return;
    }

    const payload = {
      raffleId: selectedCompetitionId,
      userId: selectedUser.id,
      ticketNumbers: mode === "specific" ? selectedNumbers : undefined,
      quantity: mode === "random" ? randomQuantity : undefined,
      adminNotes: adminNotes.trim() || undefined,
    };

    try {
      const res = await assignTicketsMutation.mutateAsync(payload);
      setAssignmentResult(res);
      setConfirmModalOpen(false);
      setSuccessModalOpen(true);

      // Reset form states
      setSelectedNumbers([]);
      setRandomQuantity(1);
      setAdminNotes("");

      if (res.instantWins && res.instantWins.length > 0) {
        toast.success(`🎉 Tickets Assigned & ${res.instantWins.length} Instant Win Prize(s) Unlocked!`);
      } else {
        toast.success(res.message || "Tickets assigned successfully!");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to assign tickets";
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Top Tabs */}
      <div className="flex border-b border-divider gap-2 sm:gap-4 select-none">
        <button
          onClick={() => setActiveTab("assign")}
          className={`py-3.5 px-5 text-xs sm:text-sm font-heading font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2.5 focus:outline-none ${
            activeTab === "assign"
              ? "border-primary text-text-brand bg-accent-bg/50 rounded-t-xl"
              : "border-transparent text-text-muted hover:text-text-primary hover:bg-elevated/40 rounded-t-xl"
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Assign Tickets</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`py-3.5 px-5 text-xs sm:text-sm font-heading font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2.5 focus:outline-none ${
            activeTab === "history"
              ? "border-primary text-text-brand bg-accent-bg/50 rounded-t-xl"
              : "border-transparent text-text-muted hover:text-text-primary hover:bg-elevated/40 rounded-t-xl"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Assignment History</span>
        </button>
      </div>

      {/* Tab 1: Assign Tickets */}
      {activeTab === "assign" && (
        <div className="flex flex-col gap-6">
          {/* Step 1: Competition Selection */}
          <CompetitionSelector
            competitions={competitions}
            selectedCompetition={competitionDetail || null}
            onSelectCompetition={handleSelectCompetition}
            isLoading={isCompsLoading}
          />

          {/* Render remaining steps once competition is selected */}
          {competitionDetail && (
            <>
              {/* Step 2: Instant Win Visualizer */}
              <InstantWinVisualizer
                instantWins={competitionDetail.instantWins}
                selectedNumbers={selectedNumbers}
                onToggleNumber={handleToggleNumber}
              />

              {/* Step 3: Ticket Number Selection */}
              <TicketGridSelector
                competition={competitionDetail}
                mode={mode}
                setMode={setMode}
                selectedNumbers={selectedNumbers}
                onToggleNumber={handleToggleNumber}
                onSetSpecificNumbers={setSelectedNumbers}
                randomQuantity={randomQuantity}
                setRandomQuantity={setRandomQuantity}
                onClearSelection={handleClearSelection}
              />

              {/* Step 4: Recipient User Search */}
              <RecipientUserSearch
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
              />

              {/* Step 5: Accounting Breakdown & Action */}
              <AccountingBreakdown
                competition={competitionDetail}
                recipient={selectedUser}
                mode={mode}
                selectedNumbers={selectedNumbers}
                randomQuantity={randomQuantity}
                adminNotes={adminNotes}
                setAdminNotes={setAdminNotes}
                onRequestConfirm={() => setConfirmModalOpen(true)}
                isSubmitting={assignTicketsMutation.isPending}
              />
            </>
          )}

          {/* Initial Helper Banner when no competition is selected yet */}
          {!competitionDetail && (
            <div className="p-12 text-center text-text-muted font-sans text-xs flex flex-col items-center justify-center gap-2.5 bg-surface border border-dashed border-border rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-accent-bg border border-primary/20 flex items-center justify-center text-2xl">
                🎯
              </div>
              <p className="font-heading font-black text-sm text-text-primary">
                Select a live competition above to start manual ticket allocation
              </p>
              <p className="text-text-muted max-w-md">
                Once selected, the instant win visualizer, interactive ticket grid, user recipient search, and accounting breakdown will activate.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Assignment History */}
      {activeTab === "history" && <AssignmentHistoryTable />}

      {/* Confirmation Modal */}
      {competitionDetail && selectedUser && (
        <ConfirmationModal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleExecuteAssignment}
          competition={competitionDetail}
          recipient={selectedUser}
          mode={mode}
          selectedNumbers={selectedNumbers}
          randomQuantity={randomQuantity}
          adminNotes={adminNotes}
          isSubmitting={assignTicketsMutation.isPending}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        onViewHistory={() => {
          setSuccessModalOpen(false);
          setActiveTab("history");
        }}
        result={assignmentResult}
      />
    </div>
  );
}
