"use client";

import React, { useState } from "react";
import InputField from "../shared/InputField";
import { cn } from "../../../lib/utils";

export default function EarlyAccessForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "HOST">("CUSTOMER");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setNameError(""); setEmailError(""); setGeneralError("");
    if (!fullName.trim()) return setNameError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setEmailError("Please enter a valid email.");
    setIsSubmitting(true);
    try { const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: fullName.trim(), email: email.trim(), role }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error || "Something went wrong."); setIsSuccess(true); setFullName(""); setEmail(""); }
    catch (error) { setGeneralError(error instanceof Error ? error.message : "Unable to join right now. Please try again."); }
    finally { setIsSubmitting(false); }
  };

  if (isSuccess) return <div className="mx-auto w-full max-w-lg rounded-[24px] border border-white/50 bg-white p-10 text-center shadow-2xl"><div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#f0dcff] to-[#d5f5ff] text-3xl">♥</div><h3 className="text-3xl font-black text-[#5c20b5]">Welcome to the movement!</h3><p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#674c83]">You&apos;re on the Charity Draws waitlist. We&apos;ll send the good news straight to your inbox.</p><button type="button" onClick={() => setIsSuccess(false)} className="mt-7 text-xs font-black uppercase tracking-wider text-[#6425c0] hover:text-[#0aa9e7]">← Register another email</button></div>;

  return <div className="mx-auto w-full max-w-lg rounded-[24px] border border-white/50 bg-white p-7 shadow-2xl sm:p-9">
    <div className="mb-6 text-center"><span className="inline-block rounded-full bg-[#f0e4ff] px-3 py-1 text-[10px] font-black tracking-widest text-[#6829c7] uppercase">Free founding access</span><h3 className="mt-3 text-3xl font-black tracking-[-.045em] text-[#5920af]">Join the good stuff.</h3><p className="mt-2 text-sm text-[#71518f]">Tell us where you&apos;ll make an impact.</p></div>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 [&_input]:border-[#b58ae5] [&_input]:bg-[#fcfaff] [&_input]:text-[#51229e] [&_input:focus]:border-[#7532cd] [&_input:focus]:ring-[#7532cd]/20 [&_label]:font-bold [&_label]:text-[#5b357b]">
      {generalError && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-semibold text-red-700">⚠ {generalError}</div>}
      <InputField label="Full name" id="fullName" name="fullName" placeholder="e.g. Alex Morgan" value={fullName} onChange={(e) => { setFullName(e.target.value); setNameError(""); }} error={nameError} disabled={isSubmitting} required />
      <InputField label="Email address" id="email" name="email" type="email" placeholder="alex@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(""); }} error={emailError} disabled={isSubmitting} required />
      <div><label className="text-xs font-black tracking-wider text-[#5b357b] uppercase">I&apos;m here to:</label><div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-[#f5eeff] p-1.5">{(["CUSTOMER", "HOST"] as const).map((item) => <button key={item} type="button" onClick={() => setRole(item)} className={cn("rounded-xl px-2 py-3 text-[10px] font-black transition-all sm:text-xs", role === item ? "bg-gradient-to-r from-[#6726c6] to-[#129fe3] text-white shadow-md" : "text-[#71518f] hover:text-[#6927c4]")}>{item === "CUSTOMER" ? "♥ Support a cause" : "✦ Represent a charity"}</button>)}</div></div>
      <button type="submit" disabled={isSubmitting} className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6827c8] to-[#12aeea] py-4 text-sm font-black tracking-[.12em] text-white uppercase shadow-lg transition hover:brightness-110 disabled:opacity-60">{isSubmitting ? "Joining…" : <>Join the waitlist <span className="text-lg">→</span></>}</button>
      <p className="text-center text-[10px] font-semibold text-[#71518f]">🔒 100% private &nbsp; · &nbsp; ✓ Zero spam &nbsp; · &nbsp; ♥ Meaningful impact</p>
    </form>
  </div>;
}
