"use client";

import React, { useState } from "react";
import { useCreateReviewMutation, useUpdateReviewMutation } from "../../../hooks/useReviewHooks";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  winnerId: string;
  prizeName: string;
  competitionTitle: string;
  hostName: string;
  existingReview?: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
}

export default function ReviewModal({
  isOpen,
  onClose,
  winnerId,
  prizeName,
  competitionTitle,
  hostName,
  existingReview,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(existingReview?.comment || "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const createMutation = useCreateReviewMutation();
  const updateMutation = useUpdateReviewMutation();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (rating < 1 || rating > 5) {
      setErrorMsg("Please select a rating from 1 to 5 stars.");
      return;
    }

    try {
      if (existingReview?.id) {
        await updateMutation.mutateAsync({
          id: existingReview.id,
          payload: {
            rating,
            comment: comment.trim() || undefined,
          },
        });
        setSuccessToast("Your review has been successfully updated!");
      } else {
        await createMutation.mutateAsync({
          winnerId,
          rating,
          comment: comment.trim() || undefined,
        });
        setSuccessToast("Thank you! Your verified review has been submitted.");
      }

      setTimeout(() => {
        setSuccessToast(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit your review. Please try again.";
      setErrorMsg(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Toast banner */}
        {successToast && (
          <div className="absolute top-4 left-6 right-6 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 rounded-xl flex items-center gap-2 font-sans text-xs font-semibold animate-in fade-in slide-in-from-top-2">
            <span>✓</span>
            <span>{successToast}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] uppercase tracking-wider border border-[#BBF7D0]">
                Verified Winner
              </span>
              <span className="font-sans text-xs text-text-muted">
                {existingReview ? "Edit Review" : "Leave Review"}
              </span>
            </div>
            <h2 className="font-heading font-black text-xl text-text-primary tracking-tight">
              Rate your experience with {hostName}
            </h2>
            <p className="font-sans text-xs text-text-muted">
              Prize: <strong className="text-text-primary">{prizeName}</strong> ({competitionTitle})
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-elevated transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Star Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs font-bold uppercase tracking-wider text-text-muted">
              Overall Rating <span className="text-[#DC2626]">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                  >
                    <span
                      className={`text-3xl sm:text-4xl transition-colors ${
                        active ? "text-amber-400 drop-shadow-sm" : "text-gray-300 dark:text-gray-700"
                      }`}
                    >
                      ★
                    </span>
                  </button>
                );
              })}
              <span className="ml-3 font-heading font-black text-lg text-text-primary">
                {rating} / 5
              </span>
            </div>
          </div>

          {/* Feedback Textarea */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="font-sans text-xs font-bold uppercase tracking-wider text-text-muted">
                Your Review / Feedback (Optional)
              </label>
              <span className="font-sans text-[11px] text-text-muted">
                {comment.length} / 500
              </span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              placeholder="Tell others about prize delivery, communication with the host, or how thrilled you were to win!"
              rows={4}
              maxLength={500}
              className="w-full bg-elevated border border-border-medium rounded-xl p-3.5 font-sans text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-[#DC2626] rounded-xl font-sans text-xs">
              {errorMsg}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl font-sans text-xs font-semibold text-text-muted hover:text-text-primary hover:bg-elevated transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider bg-primary hover:bg-primary-hover text-white transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : existingReview ? (
                "Update Review"
              ) : (
                "Submit Verified Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
