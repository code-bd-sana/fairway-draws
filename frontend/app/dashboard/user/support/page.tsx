import React from "react";

export default function UserSupportPage() {
  return (
    <div className="p-6 lg:p-8 max-w-[1660px] mx-auto w-full flex flex-col gap-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading font-black text-2xl lg:text-3xl text-text-primary uppercase tracking-tight">
          Help &amp; Support Center
        </h1>
        <p className="font-sans text-xs text-text-muted">
          Need assistance with a ticket order or prize claim? Submit a support ticket to our team.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
        
        {/* Left Column: Raise a Support Ticket */}
        <div className="flex-1 bg-surface border border-border rounded-card p-6 lg:p-8 flex flex-col gap-6 shadow-card w-full">
          <h2 className="font-heading font-black text-lg text-text-primary uppercase tracking-tight">
            Submit a Support Ticket
          </h2>

          <form className="flex flex-col gap-5">
            {/* Subject Field */}
            <div className="flex flex-col gap-2">
              <label className="font-sans font-bold text-[11px] text-text-muted uppercase tracking-wider">
                Subject Title
              </label>
              <input 
                type="text" 
                placeholder="Brief summary of your request"
                className="w-full h-11 bg-elevated border border-border-medium rounded-xl px-4 text-sm text-text-primary font-sans focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Related Order ID Field */}
            <div className="flex flex-col gap-2">
              <label className="font-sans font-bold text-[11px] text-text-muted uppercase tracking-wider">
                Related Transaction / Order Reference (Optional)
              </label>
              <input 
                type="text" 
                placeholder="e.g. #TRN-8821"
                className="w-full h-11 bg-elevated border border-border-medium rounded-xl px-4 text-sm text-text-primary font-sans placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Message Field */}
            <div className="flex flex-col gap-2">
              <label className="font-sans font-bold text-[11px] text-text-muted uppercase tracking-wider">
                Detailed Message
              </label>
              <textarea 
                placeholder="Describe your issue or question in detail..."
                className="w-full h-[180px] bg-elevated border border-border-medium rounded-xl p-4 text-sm text-text-primary font-sans placeholder:text-text-muted focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="button" 
              className="btn-glossy-red w-full h-[46px] text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-98 cursor-pointer mt-2"
            >
              Submit Support Ticket
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>
        </div>

        {/* Right Column: Support Tickets & Quick Answers */}
        <div className="w-full lg:w-[480px] flex flex-col gap-6 shrink-0">
          
          {/* My Support Tickets */}
          <div className="bg-surface border border-border rounded-card p-6 flex flex-col gap-5 shadow-card">
            <h2 className="font-heading font-black text-lg text-text-primary uppercase tracking-tight">
              My Active Support Tickets
            </h2>
            <div className="flex flex-col gap-4">
              
              {/* Ticket 1 */}
              <div className="flex items-start justify-between pb-4 border-b border-divider">
                <div className="flex flex-col gap-1">
                  <span className="font-heading font-bold text-sm text-text-primary">Payment processing query</span>
                  <span className="font-sans font-semibold text-xs text-text-muted">18 Jun 2025</span>
                </div>
                <div className="px-3 py-1 rounded-full border border-[#FDE68A] bg-[#FEF3C7]">
                  <span className="font-sans font-bold text-[10px] text-[#D97706] uppercase tracking-wider">Open</span>
                </div>
              </div>

              {/* Ticket 2 */}
              <div className="flex items-start justify-between pb-4 border-b border-divider">
                <div className="flex flex-col gap-1">
                  <span className="font-heading font-bold text-sm text-text-primary">Ticket entry confirmation</span>
                  <span className="font-sans font-semibold text-xs text-text-muted">10 Jun 2025</span>
                </div>
                <div className="px-3 py-1 rounded-full border border-[#BBF7D0] bg-[#DCFCE7]">
                  <span className="font-sans font-bold text-[10px] text-[#15803D] uppercase tracking-wider">Resolved</span>
                </div>
              </div>

              {/* Ticket 3 */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-heading font-bold text-sm text-text-primary">Account email verification</span>
                  <span className="font-sans font-semibold text-xs text-text-muted">02 Jun 2025</span>
                </div>
                <div className="px-3 py-1 rounded-full border border-border-medium bg-elevated">
                  <span className="font-sans font-bold text-[10px] text-text-muted uppercase tracking-wider">Closed</span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Answers */}
          <div className="bg-surface border border-border rounded-card p-6 flex flex-col gap-5 shadow-card">
            <h2 className="font-heading font-black text-lg text-text-primary uppercase tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col">
              
              {["How do I claim my prize?", "Can I get a refund on tickets?", "How are live winners selected?"].map((question, index) => (
                <button 
                  key={index}
                  className={`w-full flex items-center justify-between py-3.5 group cursor-pointer ${index !== 2 ? 'border-b border-divider' : ''}`}
                >
                  <span className="font-sans font-bold text-xs text-text-muted group-hover:text-text-primary transition-colors">
                    {question}
                  </span>
                  <svg className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
