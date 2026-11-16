import React from 'react';
import { Heart, MessageCircle, Phone, Mail, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenTracking: () => void;
  onOpenCombo: () => void;
  onViewPlans: () => void;
  onOpenAdmin?: () => void;
  onOpenReferral?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTracking,
  onOpenCombo,
  onViewPlans,
  onOpenAdmin,
  onOpenReferral,
}) => {
  return (
    <footer className="border-t border-border bg-card/60 pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-center justify-center">
                <img src="/assets/subnest-logo.png" alt="Subnest" className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(124,58,237,0.3)]" />
              </div>
              <span className="text-lg font-black tracking-wide text-foreground">
                Sub<span className="bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">nest</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Affordable OTT & digital tool subscriptions in India. Secure, instant access with full transparency on WhatsApp.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MSME Verified Entity</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Explore</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <button onClick={onViewPlans} className="hover:text-foreground transition-colors">
                  All OTT Plans
                </button>
              </li>
              <li>
                <button onClick={onOpenCombo} className="hover:text-foreground transition-colors">
                  OTT Combo Builder (20% Off)
                </button>
              </li>
              <li>
                <button onClick={onOpenTracking} className="hover:text-foreground transition-colors">
                  Track Your Order
                </button>
              </li>
              {onOpenReferral && (
                <li>
                  <button onClick={onOpenReferral} className="text-primary hover:text-primary/80 font-semibold transition-colors flex items-center gap-1 cursor-pointer">
                    <span>🎁 Refer & Earn ₹20</span>
                  </button>
                </li>
              )}
              <li>
                <a href="#reviews" className="hover:text-foreground transition-colors">
                  Customer Stories & Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Payment Merchant Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Verified Merchant</h4>
            <div className="bg-secondary/60 rounded-xl p-3 border border-border text-xs space-y-1">
              <p className="font-bold text-foreground">NAMAN JAIN</p>
              <p className="font-mono text-[11px] text-muted-foreground">7032996297@pthdfc</p>
              <p className="font-mono text-[11px] text-muted-foreground">7032996297@yespop</p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Zero gateway surcharge · 100% direct UPI
            </p>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Help & Support</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>+91 7032996297</span>
              </li>
              <li>
                <a
                  href="https://wa.me/917032996297?text=Hello%20Subnest%20Support"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:underline font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp VIP Support (24/7)</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                <span>support@subnest.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 Subnest. All rights reserved. | Built with ❤️ for subscription lovers</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-foreground cursor-pointer">Privacy</span>
            <span>·</span>
            <span className="hover:text-foreground cursor-pointer">Terms</span>
            <span>·</span>
            <span className="hover:text-foreground cursor-pointer">Refund</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

