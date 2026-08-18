"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PricingPlan, BillingCycle } from "../../../types/pricing.types";
import PrimaryButton from "../shared/PrimaryButton";
import SecondaryButton from "../shared/SecondaryButton";
import { cn } from "../../../lib/utils";
import { useAuthUser } from "../../../hooks/useAuthHooks";
import { useCreateCheckoutSessionMutation } from "../../../hooks/useSubscriptionHooks";
import { SubscriptionPlan } from "../../../services/subscription.service";
import { toast } from "sonner";

interface PricingPlanCardProps {
  plan: PricingPlan;
  billingCycle: BillingCycle;
  dbPlan?: SubscriptionPlan; // Passed from backend if available
}

/**
 * Pricing plan card component matching the Figma layouts.
 * Highlights the Premium plan. Handles pricing calculations.
 */
export default function PricingPlanCard({ plan, billingCycle, dbPlan }: PricingPlanCardProps) {
  const isYearly = billingCycle === "yearly";
  const price = isYearly && plan.yearlyPrice !== undefined ? plan.yearlyPrice : plan.monthlyPrice;
  const router = useRouter();
  const { data: user } = useAuthUser();
  const createCheckout = useCreateCheckoutSessionMutation();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubscribe = () => {
    if (!user) {
      router.push('/host/register');
      return;
    }
    if (user.role !== 'HOST') {
      toast.error('Only Host accounts can activate subscriptions. Please create a Host account.');
      return;
    }

    const targetPlanId = dbPlan?.id || plan.id;
    if (!targetPlanId) {
      toast.error('Subscription plan not found in database.');
      return;
    }

    setLoading(true);
    createCheckout.mutate(targetPlanId, {
      onSuccess: (data: any) => {
        if (data.isFree) {
          toast.success(data.message || 'Free subscription activated!');
          window.location.href = data.url || '/dashboard/host/billing?status=success';
        } else if (data.isTest) {
          setTimeout(() => {
            setLoading(false);
            setShowSuccessModal(true);
          }, 2500); // Simulate network loading
        } else if (data.url) {
          window.location.href = data.url;
        } else {
          setLoading(false);
          toast.error('No checkout URL returned.');
        }
      },
      onError: (err: any) => {
        setLoading(false);
        const msg = err?.response?.data?.message || 'Failed to process subscription.';
        toast.error(msg);
      }
    });
  };

  return (
    <div
      className={cn(
        "relative flex w-full flex-col rounded-[20px] border bg-[#edf5e9] p-8 shadow-[0_14px_32px_rgba(0,0,0,.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(0,0,0,.25)]",
        plan.isFeatured
          ? "border-[#dc2626] ring-1 ring-[#dc2626]/35"
          : "border-[#bdd3ba] hover:border-[#0b4d35]/45"
      )}
    >
      {/* Featured Ribbon Badge */}
      {plan.isFeatured && plan.badgeLabel && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary rounded-full px-4 py-1 shadow-md">
          <span className="font-sans font-bold text-[10px] tracking-wider text-primary-text uppercase">
            {plan.badgeLabel}
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="flex flex-col items-start mb-6">
        <h3 className="font-heading font-bold text-lg text-text-primary uppercase tracking-wide">
          {plan.name}
        </h3>
        
        {/* Price Tag */}
        <div className="flex items-baseline gap-1 mt-3">
          <span className="font-heading font-bold text-4xl text-text-brand select-none">
            £{isYearly ? price * 12 : price}
          </span>
          <span className="font-sans text-xs text-text-muted select-none">
            {price === 0 ? " forever" : isYearly ? " billed yearly" : "/month"}
          </span>
        </div>
        
        {isYearly && plan.monthlyPrice > 0 && (
          <span className="font-sans text-[10px] text-text-secondary mt-1 select-none">
            Equivalent to £{price} per month
          </span>
        )}
      </div>

      {/* Commission Level Label */}
      <div className="inline-flex items-center bg-accent-bg border border-border px-3 py-1.5 rounded-full text-xs font-semibold text-text-brand select-none w-fit mb-6">
        {plan.commissionLabel}
      </div>

      {/* Divider */}
      <div className="h-px bg-divider w-full mb-6" />

      {/* Feature List */}
      <ul className="flex-1 flex flex-col gap-3.5 mb-8">
        {plan.features.map((feature) => (
          <li
            key={feature.id}
            className={cn(
              "flex items-center gap-3 font-sans text-xs md:text-sm transition-all duration-200",
              feature.included ? "text-text-primary" : "text-text-muted/40"
            )}
          >
            {/* Check or Dash SVG icon */}
            {feature.included ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-4 h-4 text-primary shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 text-text-muted/30 shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            )}
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>

      {/* CTA Action Button */}
      <div className="mt-auto">
        {plan.isFeatured ? (
          <PrimaryButton 
            className="w-full py-3 text-sm tracking-wide flex justify-center items-center gap-2" 
            onClick={handleSubscribe} 
            disabled={loading}
          >
            {loading ? 'Processing...' : plan.ctaLabel}
          </PrimaryButton>
        ) : (
          <SecondaryButton 
            className="w-full py-3 text-sm tracking-wide flex justify-center items-center gap-2" 
            onClick={handleSubscribe} 
            disabled={loading}
          >
            {loading ? 'Processing...' : plan.ctaLabel}
          </SecondaryButton>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface border border-border p-8 rounded-[24px] shadow-glow w-[90%] max-w-md flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="font-heading font-bold text-2xl text-text-primary mb-3">Payment Successful</h2>
            <p className="font-sans text-sm text-text-secondary mb-8">Your subscription has been activated successfully.</p>
            <PrimaryButton 
              className="w-full py-3" 
              onClick={() => {
                window.location.href = '/dashboard/host/billing?status=success';
              }}
            >
              Continue to Dashboard
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
