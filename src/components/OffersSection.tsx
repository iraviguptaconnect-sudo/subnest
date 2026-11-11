import React from 'react';
import { Gift, MessageCircle, Sparkles } from 'lucide-react';

export const OffersSection: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-background">
      
      {/* Background Red Ambient Glow (Exact subsplit pulse-red) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[350px] sm:h-[450px] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse-red pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/30 rounded-full blur-[80px] opacity-30 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 animate-fade-in-up">
          <Gift className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">Exclusive Community</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4 leading-tight">
          Get Free Subscriptions &{' '}
          <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent block sm:inline">
            Exclusive Offers
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
          Join our VIP community to get flash giveaways, limited-time OTT drops, combo codes & priority customer support instantly.
        </p>

        {/* Join Community CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://wa.me/919347610989?text=Hello%20Subnest,%20I%20want%20to%20join%20the%20VIP%20Deals%20Community."
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xl shadow-primary/30"
          >
            <MessageCircle className="w-4 h-4 fill-primary-foreground" />
            <span>Join WhatsApp VIP Deals</span>
          </a>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          No spam. Only genuine reseller deals.
        </p>

      </div>
    </section>
  );
};

