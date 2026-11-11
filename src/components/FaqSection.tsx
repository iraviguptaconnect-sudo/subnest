import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does activation work? Will I get OTP on my own number?',
      a: 'Yes! For plans labeled "On Your Number" (such as JioHotstar, SonyLIV, Zee5, Hoichoi), our team sends an official login OTP directly to your registered mobile number so the plan activates on your personal account. For YouTube Premium and Apple TV, we send an official family invite to your personal Gmail or Apple ID. For Netflix and Prime (with ads), we give you private profile credentials with personal PIN protection.',
    },
    {
      q: 'What is the Subnest 100% Replacement Warranty?',
      a: 'If any account gets logged out or encounters household verification before your plan period expires, our team resets or replaces your slot within 15–30 minutes via WhatsApp support (+91 9347610989). You are 100% protected throughout your validity.',
    },
    {
      q: 'How fast is the delivery after completing UPI payment?',
      a: 'Average delivery takes only 5 to 10 minutes. Once you scan the QR and submit your 12-digit UTR number (or message us on WhatsApp), our automated system verifies the payment and dispatches your login credentials or activation OTP.',
    },
    {
      q: 'Can I renew the same account or email next month?',
      a: 'Yes! For YouTube, Hotstar, and personal number plans, the same account will be renewed smoothly so you never lose your watch history, watchlist, or custom playlists.',
    },
    {
      q: 'Which UPI apps are accepted for payment?',
      a: 'All Indian UPI apps are supported including Paytm, PhonePe, Google Pay (GPay), POP Club, BHIM, and Cred. Our verified beneficiary merchant name is NAMAN JAIN with zero surcharge.',
    },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border text-xs font-semibold text-muted-foreground mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Everything You Need to Know
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
          Clear answers about activations, replacements, and payment methods.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen ? 'bg-card border-primary/40' : 'bg-card/50 border-border hover:border-foreground/20'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
              >
                <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
};

