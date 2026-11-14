import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  return (
    <a
      href="https://wa.me/917032996297?text=Hello%20Subnest,%20I%20need%20help%20with%20subscriptions."
      target="_blank"
      rel="noreferrer"
      className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] z-40 group flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-950/60 transition-all hover:scale-105 active:scale-95"
      title="Instant WhatsApp Support"
    >
      <div className="relative flex items-center justify-center">
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full" />
      </div>
      <span className="hidden sm:inline">WhatsApp Support</span>
    </a>
  );
};

