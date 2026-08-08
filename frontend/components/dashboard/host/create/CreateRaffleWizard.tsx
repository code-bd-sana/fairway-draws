"use client";

import React, { useState } from "react";
import CreateRaffleStepper from "./CreateRaffleStepper";
import CreateRaffleStep1 from "./CreateRaffleStep1";
import CreateRaffleStep2 from "./CreateRaffleStep2";
import CreateRaffleStep3 from "./CreateRaffleStep3";
import CreateRaffleStep4 from "./CreateRaffleStep4";
import CreateRaffleStep5 from "./CreateRaffleStep5";
import CreateRaffleStep6 from "./CreateRaffleStep6";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMySubscription } from "../../../../hooks/useSubscriptionHooks";
import { useCreateRaffle, useUploadRaffleImage } from "../../../../hooks/useRaffleHooks";
import { extractApiError } from "../../../../lib/utils";

export interface RaffleFormData {
  // Step 1
  title: string;
  category: string;
  description: string;
  // Step 2
  mainPrizeValue: string;
  totalTickets: string;
  ticketPrice: string;
  minTickets: string;
  // Step 3
  coverImage: string | null; // URL or mock path
  gallery: string[];
  // Step 4 (Instant Wins)
  hasInstantWins: boolean;
  instantWins: { prizeName: string; imageFile: File | null; imageUrl: string | null; rrpValue: string; }[];
  // Step 5
  startDate: string;
  endDate: string;
  isAutoDraw: boolean;
  autoDrawDate: boolean;
  autoDrawSoldOut: boolean;
}

const initialData: RaffleFormData = {
  title: "",
  category: "Golf Drivers",
  description: "",
  mainPrizeValue: "",
  totalTickets: "",
  ticketPrice: "",
  minTickets: "1",
  coverImage: null,
  gallery: [],
  hasInstantWins: false,
  instantWins: [],
  startDate: "",
  endDate: "",
  isAutoDraw: true,
  autoDrawDate: true,
  autoDrawSoldOut: false,
};

export default function CreateRaffleWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RaffleFormData>(initialData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { data: mySub, isLoading: isSubLoading } = useMySubscription();
  const createRaffle = useCreateRaffle();
  const uploadImage = useUploadRaffleImage();

  const updateForm = (data: Partial<RaffleFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, 6));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));
  
  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      // 1. Upload instant win images first
      const processedInstantWins = [];
      for (const iw of formData.instantWins) {
        const numericRrp = iw.rrpValue ? Number(iw.rrpValue) : undefined;
        if (iw.imageFile) {
          const res = await fetch('/api/v1/raffles/image', {
            method: 'POST',
            body: (() => {
              const fd = new FormData();
              fd.append('file', iw.imageFile);
              return fd;
            })(),
            headers: {
              Authorization: `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            processedInstantWins.push({ prizeName: iw.prizeName, image: data.url, rrpValue: numericRrp });
          } else {
            processedInstantWins.push({ prizeName: iw.prizeName, image: iw.imageUrl, rrpValue: numericRrp });
          }
        } else {
          processedInstantWins.push({ prizeName: iw.prizeName, image: iw.imageUrl, rrpValue: numericRrp });
        }
      }

      // 2. Create Raffle
      const created = await createRaffle.mutateAsync({
        title: formData.title,
        description: formData.description,
        mainPrizeValue: formData.mainPrizeValue ? Number(formData.mainPrizeValue) : undefined,
        pricePerTicket: Number(formData.ticketPrice) || 0,
        totalTickets: Number(formData.totalTickets) || 0,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isAutoDraw: formData.isAutoDraw,
        autoDrawDate: formData.autoDrawDate,
        autoDrawSoldOut: formData.autoDrawSoldOut,
        instantWins: formData.hasInstantWins ? processedInstantWins : [],
      });

      // 3. Upload main image if exists
      if (imageFile && created.id) {
        await uploadImage.mutateAsync({ id: created.id, file: imageFile });
      }

      toast.success("Competition Created and Pending Approval!");
      router.push("/dashboard/host/competitions");
    } catch (err: any) {
      toast.error(extractApiError(err, "Failed to create competition"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubLoading) {
    return (
      <div className="w-full bg-surface border border-border rounded-card min-h-[400px] flex flex-col items-center justify-center p-8 shadow-card">
        <div className="relative flex items-center justify-center w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-border-medium opacity-30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin" style={{ animationDuration: '0.8s' }}></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse shadow-md"></div>
        </div>
        <h3 className="text-text-brand text-lg font-heading font-black uppercase tracking-tight mb-2">Verifying Host Subscription</h3>
        <p className="text-text-muted text-xs max-w-[280px] text-center font-sans">
          Please wait a moment while we check your active host privileges...
        </p>
      </div>
    );
  }

  if (!mySub || mySub.status !== 'ACTIVE') {
    return (
      <div className="w-full bg-surface border border-border rounded-card p-8 text-center shadow-card">
        <h2 className="text-[#DC2626] font-heading font-black text-xl mb-3 uppercase tracking-tight">Active Subscription Required</h2>
        <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">You must have an active host plan to create competitions on Fairway Draws.</p>
        <button 
          onClick={() => router.push('/dashboard/host/billing')} 
          className="btn-glossy-red px-6 py-2.5 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
        >
          View Host Plans
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full px-2 sm:px-4">
        <CreateRaffleStepper currentStep={currentStep} totalSteps={6} />
      </div>

      <div className="w-full bg-surface border border-border rounded-card p-6 md:p-10 mt-2 shadow-card">
        {currentStep === 1 && (
          <CreateRaffleStep1 formData={formData} updateForm={updateForm} onNext={nextStep} />
        )}
        {currentStep === 2 && (
          <CreateRaffleStep2 formData={formData} updateForm={updateForm} onNext={nextStep} onPrev={prevStep} />
        )}
        {currentStep === 3 && (
          <CreateRaffleStep3 formData={formData} updateForm={updateForm} onNext={nextStep} onPrev={prevStep} setImageFile={setImageFile} />
        )}
        {currentStep === 4 && (
          <CreateRaffleStep4 formData={formData} updateForm={updateForm} onNext={nextStep} onPrev={prevStep} />
        )}
        {currentStep === 5 && (
          <CreateRaffleStep5 formData={formData} updateForm={updateForm} onNext={nextStep} onPrev={prevStep} />
        )}
        {currentStep === 6 && (
          <CreateRaffleStep6 formData={formData} onPublish={handlePublish} onPrev={prevStep} isSubmitting={isSubmitting} />
        )}
      </div>
    </div>
  );
}
