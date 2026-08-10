"use client";

import React from "react";

export interface HostApplicationData {
  id: string;
  brandName: string;
  email: string;
  bio: string;
  contact: string;
  payoutMethod: string;
  social: string;
  isVerified?: boolean;
}

interface ReviewHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: HostApplicationData | null;
  onApprove?: (hostId: string) => void;
  isApproveLoading?: boolean;
  onReject?: (hostId: string) => void;
  isRejectLoading?: boolean;
}

export default function ReviewHostModal({ 
  isOpen, 
  onClose, 
  data, 
  onApprove, 
  isApproveLoading,
  onReject,
  isRejectLoading
}: ReviewHostModalProps) {
  if (!isOpen || !data) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[560px] bg-surface border border-border rounded-card shadow-card z-50 animate-fadeIn flex flex-col p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-black text-xl text-text-primary uppercase tracking-tight">
            Host Application Details
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

        {/* Content Details */}
        <div className="flex flex-col gap-3.5 font-sans text-xs bg-elevated border border-border-medium rounded-xl p-5 mb-6">
          
          <div className="flex items-center justify-between">
            <span className="font-bold text-text-muted">Brand Name</span>
            <span className="font-heading font-bold text-sm text-text-primary">{data.brandName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-text-muted">Email Address</span>
            <span className="font-semibold text-text-primary">{data.email}</span>
          </div>

          <div className="flex items-start justify-between">
            <span className="font-bold text-text-muted">Business Bio</span>
            <span className="font-semibold text-text-primary text-right max-w-[300px] line-clamp-3">{data.bio}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-text-muted">Contact Info</span>
            <span className="font-semibold text-text-primary">{data.contact}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-text-muted">Payout Method</span>
            <span className="font-semibold text-text-primary">{data.payoutMethod}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-text-muted">Social Handles</span>
            <span className="font-semibold text-text-primary">{data.social}</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          {!data.isVerified && onApprove && (
            <button 
              onClick={() => onApprove(data.id)}
              disabled={isApproveLoading || isRejectLoading}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              {isApproveLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Approve Host Merchant"
              )}
            </button>
          )}
          {!data.isVerified && onReject && (
            <button 
              onClick={() => onReject(data.id)}
              disabled={isApproveLoading || isRejectLoading}
              className="btn-glossy-red w-full h-11 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              {isRejectLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Reject Application"
              )}
            </button>
          )}
          <button 
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-surface border border-border hover:bg-elevated text-text-primary font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
          >
            Close Details
          </button>
        </div>

      </div>
    </>
  );
}
