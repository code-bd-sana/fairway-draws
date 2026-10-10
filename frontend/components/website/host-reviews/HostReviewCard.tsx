"use client";

import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { ReviewItem } from "../../../types/review.types";
import { cn } from "../../../lib/utils";
import { useFlagReviewMutation } from "../../../hooks/useReviewHooks";

interface HostReviewCardProps {
  review: ReviewItem;
  canFlag?: boolean;
}

export default function HostReviewCard({ review, canFlag = false }: HostReviewCardProps) {
  const [isFlagged, setIsFlagged] = useState(review.status === "FLAGGED");
  const flagMutation = useFlagReviewMutation();

  const handleFlag = async () => {
    try {
      await flagMutation.mutateAsync(review.id);
      setIsFlagged(true);
    } catch (e) {
      console.error("Failed to flag review", e);
    }
  };

  const formattedDate = review.createdAt
    ? format(new Date(review.createdAt), "dd MMM yyyy")
    : "Recently";

  const initials = review.reviewerName
    ? review.reviewerName
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "VW";

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between shadow-xs",
        isFlagged
          ? "bg-red-950/20 border-red-500/40 opacity-80"
          : "bg-surface border-border hover:border-border-medium hover:shadow-sm"
      )}
    >
      <div>
        {/* Header: Reviewer info + Stars */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#ECF5EE] border border-[#CBD8C8] overflow-hidden flex items-center justify-center shrink-0">
              {review.reviewerAvatar ? (
                <img
                  src={review.reviewerAvatar}
                  alt={review.reviewerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-heading font-black text-xs text-[#0b4d35]">
                  {initials}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm text-text-primary">
                  {review.reviewerName}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#DCFCE7] text-[#15803D] uppercase tracking-wider border border-[#BBF7D0]">
                  ✓ Verified Winner
                </span>
              </div>
              <span className="font-sans text-[11px] text-text-muted">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Star Rating Display */}
          <div className="flex items-center gap-0.5 text-amber-400 text-sm shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < review.rating ? "opacity-100" : "text-gray-300 dark:text-gray-700 opacity-40"}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Won Prize Badge */}
        {review.prizeWon && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-elevated border border-border text-[11px] font-semibold text-[#0b4d35] dark:text-emerald-400">
              <span>🏆 Won:</span>
              <span className="font-bold truncate max-w-[240px]">{review.prizeWon}</span>
            </span>
          </div>
        )}

        {/* Review Comment */}
        <p className="font-sans text-sm text-text-secondary leading-relaxed">
          {isFlagged ? (
            <span className="italic text-text-muted">This review is currently under admin moderation.</span>
          ) : (
            review.comment || <span className="italic text-text-muted">Rating provided with no written comment.</span>
          )}
        </p>
      </div>

      {/* Footer / Flag Action */}
      {canFlag && !isFlagged && (
        <div className="flex justify-end border-t border-divider pt-3 mt-4">
          <button
            onClick={handleFlag}
            disabled={flagMutation.isPending}
            className="text-[11px] font-semibold text-text-muted hover:text-[#DC2626] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3v1.5M3 21v-6m0 0 2.77-.693a15.26 15.26 0 0 1 9.46 0l2.77.693M3 15V4.5A1.5 1.5 0 0 1 4.5 3h15A1.5 1.5 0 0 1 21 4.5v10.5M21 15v-6"
              />
            </svg>
            {flagMutation.isPending ? "Flagging..." : "Flag for Moderation"}
          </button>
        </div>
      )}
    </div>
  );
}
