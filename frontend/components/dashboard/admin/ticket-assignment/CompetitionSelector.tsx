"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { AssignmentCompetitionSummary, AssignmentCompetitionDetail } from "../../../../services/admin.service";
import { Search, Trophy, CheckCircle2, AlertCircle } from "lucide-react";

interface CompetitionSelectorProps {
  competitions: AssignmentCompetitionSummary[];
  selectedCompetition: AssignmentCompetitionDetail | null;
  onSelectCompetition: (comp: AssignmentCompetitionSummary) => void;
  isLoading?: boolean;
}

export default function CompetitionSelector({
  competitions,
  selectedCompetition,
  onSelectCompetition,
  isLoading = false,
}: CompetitionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredCompetitions = useMemo(() => {
    if (!searchTerm.trim()) return competitions;
    const term = searchTerm.toLowerCase();
    return competitions.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.host.businessName.toLowerCase().includes(term) ||
        (c.slug && c.slug.toLowerCase().includes(term))
    );
  }, [competitions, searchTerm]);

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-card flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-divider">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-2xs">
            1
          </div>
          <div>
            <h3 className="font-heading font-black text-base sm:text-lg text-text-primary uppercase tracking-tight">
              Step 1: Select Competition
            </h3>
            <p className="font-sans text-xs text-text-muted">
              Choose an active competition to assign tickets from.
            </p>
          </div>
        </div>

        {selectedCompetition && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-elevated border border-border hover:bg-surface text-text-brand hover:text-text-primary font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            {isOpen ? "Close Selector" : "Change Competition"}
          </button>
        )}
      </div>

      {/* Selector dropdown/cards if open or no competition selected yet */}
      {(!selectedCompetition || isOpen) && (
        <div className="flex flex-col gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search live competitions by title or host..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-elevated border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-all font-sans"
            />
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-text-muted text-xs flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Loading live competitions...</span>
            </div>
          ) : filteredCompetitions.length === 0 ? (
            <div className="py-8 text-center text-text-muted text-xs flex flex-col items-center justify-center gap-1.5 border border-dashed border-border rounded-xl">
              <AlertCircle className="w-6 h-6 text-text-muted" />
              <span>No live competitions found matching your search.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredCompetitions.map((comp) => {
                const isSelected = selectedCompetition?.id === comp.id;
                const percentSold = Math.min(
                  100,
                  Math.round((comp.ticketsSold / comp.totalTickets) * 100)
                );

                return (
                  <div
                    key={comp.id}
                    onClick={() => {
                      onSelectCompetition(comp);
                      setIsOpen(false);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3.5 items-center ${
                      isSelected
                        ? "bg-accent-bg/40 border-primary shadow-xs ring-1 ring-primary"
                        : "bg-elevated/70 border-border hover:border-border-medium hover:bg-elevated"
                    }`}
                  >
                    {/* Cover thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface shrink-0 border border-border">
                      <Image
                        src={comp.mainImage || "https://placehold.co/400x300/1a230a/8cb34a?text=Raffle"}
                        alt={comp.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col min-w-0 flex-1 gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading font-black text-xs sm:text-sm text-text-primary truncate">
                          {comp.title}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-text-brand shrink-0" />
                        )}
                      </div>

                      <span className="font-sans text-[11px] text-text-muted truncate">
                        Host: <strong className="text-text-secondary">{comp.host.businessName}</strong>
                      </span>

                      <div className="flex items-center justify-between text-[11px] font-sans font-semibold text-text-secondary mt-0.5">
                        <span className="text-text-brand font-bold">
                          £{comp.pricePerTicket.toFixed(2)} / ticket
                        </span>
                        <span>
                          {comp.remainingTickets} left of {comp.totalTickets}
                        </span>
                      </div>

                      {/* Mini Progress */}
                      <div className="w-full h-1.5 rounded-full bg-surface border border-border/60 overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all rounded-full"
                          style={{ width: `${percentSold}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Selected Competition Preview Card */}
      {selectedCompetition && (
        <div className="p-4 sm:p-5 rounded-xl bg-elevated/80 border border-primary/40 shadow-xs flex flex-col md:flex-row gap-5 items-start md:items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-surface shrink-0 border border-primary/30 shadow-2xs">
              <Image
                src={selectedCompetition.mainImage || "https://placehold.co/400x300/1a230a/8cb34a?text=Draw"}
                alt={selectedCompetition.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="flex flex-col min-w-0 gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-sans font-bold text-[10px] uppercase tracking-wider">
                  Live Competition
                </span>
                {selectedCompetition.instantWins.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-sans font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <span>⚡</span>
                    <span>{selectedCompetition.instantWins.length} Instant Wins</span>
                  </span>
                )}
              </div>

              <h4 className="font-heading font-black text-base sm:text-lg text-text-primary truncate">
                {selectedCompetition.title}
              </h4>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-xs text-text-muted">
                <span>
                  Host: <strong className="text-text-primary">{selectedCompetition.host.businessName}</strong>
                </span>
                <span>
                  Ticket Price: <strong className="text-text-brand font-bold">£{selectedCompetition.pricePerTicket.toFixed(2)}</strong>
                </span>
                <span>
                  Remaining: <strong className="text-text-primary">{selectedCompetition.remainingTickets}</strong> / {selectedCompetition.totalTickets}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Box */}
          <div className="w-full md:w-56 shrink-0 flex flex-col gap-1.5 pt-3 md:pt-0 border-t md:border-t-0 border-divider">
            <div className="flex justify-between items-center text-xs font-sans font-bold">
              <span className="text-text-muted uppercase text-[10px] tracking-wider">Capacity</span>
              <span className="text-text-primary">
                {Math.min(100, Math.round((selectedCompetition.ticketsSold / selectedCompetition.totalTickets) * 100))}% Sold
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-surface border border-border overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 shadow-2xs"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(
                      (selectedCompetition.ticketsSold / selectedCompetition.totalTickets) * 100
                    )
                  )}%`,
                }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-text-muted font-sans">
              <span>{selectedCompetition.ticketsSold} Sold</span>
              <span>{selectedCompetition.remainingTickets} Available</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
