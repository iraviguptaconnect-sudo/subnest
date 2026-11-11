import React from 'react';
import { Star, Check, ArrowDown, Sparkles } from 'lucide-react';

interface HeroProps {
  onViewPlans: () => void;
  onOpenCombo: () => void;
  onOpenReviews: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onViewPlans,
  onOpenCombo,
  onOpenReviews,
}) => {
  return (
    <section className="relative pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 text-center max-w-4xl mx-auto flex flex-col justify-center">
      
      {/* Background ambient radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-36 rounded-full blur-3xl opacity-40 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.3),hsl(var(--ambient-blue)/0.12),transparent_75%)] pointer-events-none" />

      {/* Pill Badge: Trusted by 10,000+ Indians */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border backdrop-blur-md mb-6 sm:mb-8 mx-auto shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
        </span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Trusted by 10,000+ Indians
        </span>
      </div>

      {/* Main H1 Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold text-foreground mb-6 leading-[1.1] tracking-tight">
        Everything
        <span className="text-muted-foreground block mt-1">
          You Love in <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-bold">One Nest.</span>
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8 font-normal leading-relaxed">
        Instant access to premium OTT & digital tool subscriptions. From ₹49/month — affordable, reliable, delivered directly on WhatsApp.
      </p>

      {/* Social Proof Pill Button */}
      <button
        onClick={onOpenReviews}
        className="group mx-auto mb-8 sm:mb-10 h-auto min-h-11 inline-flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-card border border-border hover:border-foreground/25 shadow-sm backdrop-blur-xl transition-colors duration-200"
      >
        <div className="flex -space-x-1.5 overflow-hidden">
          <div className="w-6 h-6 rounded-full bg-violet-600/90 border border-background flex items-center justify-center text-[10px] font-bold text-white">R</div>
          <div className="w-6 h-6 rounded-full bg-indigo-600/90 border border-background flex items-center justify-center text-[10px] font-bold text-white">A</div>
          <div className="w-6 h-6 rounded-full bg-blue-600/90 border border-background flex items-center justify-center text-[10px] font-bold text-white">S</div>
          <div className="w-6 h-6 rounded-full bg-cyan-600/90 border border-background flex items-center justify-center text-[10px] font-bold text-white">M</div>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div className="flex text-amber-400 fill-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-bold text-foreground ml-1">4.9</span>
          <span className="text-muted-foreground">· 2,400+ verified reviews</span>
          <span className="text-primary font-medium ml-1 group-hover:underline">See Reviews →</span>
        </div>
      </button>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
        <button
          onClick={onViewPlans}
          className="w-full sm:w-auto h-12 px-8 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
        >
          <span>View Plans</span>
          <ArrowDown className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenCombo}
          className="w-full sm:w-auto h-12 px-8 bg-card hover:bg-secondary border border-border text-foreground font-medium rounded-full flex items-center justify-center gap-2 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Build Custom Combo</span>
        </button>
      </div>

      {/* Trust Bullet List */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-muted-foreground font-medium">
        <span className="flex items-center gap-1.5 text-foreground/80">
          <Check className="w-3.5 h-3.5 text-success" />
          Instant delivery
        </span>
        <span className="flex items-center gap-1.5 text-foreground/80">
          <Check className="w-3.5 h-3.5 text-success" />
          Secure payments
        </span>
        <span className="flex items-center gap-1.5 text-foreground/80">
          <Check className="w-3.5 h-3.5 text-success" />
          MSME verified
        </span>
        <span className="flex items-center gap-1.5 text-foreground/80">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          24/7 support
        </span>
      </div>

    </section>
  );
};

