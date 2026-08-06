import React from "react";
import type { Metadata } from "next";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";
import ComingSoonHero from "../../components/website/coming-soon/ComingSoonHero";
import EarlyAccessForm from "../../components/website/coming-soon/EarlyAccessForm";
import InterestBenefits from "../../components/website/coming-soon/InterestBenefits";

export const metadata: Metadata = {
  title: "Fairway Draws | Premier Golf & Luxury Charity Raffles",
  description:
    "Join the official waitlist for Fairway Draws. Win luxury golf equipment, premium club memberships, and exclusive PGA tournament experiences for charity.",
};

/**
 * Public 'Coming Soon' lead registration landing page at `/raffle-coming-soon`.
 * Features Fairway Draws branding, cap visual showcase, waitlist form, and PostgreSQL lead saving.
 */
export default function RaffleComingSoonPage() {
  return (
    <>
      {/* Sticky top navbar */}
      <WebsiteNavbar />

      <main className="min-h-screen flex flex-col bg-[#F8FAF6] pt-24 lg:pt-28 pb-16 relative overflow-hidden">
        {/* Subtle Golf Course Radial Glow Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#0b4d35]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#dc2626]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(11,77,53,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,77,53,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] opacity-100 pointer-events-none" />

        <div className="container-custom flex flex-col items-center gap-6 relative z-10">
          {/* Welcome/Coming Soon Header & Cap Image Showcase */}
          <ComingSoonHero />

          {/* Early Registration Input Form */}
          <EarlyAccessForm />

          {/* Waitlist Perks Benefits Section */}
          <InterestBenefits />
        </div>
      </main>

      {/* Global website footer */}
      <WebsiteFooter />
    </>
  );
}
