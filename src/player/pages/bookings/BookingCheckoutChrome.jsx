import { ArrowRight, Check, ChevronLeft, Loader2, Lock } from 'lucide-react';

/** Stable checkout chrome kept outside the stateful checkout page to reduce its render surface. */
export function CheckoutProgress({ currentStep, steps, onBack, updateStep, formattedTimer }) {
  if (currentStep >= 4) return null;
  return (
    <div className="sticky top-[var(--nav-h,72px)] z-30 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-20 py-6">
        <div className="flex items-center justify-between gap-2 max-w-3xl mx-auto">
          {steps.map((step, idx) => {
            const isDone = currentStep > step.id;
            const isActive = currentStep === step.id;
            return <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div onClick={() => { if (step.id === 0) onBack?.(); else if (step.id < currentStep) updateStep(step.id); }} className={`flex items-center gap-3 transition-all ${step.id <= currentStep ? 'cursor-pointer' : 'cursor-default'}`}>
                <div className={`flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full font-black text-xs md:text-sm transition-all shadow-xs ${isDone ? 'bg-lime-400 text-slate-950' : isActive ? 'bg-lime-400 text-slate-950 ring-4 ring-lime-100' : 'bg-slate-100 text-slate-400'}`}>
                  {isDone ? <Check className="h-4 w-4 stroke-[3]" /> : step.id}
                </div>
                <div className="hidden sm:block text-left">
                  <p className={`text-xs md:text-sm font-bold leading-none ${isActive ? 'text-slate-900 font-extrabold' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>{step.title}</p>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">{step.subtitle}</p>
                </div>
              </div>
              {idx < steps.length - 1 && <div className="flex-1 mx-2 md:mx-4 h-1 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full transition-all duration-500 ${currentStep > step.id ? 'bg-lime-400 w-full' : 'bg-transparent w-0'}`} /></div>}
            </div>;
          })}
        </div>
      </div>
      <div className="bg-lime-50/90 px-6 md:px-14 lg:px-20 py-2.5">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between text-xs sm:text-sm text-slate-700">
          <div className="flex items-center gap-2"><span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"/><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-500"/></span><span className="font-semibold text-slate-800">Your slot is reserved for <span className="font-black text-slate-950 font-mono tracking-tight text-sm bg-white px-2.5 py-0.5 rounded-md shadow-2xs">{formattedTimer}</span> minutes</span></div>
          <span className="hidden md:inline font-medium text-slate-600">Guaranteed slot hold • Complete checkout to secure the pitch</span>
        </div>
      </div>
    </div>
  );
}

export function CheckoutActionBar({ currentStep, handleBack, handleNext, venueTitle, selectedDateStr, totalAmount, depositAmount, formData, isProcessingPayment }) {
  if (currentStep >= 4) return null;
  return <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.06)] p-3.5 sm:p-4"><div className="mx-auto max-w-[1440px] px-4 md:px-14 lg:px-20 flex items-center justify-between gap-4">
    <button type="button" onClick={handleBack} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 transition-all active:scale-95 cursor-pointer shadow-2xs"><ChevronLeft className="h-4 w-4"/><span>Back</span></button>
    <div className="hidden sm:flex items-center gap-2.5"><span className="text-sm font-medium text-slate-600">{venueTitle} • {selectedDateStr}</span><span className="text-slate-300">•</span><span className="text-base font-extrabold text-slate-900">NPR {totalAmount.toLocaleString()}</span></div>
    {currentStep === 1 ? <button type="button" onClick={handleNext} className="inline-flex items-center gap-2 rounded-full bg-lime-400 hover:bg-lime-500 px-7 py-3 text-xs sm:text-sm font-black text-slate-950 transition-all active:scale-95 cursor-pointer shadow-xs"><span>Review & Continue to Payment</span><ArrowRight className="h-4 w-4 stroke-[2.5]"/></button> : <button type="button" onClick={handleNext} disabled={!formData.termsAgreed || isProcessingPayment} className="inline-flex items-center gap-2 rounded-full bg-lime-400 hover:bg-lime-500 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-xs sm:text-sm font-black text-slate-950 transition-all active:scale-95 cursor-pointer shadow-xs">{isProcessingPayment ? <><Loader2 className="h-4 w-4 animate-spin"/><span>Redirecting to eSewa...</span></> : <><Lock className="h-4 w-4"/><span>{formData.paymentType === 'venue' ? `Pay NPR ${depositAmount.toLocaleString()} Deposit & Confirm` : `Pay NPR ${totalAmount.toLocaleString()} & Confirm`}</span><ArrowRight className="h-4 w-4 stroke-[2.5]"/></>}</button>}
  </div></div>;
}
