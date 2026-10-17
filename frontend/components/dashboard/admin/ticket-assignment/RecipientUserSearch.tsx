"use client";

import React, { useState, useEffect, useRef } from "react";
import { AssignmentUser, adminService } from "../../../../services/admin.service";
import { Search, CheckCircle2, User, X } from "lucide-react";

interface RecipientUserSearchProps {
  selectedUser: AssignmentUser | null;
  onSelectUser: (user: AssignmentUser | null) => void;
}

export default function RecipientUserSearch({
  selectedUser,
  onSelectUser,
}: RecipientUserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<AssignmentUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (selectedUser) return;

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const users = await adminService.searchTicketAssignmentUsers(searchTerm);
        setResults(users || []);
        setIsOpen(true);
      } catch (err) {
        console.error("Failed to search users:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedUser]);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-card flex flex-col gap-4 relative"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-divider">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-2xs">
            4
          </div>
          <div>
            <h3 className="font-heading font-black text-base sm:text-lg text-text-primary uppercase tracking-tight">
              Step 4: Recipient User Search
            </h3>
            <p className="font-sans text-xs text-text-muted">
              Select the active user account that will receive these tickets.
            </p>
          </div>
        </div>

        {selectedUser && (
          <button
            type="button"
            onClick={() => onSelectUser(null)}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-elevated border border-border hover:bg-surface text-text-brand hover:text-text-primary font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Change Recipient
          </button>
        )}
      </div>

      {/* Selected User Preview Card */}
      {selectedUser ? (
        <div className="p-4 sm:p-5 rounded-xl bg-elevated/80 border border-primary/40 flex items-center justify-between gap-4 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Avatar or initial */}
            <div className="w-12 h-12 rounded-xl bg-accent-bg border border-primary/30 flex items-center justify-center font-heading font-black text-text-brand text-base shrink-0 overflow-hidden shadow-2xs">
              {selectedUser.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {(selectedUser.name || "U").slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex flex-col min-w-0 gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-sm sm:text-base text-text-primary truncate">
                  {selectedUser.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/15 border border-primary/25 text-text-brand font-sans font-bold text-[10px] uppercase tracking-wider">
                  {selectedUser.role}
                </span>
              </div>
              <span className="font-sans text-xs text-text-secondary truncate">
                {selectedUser.email}
              </span>
              <span className="font-mono text-[10px] text-text-muted">
                User ID: {selectedUser.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-sans font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              Verified Entrant
            </span>
            <button
              type="button"
              onClick={() => onSelectUser(null)}
              className="p-2 rounded-lg bg-surface border border-border hover:bg-elevated text-text-muted hover:text-text-primary transition-all cursor-pointer"
              title="Remove recipient"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Autocomplete search input */
        <div className="flex flex-col gap-2 relative">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder="Search by user email, full name, or ID..."
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-elevated border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-all font-sans"
            />
            {isSearching && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Autocomplete Dropdown List */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-64 overflow-y-auto rounded-xl bg-surface border border-border shadow-2xl p-1.5 custom-scrollbar">
              {results.length === 0 ? (
                <div className="py-6 text-center text-text-muted font-sans text-xs">
                  {searchTerm.trim()
                    ? "No users found matching your search."
                    : "Start typing to search users..."}
                </div>
              ) : (
                results.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className="p-2.5 rounded-lg hover:bg-elevated/80 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-accent-bg border border-border flex items-center justify-center font-heading font-black text-text-brand text-xs shrink-0 overflow-hidden">
                        {u.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-text-muted" />
                        )}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="font-heading font-bold text-xs text-text-primary truncate">
                          {u.name}
                        </span>
                        <span className="font-sans text-[11px] text-text-muted truncate">
                          {u.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-elevated border border-border text-[10px] font-mono text-text-muted">
                        {u.role}
                      </span>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-md bg-primary hover:bg-primary-hover text-white text-[11px] font-heading font-bold uppercase tracking-wider"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
