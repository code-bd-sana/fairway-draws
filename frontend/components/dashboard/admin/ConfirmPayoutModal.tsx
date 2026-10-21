"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useUpdateWithdrawalStatusMutation } from "../../../hooks/useAdminHooks";

export interface AdminPayoutData {
  id: string;
  hostId: string;
  hostBusinessName: string;
  hostUserEmail: string;
  hostUserName: string;
  amount: number; // Gross amount requested
  feeAmount: number; // 15% platform fee
  netAmount: number; // 85% net payout
  status: string;
  payoutMethod: string;
  payoutDetails: any;
  adminNotes?: string;
  createdAt: string;
}

interface ConfirmPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  payout: AdminPayoutData | null;
  actionType: "APPROVE" | "REJECT" | "VIEW";
}

export default function ConfirmPayoutModal({
  isOpen,
  onClose,
  payout,
  actionType,
}: ConfirmPayoutModalProps) {
  const [mounted, setMounted] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const updateStatusMutation = useUpdateWithdrawalStatusMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (payout) {
      setAdminNotes(payout.adminNotes || "");
      setIsEditingNote(false);
    }
  }, [payout, isOpen]);

  if (!isOpen || !payout || !mounted) return null;

  const grossAmount = payout.amount || 0;
  const feeAmount = payout.feeAmount !== undefined ? payout.feeAmount : grossAmount * 0.15;
  const netAmount = payout.netAmount !== undefined ? payout.netAmount : grossAmount - feeAmount;
  const feePercent = grossAmount > 0 && payout.feeAmount !== undefined
    ? Math.round((payout.feeAmount / grossAmount) * 100)
    : 15;

  const handleConfirm = (newStatus: "APPROVED" | "COMPLETED" | "REJECTED") => {
    updateStatusMutation.mutate(
      {
        id: payout.id,
        status: newStatus,
        adminNotes: adminNotes.trim() || undefined,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleSaveNoteOnly = () => {
    updateStatusMutation.mutate(
      {
        id: payout.id,
        adminNotes: adminNotes.trim(),
      },
      {
        onSuccess: () => {
          setIsEditingNote(false);
        },
      }
    );
  };

  const renderPayoutAccountInfo = () => {
    const details = payout.payoutDetails || {};
    if (payout.payoutMethod === "PAYPAL") {
      return (
        <div>
          <span className="font-sans font-bold text-xs text-text-muted block">PayPal Account Email:</span>
          <span className="font-sans font-bold text-xs text-text-primary">{details.paypalEmail || "Not provided"}</span>
        </div>
      );
    }
    return (
      <div className="space-y-1 font-sans">
        <div className="flex justify-between">
          <span className="text-xs font-bold text-text-muted">Account Holder:</span>
          <span className="text-xs font-bold text-text-primary">{details.accountHolderName || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs font-bold text-text-muted">Bank Name:</span>
          <span className="text-xs font-bold text-text-primary">{details.bankName || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs font-bold text-text-muted">Account Number / IBAN:</span>
          <span className="text-xs font-bold text-text-primary">{details.accountNumber || "N/A"}</span>
        </div>
        {details.sortCode && (
          <div className="flex justify-between">
            <span className="text-xs font-bold text-text-muted">Sort Code / Routing:</span>
            <span className="text-xs font-bold text-text-primary">{details.sortCode}</span>
          </div>
        )}
      </div>
    );
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="relative w-[90%] max-w-[540px] bg-surface border border-border rounded-card shadow-card z-[10000] animate-fadeIn flex flex-col p-6 lg:p-8 max-h-[90vh] overflow-y-auto font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-divider">
          <div>
            <h2 className="font-heading font-black text-xl text-text-primary uppercase tracking-tight">
              {actionType === "APPROVE" ? "Confirm Payout Approval" : actionType === "REJECT" ? "Reject Withdrawal Request" : "Payout Details"}
            </h2>
            <p className="font-sans text-xs text-text-muted">
              Request ID: {payout.id.substring(0, 13)}...
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Host Info */}
        <div className="bg-elevated border border-border-medium rounded-xl p-4 mb-4 space-y-0.5">
          <span className="font-sans font-bold text-[10px] text-text-muted uppercase tracking-wider block">Host Business Operator</span>
          <div className="flex justify-between items-center">
            <span className="font-heading font-bold text-sm text-text-primary">{payout.hostBusinessName}</span>
            <span className="font-sans font-semibold text-xs text-text-brand">{payout.hostUserEmail}</span>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-elevated border border-border-medium rounded-xl p-4 mb-4 space-y-2">
          <span className="font-sans font-bold text-[10px] text-text-muted uppercase tracking-wider block">Financial & Commission Breakdown</span>
          
          <div className="flex justify-between text-xs font-sans">
            <span className="text-text-muted font-bold">Gross Requested Amount:</span>
            <span className="font-bold text-text-primary">£{grossAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-xs font-sans text-[#DC2626]">
            <span className="font-bold">Platform Commission ({feePercent}%):</span>
            <span className="font-bold">-£{feeAmount.toFixed(2)}</span>
          </div>

          <div className="pt-2 border-t border-border-medium flex justify-between text-xs font-bold font-sans">
            <span className="text-text-brand">Net Payout Sent to Host:</span>
            <span className="text-text-brand font-black text-sm">£{netAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Account Details */}
        <div className="bg-elevated border border-border-medium rounded-xl p-4 mb-5">
          <span className="font-sans font-bold text-[10px] text-text-muted uppercase tracking-wider block mb-2">
            Payment Method: {payout.payoutMethod || 'Bank Transfer'}
          </span>
          {renderPayoutAccountInfo()}
        </div>

        {/* Admin Notes Section */}
        {actionType === "VIEW" ? (
          <div className="bg-elevated border border-border-medium rounded-xl p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans font-bold text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                Admin Notes / Accounting Reference
              </span>
              {!isEditingNote && (
                <button
                  type="button"
                  onClick={() => setIsEditingNote(true)}
                  className="text-[11px] font-bold text-text-brand hover:underline cursor-pointer flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  {payout.adminNotes ? "Edit Note" : "Add Note"}
                </button>
              )}
            </div>

            {isEditingNote ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Enter accounting transaction ID, bank reference, or payment note..."
                  rows={3}
                  className="w-full p-3 bg-surface border border-border rounded-xl text-xs text-text-primary focus:border-primary outline-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminNotes(payout.adminNotes || "");
                      setIsEditingNote(false);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-text-muted hover:text-text-primary cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNoteOnly}
                    disabled={updateStatusMutation.isPending}
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    {updateStatusMutation.isPending ? "Saving..." : "Save Note"}
                  </button>
                </div>
              </div>
            ) : payout.adminNotes ? (
              <div className="bg-surface border border-border rounded-lg p-3 text-xs text-text-primary whitespace-pre-wrap font-sans">
                {payout.adminNotes}
              </div>
            ) : (
              <p className="font-sans text-xs text-text-muted italic">
                No admin notes or reference recorded yet.
              </p>
            )}
          </div>
        ) : (
          <div className="mb-6 flex flex-col gap-1.5">
            <label className="block font-sans text-xs font-bold text-text-muted">
              Admin Notes / Accounting Reference (Optional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Bank transfer transaction ref #12345 or reason for rejection"
              rows={2}
              className="w-full p-3 bg-elevated border border-border-medium rounded-xl text-xs text-text-primary focus:border-primary outline-none"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-border bg-surface hover:bg-elevated text-xs font-heading font-bold text-text-primary uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            Close
          </button>

          {actionType === "APPROVE" && (
            <button 
              onClick={() => handleConfirm("APPROVED")}
              disabled={updateStatusMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {updateStatusMutation.isPending ? "Processing Payout..." : `Approve & Transfer £${netAmount.toFixed(2)}`}
            </button>
          )}

          {actionType === "REJECT" && (
            <button 
              onClick={() => handleConfirm("REJECTED")}
              disabled={updateStatusMutation.isPending}
              className="btn-glossy-red px-6 py-2.5 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {updateStatusMutation.isPending ? "Processing Rejection..." : "Reject & Refund Host Wallet"}
            </button>
          )}
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
