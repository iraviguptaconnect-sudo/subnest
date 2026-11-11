import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export const MsmeTrust: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 mb-14">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg group hover:border-primary/40 transition-colors">
        
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: MSME Seal & Details */}
        <div className="flex items-center gap-4 relative z-10 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 p-1 rounded-xl bg-background/60 border border-border flex items-center justify-center">
            <img
              src="/subsplit-assets/msme-seal-DH0VP8vX.png"
              alt="MSME Udyam Verified"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                MSME Verified · Udyam Registered
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                Trusted
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Govt. of India MSME · Registered & Verified Reseller Entity
            </p>
          </div>
        </div>

        {/* Right Side: Verify Link */}
        <a
          href="https://udyamregistration.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        >
          <span>Verify on Govt Portal</span>
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
        </a>

      </div>
    </section>
  );
};

