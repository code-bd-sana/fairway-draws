"use client";

import React, { useState } from "react";
import InputField from "../shared/InputField";
import PrimaryButton from "../shared/PrimaryButton";
import { cn } from "../../../lib/utils";

/**
 * Early Access Lead Form allowing interested users to register.
 * Saves lead details to PostgreSQL via Prisma and displays instant confirmation.
 */
export default function EarlyAccessForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "HOST">("CUSTOMER");
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [generalError, setGeneralError] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    let isValid = true;
    setNameError("");
    setEmailError("");
    setGeneralError("");

    if (!fullName.trim()) {
      setNameError("Full name is required.");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email address is required.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setGeneralError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          role: role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      setIsSuccess(true);
      setFullName("");
      setEmail("");
      setRole("CUSTOMER");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit. Please try again.";
      setGeneralError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-[#0b4d35]/20 rounded-[20px] p-6 sm:p-8 shadow-xl relative z-10 my-6">
      {isSuccess ? (
        <div className="flex flex-col items-center text-center py-6 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-7 h-7 text-[#0b4d35]"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#0b4d35] mb-2">
            You&apos;re on the VIP List!
          </h3>
          <p className="font-sans text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm mb-4">
            Thank you for joining Fairway Draws. Your early-access pass has been recorded in our official database. Keep an eye on your inbox for launch day tokens!
          </p>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="text-xs font-semibold text-[#0b4d35] hover:text-[#dc2626] underline transition-colors"
          >
            Register another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-center mb-2">
            <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-[#0b4d35] tracking-wide">
              Secure Early Access
            </h3>
            <p className="font-sans text-xs text-text-muted mt-1">
              Join 1,200+ golfers on the official Fairway Draws waitlist.
            </p>
          </div>

          {/* General Error Notice */}
          {generalError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3 text-center font-medium">
              {generalError}
            </div>
          )}

          {/* Full Name Input */}
          <InputField
            label="Full Name"
            id="fullName"
            name="fullName"
            placeholder="e.g. Rory McIlroy"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (nameError) setNameError("");
            }}
            error={nameError}
            disabled={isSubmitting}
            required
          />

          {/* Email Input */}
          <InputField
            label="Email Address"
            id="email"
            name="email"
            type="email"
            placeholder="rory@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            error={emailError}
            disabled={isSubmitting}
            required
          />

          {/* Role Selection */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="font-sans font-semibold text-xs text-text-secondary select-none self-start mb-0.5">
              I want to:
            </label>
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setRole("CUSTOMER")}
                disabled={isSubmitting}
                className={cn(
                  "flex-1 font-sans text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl border text-center transition-all duration-200 cursor-pointer disabled:opacity-50 select-none",
                  role === "CUSTOMER"
                    ? "bg-[#0b4d35] border-[#0b4d35] text-white shadow-md"
                    : "bg-surface border-border text-text-muted hover:text-text-primary hover:border-[#0b4d35]/40"
                )}
              >
                ⛳ Enter Draws (Player)
              </button>
              <button
                type="button"
                onClick={() => setRole("HOST")}
                disabled={isSubmitting}
                className={cn(
                  "flex-1 font-sans text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl border text-center transition-all duration-200 cursor-pointer disabled:opacity-50 select-none",
                  role === "HOST"
                    ? "bg-[#0b4d35] border-[#0b4d35] text-white shadow-md"
                    : "bg-surface border-border text-text-muted hover:text-text-primary hover:border-[#0b4d35]/40"
                )}
              >
                🏆 Host Draws (Club/Host)
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 bg-[#0b4d35] hover:bg-[#073826] text-white font-sans text-sm font-bold tracking-wider uppercase rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Registering...</span>
              </>
            ) : (
              <>
                <span>JOIN VIP WAITLIST</span>
                <span className="text-base leading-none text-[#dc2626] font-bold">&#8594;</span>
              </>
            )}
          </button>

          {/* Trust Text */}
          <p className="font-sans text-[11px] text-text-muted text-center mt-2">
            🔒 Direct database registration. Guaranteed privacy & zero spam.
          </p>
        </form>
      )}
    </div>
  );
}
