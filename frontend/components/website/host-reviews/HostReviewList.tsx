"use client";

import React, { useState } from "react";
import { useHostReviewsQuery } from "../../../hooks/useReviewHooks";
import HostReviewCard from "./HostReviewCard";
import { cn } from "../../../lib/utils";

interface HostReviewListProps {
  hostId: string;
  hostName: string;
}

export default function HostReviewList({ hostId, hostName }: HostReviewListProps) {
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError } = useHostReviewsQuery(hostId, {
    page,
    limit: 10,
    rating: selectedRating,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-surface border border-border rounded-2xl shadow-sm">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-sans font-bold text-xs text-text-muted">Loading host verified reviews...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-surface border border-red-200 rounded-2xl shadow-sm">
        <p className="font-sans font-bold text-xs text-[#DC2626]">
          Failed to load reviews for this host. Please try again.
        </p>
      </div>
    );
  }

  const stats = data?.stats;
  const reviews = data?.reviews || [];
  const totalReviews = stats?.totalReviews || 0;
  const averageRating = stats?.averageRating;

  // 1. Overall Empty State (0 total reviews)
  if (totalReviews === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-[#CBD8C8] bg-white shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl mb-4 text-amber-500 shadow-inner">
          ⭐
        </div>
        <h3 className="font-heading font-black text-xl sm:text-2xl text-[#0e1e17] mb-2 uppercase tracking-tight">
          No Host Reviews Yet
        </h3>
        <p className="font-sans text-sm text-[#5e766c] max-w-md leading-relaxed mb-6">
          Verified winners can leave ratings and feedback once competitions and prizes from{" "}
          <strong className="text-[#0e1e17]">{hostName}</strong> are completed and delivered.
        </p>
        <div className="inline-flex items-center gap-2 bg-[#ECF5EE] border border-[#CBD8C8] px-4 py-2 rounded-xl">
          <span className="text-amber-500 font-bold text-sm">★ New Host</span>
          <span className="text-xs font-semibold text-[#0b4d35]">Verified Golf Partner</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* 1. Score Overview Card */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Big Average Rating Display */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-8">
            <span className="font-heading font-black text-5xl sm:text-6xl text-text-primary tracking-tight">
              {averageRating !== null && averageRating !== undefined ? averageRating.toFixed(1) : "—"}
            </span>
            <span className="font-sans text-xs uppercase font-bold tracking-wider text-text-muted mt-1">
              out of 5.0
            </span>

            {/* Stars visual */}
            <div className="flex items-center gap-1 text-amber-400 text-xl my-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = averageRating !== null && averageRating !== undefined && averageRating >= star;
                const halfFilled =
                  averageRating !== null &&
                  averageRating !== undefined &&
                  averageRating >= star - 0.5 &&
                  averageRating < star;
                return (
                  <span
                    key={star}
                    className={filled || halfFilled ? "opacity-100" : "text-gray-300 dark:text-gray-700 opacity-40"}
                  >
                    ★
                  </span>
                );
              })}
            </div>

            <p className="font-sans text-xs font-semibold text-[#0b4d35] dark:text-emerald-400">
              Based on {totalReviews} {totalReviews === 1 ? "verified review" : "verified reviews"}
            </p>
          </div>

          {/* Interactive 1-5 Star Distribution Progress Bars */}
          <div className="md:col-span-7 flex flex-col gap-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats?.breakdown?.[star as 1 | 2 | 3 | 4 | 5] || 0;
              const pct = stats?.percentages?.[star as 1 | 2 | 3 | 4 | 5] || 0;
              const isSelected = selectedRating === star;

              return (
                <button
                  key={star}
                  onClick={() => {
                    setSelectedRating(isSelected ? undefined : star);
                    setPage(1);
                  }}
                  className={cn(
                    "flex items-center gap-3 w-full p-1.5 rounded-xl transition-all cursor-pointer group text-left",
                    isSelected ? "bg-accent-bg border border-primary/30" : "hover:bg-elevated"
                  )}
                >
                  <span className="font-sans text-xs font-bold text-text-primary w-12 shrink-0 flex items-center gap-1">
                    <span>{star}</span>
                    <span className="text-amber-400">★</span>
                  </span>

                  {/* Progress Bar Container */}
                  <div className="flex-1 h-3 bg-elevated rounded-full overflow-hidden border border-border-medium">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isSelected ? "bg-primary" : "bg-amber-400 group-hover:bg-amber-500"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Count & % */}
                  <span className="font-sans text-xs font-semibold text-text-muted w-16 text-right shrink-0">
                    {count} ({pct}%)
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        <button
          onClick={() => {
            setSelectedRating(undefined);
            setPage(1);
          }}
          className={cn(
            "px-4 py-2 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer",
            selectedRating === undefined
              ? "bg-[#0b4d35] text-white shadow-sm"
              : "bg-surface border border-border text-text-muted hover:text-text-primary hover:bg-elevated"
          )}
        >
          All Reviews ({totalReviews})
        </button>

        {[5, 4, 3, 2, 1].map((star) => {
          const count = stats?.breakdown?.[star as 1 | 2 | 3 | 4 | 5] || 0;
          const isSelected = selectedRating === star;

          return (
            <button
              key={star}
              onClick={() => {
                setSelectedRating(isSelected ? undefined : star);
                setPage(1);
              }}
              className={cn(
                "px-3.5 py-2 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5",
                isSelected
                  ? "bg-[#0b4d35] text-white shadow-sm"
                  : "bg-surface border border-border text-text-muted hover:text-text-primary hover:bg-elevated"
              )}
            >
              <span>{star}</span>
              <span className="text-amber-400">★</span>
              <span>({count})</span>
            </button>
          );
        })}
      </div>

      {/* 3. Review Cards or Filter Empty State */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-border bg-surface">
          <span className="text-3xl mb-3">🔍</span>
          <h4 className="font-heading font-black text-lg text-text-primary uppercase tracking-tight mb-1">
            No {selectedRating}-Star Reviews
          </h4>
          <p className="font-sans text-xs text-text-muted mb-4 max-w-sm">
            There are currently no verified reviews matching this specific star rating filter.
          </p>
          <button
            onClick={() => setSelectedRating(undefined)}
            className="px-4 py-2 rounded-xl font-heading font-bold text-xs uppercase tracking-wider bg-surface border border-border hover:bg-elevated text-text-primary transition-all cursor-pointer"
          >
            Reset Filter to All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <HostReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Pagination Controls if > 1 page */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-xl font-heading font-bold text-xs uppercase tracking-wider bg-surface border border-border text-text-primary hover:bg-elevated disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>
          <span className="font-sans text-xs text-text-muted">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <button
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl font-heading font-bold text-xs uppercase tracking-wider bg-surface border border-border text-text-primary hover:bg-elevated disabled:opacity-40 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
