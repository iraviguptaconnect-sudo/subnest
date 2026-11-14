import React, { useRef, useState } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Camera,
  Mic,
  CheckCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'customer' | 'support';
  text: string;
  time: string;
  reaction?: string;
  audioNote?: { duration: string };
}

interface ReviewChat {
  id: string;
  customerName: string;
  customerPhoneMasked: string;
  avatarBg: string;
  service: string;
  plan: string;
  rating: number;
  date: string;
  messages: ChatMessage[];
}

export const ReviewsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const reviewChats: ReviewChat[] = [
    {
      id: 'chat-1',
      customerName: 'Aditya Verma',
      customerPhoneMasked: '+91 98201 •••••',
      avatarBg: 'bg-emerald-600',
      service: 'Netflix 4K UHD',
      plan: '6 Months Plan',
      rating: 5,
      date: 'TODAY',
      messages: [
        {
          id: 'm1',
          sender: 'customer',
          text: 'Bhai payment ho gaya UPI se, UTR: 429182910384. Netflix 4K profile activate kar do please 🙏',
          time: '10:41 PM',
        },
        {
          id: 'm2',
          sender: 'support',
          text: 'Payment received bhai! Here are your credentials:\n👤 Profile: Aditya (Slot 3)\n🔒 PIN: 8492\nEnjoy in 4K Ultra HD + Dolby Atmos! 🚀',
          time: '10:43 PM',
        },
        {
          id: 'm3',
          sender: 'customer',
          text: 'Bhai Netflix ka 4K profile 5 minute mein deliver ho gaya! TV pe check kiya, ekdum butter smooth chal raha hai bina kisi problem ke. Service 10/10 hai aapki! ❤️🔥',
          time: '10:46 PM',
          reaction: '❤️ 1',
        },
        {
          id: 'm4',
          sender: 'support',
          text: 'Welcome to Subnest bro! 100% full duration replacement warranty included hai. Enjoy watching! 👍✨',
          time: '10:47 PM',
        },
      ],
    },
    {
      id: 'chat-2',
      customerName: 'Rohan Deshmukh',
      customerPhoneMasked: '+91 97652 •••••',
      avatarBg: 'bg-blue-600',
      service: 'JioHotstar Super',
      plan: '12 Months Annual',
      rating: 5,
      date: 'YESTERDAY',
      messages: [
        {
          id: 'm1',
          sender: 'customer',
          text: 'Hotstar Super 1 Year plan chahiye on my number. Amount send kar diya Paytm se.',
          time: '7:15 PM',
        },
        {
          id: 'm2',
          sender: 'support',
          text: 'Please share the 4-digit OTP sent to your registered mobile number for Hotstar activation.',
          time: '7:16 PM',
        },
        {
          id: 'm3',
          sender: 'customer',
          text: 'OTP is 6824. Activate kar do.',
          time: '7:17 PM',
        },
        {
          id: 'm4',
          sender: 'support',
          text: 'Done bhai! Annual Hotstar Super is now active directly on your own number until Nov 2027. Enjoy Live Cricket! 🏏',
          time: '7:18 PM',
        },
        {
          id: 'm5',
          sender: 'customer',
          text: 'Mere personal number pe activate ho gaya bina kisi password sharing ke! Genuine reseller dhundh raha tha kab se. Bahut shukriya bhai! 🙌',
          time: '7:22 PM',
          reaction: '🔥 1',
        },
      ],
    },
    {
      id: 'chat-3',
      customerName: 'Sneha Patel',
      customerPhoneMasked: '+91 94088 •••••',
      avatarBg: 'bg-purple-600',
      service: 'YouTube Premium',
      plan: '1 Year Family Pass',
      rating: 5,
      date: 'TODAY',
      messages: [
        {
          id: 'm1',
          sender: 'customer',
          text: 'Bhai YouTube Premium ka family invite kab tak aayega? Gmail: sneha.p****@gmail.com',
          time: '3:20 PM',
        },
        {
          id: 'm2',
          sender: 'support',
          text: 'Invitation sent from official Google! Please check your Gmail inbox / promotions tab and click "Accept Invite".',
          time: '3:23 PM',
        },
        {
          id: 'm3',
          sender: 'customer',
          text: 'Accepted! YouTube Premium active ho gaya. Background play aur YouTube Music bina kisi ads ke perfect chal raha hai. Thank you so much Subnest! ❤️',
          time: '3:26 PM',
          reaction: '❤️ 1',
        },
        {
          id: 'm4',
          sender: 'support',
          text: 'Glad to help Sneha! Apne doston ko bhi recommend kariyega. Have a great day! 🎉',
          time: '3:28 PM',
        },
      ],
    },
    {
      id: 'chat-4',
      customerName: 'Karthik Raja',
      customerPhoneMasked: '+91 99403 •••••',
      avatarBg: 'bg-amber-600',
      service: 'OTT Combo (3 Apps)',
      plan: 'Netflix + Prime + Hotstar',
      rating: 5,
      date: 'YESTERDAY',
      messages: [
        {
          id: 'm1',
          sender: 'customer',
          text: 'Bro maine Combo Builder se Netflix + Prime + Hotstar ka combo buy kiya hai.',
          time: '9:02 PM',
        },
        {
          id: 'm2',
          sender: 'support',
          text: 'Verified Karthik! 15% combo bundle discount applied. Sending credentials for all 3 apps right away...',
          time: '9:05 PM',
        },
        {
          id: 'm3',
          sender: 'support',
          text: '1. Netflix 4K profile PIN: 4019\n2. Prime Video login sent\n3. Hotstar OTP sent on your number.',
          time: '9:07 PM',
        },
        {
          id: 'm4',
          sender: 'customer',
          text: 'Combo bundle se liya tha bahut paisa bach gaya! Teeno apps ek saath smooth chal rahe hain. Naman bhai customer support ek number hai! 💯💯',
          time: '9:12 PM',
          reaction: '🙏 1',
        },
      ],
    },
    {
      id: 'chat-5',
      customerName: 'Pooja Sharma',
      customerPhoneMasked: '+91 96102 •••••',
      avatarBg: 'bg-rose-600',
      service: 'Crunchyroll Anime',
      plan: '1 Year Mega Fan',
      rating: 5,
      date: '2 DAYS AGO',
      messages: [
        {
          id: 'm1',
          sender: 'customer',
          text: 'Crunchyroll 1 Year Mega Fan plan chahiye for anime streaming.',
          time: '6:30 PM',
        },
        {
          id: 'm2',
          sender: 'support',
          text: 'Mega Fan credentials sent! 4 screens simultaneous + offline download enabled.',
          time: '6:33 PM',
        },
        {
          id: 'm3',
          sender: 'customer',
          text: 'Demon Slayer aur Jujutsu Kaisen 1080p mein chal raha hai smoothly. ₹299 for whole year is unbelievable deal. Best OTT service hands down! 🌸',
          time: '6:38 PM',
          reaction: '✨ 1',
        },
        {
          id: 'm4',
          sender: 'support',
          text: 'Anime fans are always special for us! Keep streaming on Subnest ✨',
          time: '6:40 PM',
        },
      ],
    },
    {
      id: 'chat-6',
      customerName: 'Vikas Kumar',
      customerPhoneMasked: '+91 88029 •••••',
      avatarBg: 'bg-teal-600',
      service: 'SonyLIV 4K',
      plan: '6 Months Plan',
      rating: 5,
      date: '3 DAYS AGO',
      messages: [
        {
          id: 'm1',
          sender: 'customer',
          text: 'UEFA Champions League match start hone wala hai 10 baje. SonyLIV urgently chahiye.',
          time: '9:48 PM',
        },
        {
          id: 'm2',
          sender: 'support',
          text: 'Live in 2 minutes! OTP sending on your number now...',
          time: '9:50 PM',
        },
        {
          id: 'm3',
          sender: 'customer',
          text: 'Active ho gaya! 4K live football match bina kisi buffering ke chal raha hai. Instant delivery bachha liya match miss hone se! Thanks brother ❤️⚽',
          time: '9:54 PM',
          reaction: '⚽ 1',
        },
      ],
    },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.75;
    const newPos = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
    scrollRef.current.scrollTo({ left: newPos, behavior: 'smooth' });
  };

  const checkScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  return (
    <section id="reviews" className="relative py-20 px-4 max-w-7xl mx-auto overflow-hidden">
      
      {/* Background ambient glow matching Subnest colors */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real WhatsApp Feedback</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">
          Real Reviews from{' '}
          <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Happy Customers
          </span>
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          See what our customers have to say about their experience with our instant WhatsApp delivery and verified subscriptions.
        </p>

        {/* Rating summary pill */}
        <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-card border border-border text-xs shadow-sm">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="font-bold text-foreground">4.9/5</span>
          <span className="text-muted-foreground">· from 10,000+ satisfied Indians</span>
        </div>
      </div>

      {/* Slider Controls Bar */}
      <div className="relative z-10 flex items-center justify-between mb-4 px-2">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>100% Verified Chats from WhatsApp (+91 7032996297)</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous reviews"
            className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next reviews"
            className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal WhatsApp Phone Mockups Carousel */}
      <div
        ref={scrollRef}
        onScroll={checkScrollState}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 px-2 snap-x snap-mandatory scroll-smooth no-scrollbar relative z-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviewChats.map((chat) => (
          <div
            key={chat.id}
            className="snap-center shrink-0 w-[290px] sm:w-[320px] rounded-[36px] p-2.5 bg-gradient-to-b from-zinc-700/50 via-zinc-800/40 to-zinc-900/60 border border-border/80 shadow-2xl hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1"
          >
            {/* Phone Screen Container */}
            <div className="relative rounded-[28px] overflow-hidden bg-[#0b141a] text-[#e9edef] flex flex-col h-[520px] select-none border border-zinc-900 shadow-inner">
              
              {/* Dynamic Island / Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800 ml-auto mr-1.5" />
              </div>

              {/* WhatsApp Chat Top Header */}
              <div className="bg-[#1f2c34] pt-7 pb-2.5 px-3 flex items-center justify-between border-b border-zinc-800/60 shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4 text-[#8696a0]" />
                  <div className={`w-8 h-8 rounded-full ${chat.avatarBg} flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm`}>
                    {chat.customerName.charAt(0)}
                  </div>
                  <div className="leading-tight">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-white truncate max-w-[110px]">
                        {chat.customerName}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#00a884] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] inline-block" />
                      online
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[#8696a0]">
                  <Video className="w-3.5 h-3.5 hover:text-white transition-colors cursor-pointer" />
                  <Phone className="w-3.5 h-3.5 hover:text-white transition-colors cursor-pointer" />
                  <MoreVertical className="w-3.5 h-3.5 hover:text-white transition-colors cursor-pointer" />
                </div>
              </div>

              {/* Verified Product Badge Bar */}
              <div className="bg-[#182229] py-1 px-3 flex items-center justify-between text-[10px] text-[#8696a0] border-b border-zinc-800/40">
                <span className="font-semibold text-primary">{chat.service}</span>
                <span className="text-[9px] bg-zinc-800/80 px-2 py-0.5 rounded-full text-zinc-300">{chat.plan}</span>
              </div>

              {/* Chat Message Scroll Area (WhatsApp wallpaper pattern background) */}
              <div
                className="flex-1 p-3 overflow-y-auto space-y-2.5 flex flex-col justify-end relative"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              >
                {/* Date Pill */}
                <div className="flex justify-center mb-1">
                  <span className="text-[9px] font-semibold bg-[#182229] text-[#8696a0] px-2.5 py-0.5 rounded-md shadow-sm">
                    {chat.date}
                  </span>
                </div>

                {/* Conversation bubbles */}
                {chat.messages.map((msg) => {
                  const isSupport = msg.sender === 'support';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isSupport ? 'items-end' : 'items-start'} relative`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-xs shadow-sm relative leading-relaxed ${
                          isSupport
                            ? 'bg-[#005c4b] text-white rounded-tr-xs'
                            : 'bg-[#202c33] text-[#e9edef] rounded-tl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-line text-[11px]">{msg.text}</p>
                        
                        <div className="flex items-center justify-end gap-1 mt-0.5 text-[9px] text-zinc-300/70 select-none">
                          <span>{msg.time}</span>
                          {isSupport && (
                            <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] shrink-0" />
                          )}
                        </div>

                        {/* Reaction Pill if present */}
                        {msg.reaction && (
                          <div className="absolute -bottom-2 left-2 bg-[#202c33] border border-zinc-700 text-[10px] px-1.5 py-0.2 rounded-full shadow-md flex items-center">
                            {msg.reaction}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* WhatsApp Bottom Input Bar */}
              <div className="bg-[#1f2c34] p-2 flex items-center gap-1.5 border-t border-zinc-800/60 shrink-0">
                <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 flex items-center gap-2 text-zinc-400">
                  <Smile className="w-4 h-4 hover:text-white transition-colors" />
                  <span className="text-xs text-zinc-400 flex-1">Message</span>
                  <Paperclip className="w-3.5 h-3.5 hover:text-white transition-colors" />
                  <Camera className="w-3.5 h-3.5 hover:text-white transition-colors" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-white shrink-0 shadow-md">
                  <Mic className="w-4 h-4" />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Footer Social Proof */}
      <div className="text-center mt-10 relative z-10">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
          Join thousands of satisfied customers
        </p>
        <div className="inline-flex items-center justify-center gap-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="text-sm font-bold text-foreground">4.9/5</span>
          <span className="text-xs text-muted-foreground">from 10,000+ verified orders</span>
        </div>
      </div>

    </section>
  );
};
