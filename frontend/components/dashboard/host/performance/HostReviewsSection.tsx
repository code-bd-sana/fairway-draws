"use client";

import React, { useState } from "react";
import { useHostDashboardReviewsQuery } from "../../../../hooks/useReviewHooks";
import HostReviewCard from "../../../website/host-reviews/HostReviewCard";
import { cn } from "../../../../lib/utils";

export default function HostReviewsSection() {
  const { data, isLoading, isError } = useHostDashboardReviewsQuery();
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-card p-6 flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-sans text-xs text-text-muted">Loading your verified reviews...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-surface border border-border rounded-card p-6 text-center">
        <p className="font-sans text-xs text-[#DC2626]">Failed to load reviews.</p>
      </div>
    );
  }

  const metrics = data?.metrics;
  const allReviews = data?.reviews || [];
  const totalReviews = metrics?.totalReviews || 0;
  const averageRating = metrics?.averageRating;
  const satisfactionRate = metrics?.satisfactionRate;

  const filteredReviews = selectedRating
    ? allReviews.filter((r) => r.rating === selectedRating)
    : allReviews;

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading font-black text-xl lg:text-2xl text-text-primary uppercase tracking-tight">
            Verified Customer Reviews &amp; Ratings
          </h2>
          <p className="font-sans text-xs text-text-muted">
            Feedback left by verified winners who claimed prizes from your competitions.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Average Rating Card */}
        <div className="bg-surface border border-border rounded-card p-5 flex flex-col gap-2 shadow-xs">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Average Host Rating
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-3xl text-text-primary">
              {averageRating !== null && averageRating !== undefined ? averageRating.toFixed(1) : "—"}
            </span>
            <span className="font-sans text-xs text-text-muted">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 text-sm">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={
                  averageRating && averageRating >= star
                    ? "opacity-100"
                    : "text-gray-300 dark:text-gray-700 opacity-40"
                }
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Total Reviews Card */}
        <div className="bg-surface border border-border rounded-card p-5 flex flex-col gap-2 shadow-xs">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Total Reviews
          </span>
          <span className="font-heading font-black text-3xl text-text-primary">
            {totalReviews}
          </span>
          <span className="font-sans text-xs text-text-muted">
            100% Verified Prize Winners
          </span>
        </div>

        {/* Satisfaction Rate Card */}
        <div className="bg-surface border border-border rounded-card p-5 flex flex-col gap-2 shadow-xs">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Winner Satisfaction Rate
          </span>
          <span className="font-heading font-black text-3xl text-emerald-600">
            {satisfactionRate !== null && satisfactionRate !== undefined ? `${satisfactionRate}%` : "—"}
          </span>
          <span className="font-sans text-xs text-text-muted">
            Rated 4 or 5 stars
          </span>
        </div>
      </div>

      {/* Breakdown and Reviews List */}
      {totalReviews === 0 ? (
        <div className="bg-surface border border-dashed border-border rounded-card p-12 text-center flex flex-col items-center justify-center">
          <span className="text-3xl mb-2">⭐</span>
          <h3 className="font-heading font-bold text-base text-text-primary uppercase tracking-tight mb-1">
            No Reviews Received Yet
          </h3>
          <p className="font-sans text-xs text-text-muted max-w-md">
            As winners receive and verify their competition prizes, their verified feedback and ratings will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Rating filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedRating(undefined)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer",
                selectedRating === undefined
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface border border-border text-text-muted hover:text-text-primary"
              )}
            >
              All ({totalReviews})
            </button>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = metrics?.breakdown?.[star as 1 | 2 | 3 | 4 | 5] || 0;
              return (
                <button
                  key={star}
                  onClick={() => setSelectedRating(selectedRating === star ? undefined : star)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1",
                    selectedRating === star
                      ? "bg-primary text-white shadow-xs"
                      : "bg-surface border border-border text-text-muted hover:text-text-primary"
                  )}
                >
                  <span>{star}</span>
                  <span className="text-amber-400">★</span>
                  <span>({count})</span>
                </button>
              );
            })}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReviews.map((r) => (
              <HostReviewCard key={r.id} review={r} canFlag={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
