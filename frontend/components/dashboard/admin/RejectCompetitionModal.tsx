"use client";

import React from "react";

interface RejectCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  competitionData: { id: string; title: string } | null;
}

export default function RejectCompetitionModal({ isOpen, onClose, competitionData }: RejectCompetitionModalProps) {
  if (!isOpen || !competitionData) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[560px] bg-surface border border-border rounded-card shadow-card z-50 animate-fadeIn flex flex-col p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-black text-xl text-text-primary uppercase tracking-tight">
            Reason for Rejection
          </h2>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Subtitle */}
        <div className="flex items-center gap-1.5 mb-5 bg-elevated border border-border-medium rounded-xl p-3.5">
          <span className="font-sans font-bold text-xs text-text-muted">Rejecting Competition:</span>
          <span className="font-heading font-bold text-xs text-text-primary truncate">{competitionData.title}</span>
        </div>

        {/* Textarea */}
        <div className="w-full mb-6">
          <textarea 
            rows={5}
            placeholder="Describe the issue and what the host should change before resubmitting..."
            className="w-full bg-elevated border border-border-medium rounded-xl p-4 text-text-primary font-sans text-xs placeholder:text-text-muted outline-none focus:border-primary resize-none transition-colors"
          />
        </div>

        {/* Button */}
        <button 
          onClick={onClose}
          className="btn-glossy-red w-full h-11 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center"
        >
          Send Feedback & Request Changes
        </button>

      </div>
    </>
  );
}
