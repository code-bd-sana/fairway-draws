import React from "react";
import { RaffleFormData } from "./CreateRaffleWizard";
import { cn } from "../../../../lib/utils";

interface Props {
  formData: RaffleFormData;
  updateForm: (data: Partial<RaffleFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function CreateRaffleStep5({ formData, updateForm, onNext, onPrev }: Props) {
  return (
    <div className="flex flex-col w-full animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="font-heading font-black text-2xl text-text-primary uppercase tracking-tight">
          Schedule &amp; Rules
        </h2>
        <p className="font-sans text-sm text-text-muted">
          Determine when your competition goes live and how the winner will be drawn.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div className="flex flex-col gap-2">
            <label className="font-sans font-bold text-xs uppercase tracking-wider text-text-muted">
              Start Date &amp; Time
            </label>
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => updateForm({ startDate: e.target.value })}
              className="h-[48px] px-4 bg-elevated border border-border-medium rounded-xl font-sans font-medium text-sm text-text-primary outline-none focus:border-primary focus:bg-surface transition-all [color-scheme:light]"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-2">
            <label className="font-sans font-bold text-xs uppercase tracking-wider text-text-muted">
              Draw Date &amp; Time
            </label>
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => updateForm({ endDate: e.target.value })}
              className="h-[48px] px-4 bg-elevated border border-border-medium rounded-xl font-sans font-medium text-sm text-text-primary outline-none focus:border-primary focus:bg-surface transition-all [color-scheme:light]"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-4 mt-2">
          {/* Draw Strategy: Manual vs Auto */}
          <div className="flex flex-col gap-4 p-5 bg-elevated border border-border-medium rounded-xl shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide">
                  Draw Mechanism
                </span>
                <span className="font-sans text-xs text-text-muted">
                  How will the competition winner be selected?
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-1 pt-4 border-t border-divider">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="radio"
                  name="drawType"
                  checked={!formData.isAutoDraw}
                  onChange={() => updateForm({ isAutoDraw: false, autoDrawDate: false, autoDrawSoldOut: false })}
                  className="mt-0.5 w-4 h-4 text-primary focus:ring-primary accent-[#0b4d35] cursor-pointer"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-heading font-bold text-sm text-text-primary uppercase">
                    Live Draw
                  </span>
                  <span className="font-sans text-xs text-text-muted">
                    You will manually trigger the draw from your dashboard (e.g., live streaming on social media).
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="radio"
                  name="drawType"
                  checked={formData.isAutoDraw}
                  onChange={() => updateForm({ isAutoDraw: true, autoDrawDate: true, autoDrawSoldOut: true })}
                  className="mt-0.5 w-4 h-4 text-primary focus:ring-primary accent-[#0b4d35] cursor-pointer"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-heading font-bold text-sm text-text-primary uppercase">
                    Automatic Draw
                  </span>
                  <span className="font-sans text-xs text-text-muted">
                    System automatically draws a winner when tickets sell out or the end timer expires.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-divider">
        <button
          onClick={onPrev}
          className="h-[46px] px-6 bg-elevated border border-border hover:bg-surface text-text-primary transition-all rounded-xl font-heading font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!formData.startDate || !formData.endDate}
          className="btn-glossy-red h-[46px] px-8 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Next Step →</span>
        </button>
      </div>
    </div>
  );
}
