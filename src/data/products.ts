import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'netflix',
    name: 'Netflix Premium 4K UHD',
    category: 'OTT',
    tagline: 'Private Screen with PIN Lock',
    description: 'Stream unlimited movies, series, and anime in Ultra HD 4K with Dolby Atmos audio on any 1 device.',
    image: '/subsplit-assets/63f6b054-05c0-4d74-a590-3065938a5a29.png',
    popular: true,
    deliveryType: 'Instant Screen',
    devices: '1 Device (TV/Phone/PC)',
    features: [
      'Ultra HD 4K + HDR Streaming',
      'Personal Profile with PIN Lock',
      'Download for Offline Viewing',
      'Watch on Smart TV, Laptop, Mobile',
      'Instant Credential Delivery & Replacement Warranty'
    ],
    plans: [
      { id: 'nf-1m', duration: '1 Month', price: 99, originalPrice: 649, badge: 'Popular' },
      { id: 'nf-3m', duration: '3 Months', price: 399, originalPrice: 1947 },
      { id: 'nf-6m', duration: '6 Months', price: 799, originalPrice: 3894 },
      { id: 'nf-12m', duration: '12 Months (Annual)', price: 1099, originalPrice: 7788, badge: 'Best Value' },
    ]
  },
  {
    id: 'prime-ad-free',
    name: 'Amazon Prime Video (Ad-Free)',
    category: 'OTT',
    tagline: '100% Ad-Free · On Your Number',
    description: 'Ad-free streaming experience with 4K resolution, X-Ray trivia, and offline downloads on your own number.',
    image: '/subsplit-assets/e4a3b65a-78d7-4787-a7dc-26b6d15d97cf.png',
    popular: true,
    deliveryType: 'On Your Number',
    devices: 'Up to 3 Devices',
    features: [
      '100% Ad-Free Streaming',
      'Full HD & 4K UHD with HDR',
      'Direct Activation on Your Phone Number',
      'All Amazon Originals, Web Series & Blockbusters'
    ],
    plans: [
      { id: 'paf-1m', duration: '1 Month', price: 99, originalPrice: 299 },
      { id: 'paf-3m', duration: '3 Months', price: 199, originalPrice: 599 },
      { id: 'paf-6m', duration: '6 Months', price: 399, originalPrice: 999 },
      { id: 'paf-12m', duration: '12 Months (Annual)', price: 799, originalPrice: 1499, badge: 'On Your Number' },
    ]
  },
  {
    id: 'prime-with-ads',
    name: 'Amazon Prime Video (With Ads)',
    category: 'OTT',
    tagline: 'Budget-friendly Prime Streaming',
    description: 'Enjoy Prime Video blockbuster releases and original series at lowest reseller rates.',
    image: '/subsplit-assets/e4a3b65a-78d7-4787-a7dc-26b6d15d97cf.png',
    deliveryType: 'Instant Screen',
    devices: '1 Device',
    features: [
      'HD Streaming with limited ads',
      'Instant Login Credentials',
      'Watch on Mobile, Tablet & PC',
      'Full Period Replacement Warranty'
    ],
    plans: [
      { id: 'pwa-1m', duration: '1 Month', price: 49, originalPrice: 199, badge: 'Cheapest' },
      { id: 'pwa-3m', duration: '3 Months', price: 99, originalPrice: 399 },
      { id: 'pwa-6m', duration: '6 Months', price: 179, originalPrice: 599 },
      { id: 'pwa-12m', duration: '12 Months (Annual)', price: 350, originalPrice: 999 },
    ]
  },
  {
    id: 'prime-all',
    name: 'Amazon Prime All Benefits',
    category: 'Special',
    tagline: 'Prime Video + Free Delivery + Music',
    description: 'Complete Amazon Prime package including Prime Video, Free One-Day delivery on shopping, and Prime Music.',
    image: '/subsplit-assets/e4a3b65a-78d7-4787-a7dc-26b6d15d97cf.png',
    popular: true,
    deliveryType: 'On Your Email',
    devices: 'All Supported Devices',
    features: [
      'Prime Video 4K Ad-Free',
      'Free 1-Day & 2-Day Delivery on Amazon India',
      'Ad-Free Amazon Prime Music',
      'Activated on Your Email ID'
    ],
    plans: [
      { id: 'pa-12m', duration: '12 Months (Annual)', price: 699, originalPrice: 1499, badge: 'All-in-One' }
    ]
  },
  {
    id: 'hotstar-super',
    name: 'Disney+ Hotstar / JioHotstar Super',
    category: 'OTT',
    tagline: '5 Devices · Live Sports & Movies',
    description: 'Watch live cricket, IPL, Premier League, Disney+ originals on up to 5 devices simultaneously.',
    image: '/subsplit-assets/jiohotstar-BlEax2r6.png',
    popular: true,
    deliveryType: 'On Your Number',
    devices: '5 Devices simultaneously',
    features: [
      'Live Sports & IPL in Full HD',
      '5 Devices at the same time',
      'Activated Directly on Your Mobile Number',
      'Dolby 5.1 Surround Sound'
    ],
    plans: [
      { id: 'hs-1m', duration: '1 Month', price: 75, originalPrice: 299 },
      { id: 'hs-3m', duration: '3 Months', price: 149, originalPrice: 499 },
      { id: 'hs-6m', duration: '6 Months', price: 249, originalPrice: 699 },
      { id: 'hs-12m', duration: '12 Months (Annual)', price: 399, originalPrice: 899, badge: 'Top Seller' }
    ]
  },
  {
    id: 'hotstar-premium',
    name: 'Disney+ Hotstar / JioHotstar 4K',
    category: 'OTT',
    tagline: '100% Ads Free · 4K Ultra HD',
    description: 'Ad-free experience with maximum 4K Ultra HD video quality and Dolby Atmos on 5 devices simultaneously.',
    image: '/subsplit-assets/jiohotstar-BlEax2r6.png',
    popular: true,
    deliveryType: 'On Your Number',
    devices: '5 Devices simultaneously',
    features: [
      '4K Ultra HD (2160p) + Dolby Vision',
      '100% Ads Free (Except Live Sports)',
      '5 Devices Stream at the same time',
      'Direct OTP on Your Number Activation'
    ],
    plans: [
      { id: 'hp-1m', duration: '1 Month', price: 199, originalPrice: 299 },
      { id: 'hp-3m', duration: '3 Months', price: 499, originalPrice: 699 },
      { id: 'hp-6m', duration: '6 Months', price: 699, originalPrice: 999 },
      { id: 'hp-12m', duration: '12 Months (Annual)', price: 1299, originalPrice: 1499, badge: 'Premium 4K' }
    ]
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium + YT Music',
    category: 'Music',
    tagline: 'Family Invite on Your Email',
    description: 'Ad-free YouTube videos, background playback with screen locked, video downloads, and YouTube Music Premium.',
    image: '/subsplit-assets/youtube-8Mu4VYTW.svg',
    popular: true,
    deliveryType: 'Family Invite',
    devices: 'All Your Devices',
    features: [
      '100% Ad-Free YouTube Videos',
      'Background Play & Picture-in-Picture',
      'Full YouTube Music Premium Access',
      'Official Family Invite to Your Email',
      'Same Email can be Renewed Monthly'
    ],
    plans: [
      { id: 'yt-1m', duration: '1 Month', price: 50, originalPrice: 149, badge: 'Popular' },
      { id: 'yt-3m', duration: '3 Months', price: 120, originalPrice: 399 },
      { id: 'yt-6m', duration: '6 Months', price: 219, originalPrice: 799 },
      { id: 'yt-12m', duration: '12 Months (Annual)', price: 399, originalPrice: 1490, badge: 'Best Value' }
    ]
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus (GPT-4o)',
    category: 'AI & Tools',
    tagline: 'Private Account & On Your Own Email',
    description: 'Get official OpenAI ChatGPT Plus with GPT-4o, Canvas, DALL-E 3 image generation, and Advanced Voice mode at lowest reseller rates.',
    image: '/subsplit-assets/chatgpt-D-eCKgGu.png',
    popular: true,
    deliveryType: 'Instant Account / Own Email',
    devices: 'Web, iOS, Android & Desktop',
    features: [
      'Full Access to GPT-4o, GPT-4 & Canvas',
      'DALL·E 3 High-Resolution Image Creation',
      'Advanced Voice Mode & File Upload Analysis',
      'Choose Private Account (₹699) or On Your Email (₹1,499)',
      '100% Replacement Warranty & WhatsApp Support'
    ],
    plans: [
      { id: 'cgpt-private', duration: 'ChatGPT Private Account', price: 699, originalPrice: 1999, badge: 'Popular' },
      { id: 'cgpt-own-email', duration: 'ChatGPT On Your Own Email', price: 1499, originalPrice: 2499, badge: 'Own Email' }
    ]
  },
  {
    id: 'sonyliv',
    name: 'SonyLIV Premium 4K',
    category: 'OTT',
    tagline: 'UEFA, WWE, Shark Tank & 4K Originals',
    description: 'Watch UEFA Champions League, live sports, WWE raw/smackdown, and hit shows in 4K on 5 devices at once.',
    image: '/subsplit-assets/3d3a76fb-45dc-4f65-a16c-434684ee0e07.png',
    deliveryType: 'On Your Number',
    devices: '5 Devices simultaneously',
    features: [
      '5 Devices at the Same Time',
      '4K Streaming for Premium Originals',
      'Activation on Your Mobile Number',
      'Monthly OTP or No-OTP Auto-Renewal (+₹29)'
    ],
    plans: [
      { id: 'sl-1m', duration: '1 Month', price: 69, originalPrice: 299 },
      { id: 'sl-3m', duration: '3 Months', price: 149, originalPrice: 599 },
      { id: 'sl-6m', duration: '6 Months', price: 249, originalPrice: 899 },
      { id: 'sl-12m', duration: '12 Months (Annual)', price: 399, originalPrice: 1499, badge: 'Hot Deal' }
    ]
  },
  {
    id: 'zee5',
    name: 'ZEE5 Premium HD',
    category: 'OTT',
    tagline: 'Blockbuster Regional & Hindi Movies',
    description: 'Stream 4,000+ movies, 200+ web series, and live TV channels ad-free on your personal phone number.',
    image: '/subsplit-assets/c9a646f1-42f2-4813-83d3-33a97edd66bd.png',
    deliveryType: 'On Your Number',
    devices: 'Multiple Devices',
    features: [
      'Activation directly on your mobile number',
      'HD ad-free streaming',
      'Access to before-TV episodes & ZEE5 exclusives',
      'Hindi, Tamil, Telugu, Marathi, Bengali & more'
    ],
    plans: [
      { id: 'z5-1m', duration: '1 Month', price: 69, originalPrice: 199 },
      { id: 'z5-3m', duration: '3 Months', price: 129, originalPrice: 399 },
      { id: 'z5-6m', duration: '6 Months', price: 199, originalPrice: 599 },
      { id: 'z5-12m', duration: '12 Months (Annual)', price: 349, originalPrice: 899 }
    ]
  },
  {
    id: 'hoichoi',
    name: 'Hoichoi Premium',
    category: 'Regional',
    tagline: 'Bengali Movies & Web Series',
    description: 'Largest Bengali entertainment platform with 600+ movies, exclusive web series, and music on your own number.',
    image: '/subsplit-assets/hoichoi-5TzT9QCT.png',
    deliveryType: 'On Your Number',
    devices: '1 Device at a time',
    features: [
      '1 Device at a time streaming',
      'Activated on your personal phone number',
      'Original Bengali series & detective hits',
      'No-OTP Auto Renewal (+₹29/mo) available'
    ],
    plans: [
      { id: 'hc-1m', duration: '1 Month', price: 49, originalPrice: 199 },
      { id: 'hc-3m', duration: '3 Months', price: 129, originalPrice: 399 },
      { id: 'hc-6m', duration: '6 Months', price: 249, originalPrice: 599 },
      { id: 'hc-12m', duration: '12 Months (Annual)', price: 399, originalPrice: 899 }
    ]
  },
  {
    id: 'sunnxt',
    name: 'Sun NXT (5 Devices Plan)',
    category: 'Regional',
    tagline: '5 Devices · Tamil, Telugu, Malayalam',
    description: 'South India’s favorite OTT platform with 4,000+ movies, comedy clips, and live Sun TV channels.',
    image: '/subsplit-assets/sunnxt.svg',
    deliveryType: 'On Your Number',
    devices: '5 Devices at the Same Time',
    features: [
      '5 Devices simultaneously streaming',
      'Direct activation on your own number',
      'Huge collection of South Indian blockbusters',
      'Live Sun TV channels streaming'
    ],
    plans: [
      { id: 'sn-1m', duration: '1 Month', price: 49, originalPrice: 150 },
      { id: 'sn-3m', duration: '3 Months', price: 129, originalPrice: 350 },
      { id: 'sn-6m', duration: '6 Months', price: 249, originalPrice: 550 },
      { id: 'sn-12m', duration: '12 Months (Annual)', price: 399, originalPrice: 799, badge: '5 Devices' }
    ]
  },
  {
    id: 'sunnxt-platinum',
    name: 'Sun NXT Platinum (Ads-Free 4K)',
    category: 'Regional',
    tagline: 'Ads-Free 4K Ultra HD South OTT',
    description: 'Platinum experience with completely ad-free 4K Ultra HD streaming in Tamil, Telugu, Kannada & Malayalam.',
    image: '/subsplit-assets/sunnxt.svg',
    deliveryType: 'On Your Number',
    devices: 'Mobile, TV & Web',
    features: [
      'Platinum Plan — 100% Ads Free',
      '4K Ultra HD streaming quality',
      'Watch on Mobile, Smart TV & Web',
      'Direct phone number activation'
    ],
    plans: [
      { id: 'snp-1m', duration: '1 Month', price: 129, originalPrice: 299 },
      { id: 'snp-3m', duration: '3 Months', price: 299, originalPrice: 599 },
      { id: 'snp-6m', duration: '6 Months', price: 399, originalPrice: 899 },
      { id: 'snp-12m', duration: '12 Months (Annual)', price: 699, originalPrice: 1299 }
    ]
  },
  {
    id: 'aha-video',
    name: 'Aha Video (aha GOLD)',
    category: 'Regional',
    tagline: 'Telugu & Tamil 4K + Dolby Atmos',
    description: 'Stream Telugu and Tamil blockbuster movies, exclusive web series, and original comedy shows in 4K Dolby Atmos.',
    image: '/subsplit-assets/aha-gold-BSCtIOhv.png',
    deliveryType: 'Instant Screen',
    devices: 'Mobile, TV & Web',
    features: [
      '4K Streaming + Dolby Atmos Audio',
      '100% Ad-Free Gold Experience',
      'Exclusive Telugu & Tamil web series',
      'Instant credentials delivery'
    ],
    plans: [
      { id: 'ah-1m', duration: '1 Month', price: 99, originalPrice: 199 },
      { id: 'ah-3m', duration: '3 Months', price: 249, originalPrice: 499 },
      { id: 'ah-6m', duration: '6 Months', price: 399, originalPrice: 699 },
      { id: 'ah-12m', duration: '12 Months (Annual)', price: 699, originalPrice: 999, badge: 'aha GOLD' }
    ]
  },
  {
    id: 'crunchyroll',
    name: 'Crunchyroll Anime (1 Device)',
    category: 'Entertainment',
    tagline: 'Ad-Free Anime Same Day as Japan',
    description: 'World’s largest anime library. Watch Demon Slayer, Attack on Titan, Jujutsu Kaisen with subtitles & dubs.',
    image: '/subsplit-assets/crunchyroll-D3OPRWb7.png',
    popular: true,
    deliveryType: 'Instant Screen',
    devices: '1 Device Private Login',
    features: [
      '100% Ad-Free anime streaming',
      'Simulcast episodes 1 hr after Japan broadcast',
      'High-definition 1080p video',
      'Private 1 Device login'
    ],
    plans: [
      { id: 'cr-1m', duration: '1 Month', price: 59, originalPrice: 129, badge: 'Super Cheap' },
      { id: 'cr-12m', duration: '1 Year', price: 299, originalPrice: 999, badge: 'Best Seller' }
    ]
  },
  {
    id: 'crunchyroll-megafan',
    name: 'Crunchyroll Mega Fan (Full Account)',
    category: 'Entertainment',
    tagline: '4 Devices · Registered on Your Email',
    description: 'Full Mega Fan account created on your personal email. Create 5 profiles, stream on 4 devices, and download offline.',
    image: '/subsplit-assets/crunchyroll-D3OPRWb7.png',
    deliveryType: 'On Your Email',
    devices: '4 Devices Simultaneously',
    features: [
      'Registered on Your Email ID',
      'Stream on 4 devices at the same time',
      'Create and use up to 5 profiles',
      'Offline viewing download support'
    ],
    plans: [
      { id: 'crm-fan', duration: '1 Month (Fan)', price: 170, originalPrice: 299 },
      { id: 'crm-mega', duration: '1 Month (Mega Fan)', price: 250, originalPrice: 399 },
      { id: 'crm-mega12', duration: '12 Months (Mega Fan)', price: 850, originalPrice: 1499, badge: 'Full Account' }
    ]
  },
  {
    id: 'lionsgate',
    name: 'Lionsgate Play Premium',
    category: 'OTT',
    tagline: 'Hollywood Blockbusters & Series',
    description: 'Watch John Wick franchise, acclaimed Hollywood movies, and Lionsgate exclusive drama series in pristine HD.',
    image: '/subsplit-assets/lionsgate-CFu76W2-.jpg',
    deliveryType: 'Instant Screen',
    devices: 'Multiple Devices',
    features: [
      'Curated Hollywood action & drama library',
      'Bilingual dubbing & subtitles',
      'Instant login credentials delivered',
      'Replacement warranty included'
    ],
    plans: [
      { id: 'lg-1m', duration: '1 Month', price: 99, originalPrice: 149 },
      { id: 'lg-3m', duration: '3 Months', price: 249, originalPrice: 399 },
      { id: 'lg-6m', duration: '6 Months', price: 349, originalPrice: 599 },
      { id: 'lg-12m', duration: '12 Months (Annual)', price: 549, originalPrice: 999 }
    ]
  },
  {
    id: 'fancode',
    name: 'FanCode Premium Pass',
    category: 'Entertainment',
    tagline: 'Live Cricket, Football & F1 Pass',
    description: 'Stream Caribbean Premier League, Formula 1 races, domestic cricket, and football matches ad-free in high frame rates.',
    image: '/subsplit-assets/fancode-D1PAMbQj.png',
    deliveryType: 'Instant Screen',
    devices: 'Mobile & Web',
    features: [
      'Live sports streaming with zero ads',
      'Multicam interactive live scorecard',
      'Fast delivery after payment',
      'Instant access on phone and PC'
    ],
    plans: [
      { id: 'fc-1m', duration: '1 Month', price: 149, originalPrice: 299 },
      { id: 'fc-2m', duration: '2 Months', price: 299, originalPrice: 499 },
      { id: 'fc-12m', duration: '12 Months (Annual)', price: 549, originalPrice: 999 }
    ]
  },
  {
    id: 'apple-tv',
    name: 'Apple TV+ (On Your Mail)',
    category: 'OTT',
    tagline: 'Apple Originals in 4K HDR',
    description: 'Award-winning Apple Original series (Ted Lasso, Severance, Morning Show) and blockbuster films in Dolby Vision.',
    image: '/subsplit-assets/appletv-D7Jt46VN.png',
    popular: true,
    deliveryType: 'On Your Email',
    devices: 'All Apple & TV Devices',
    features: [
      'Activated directly on your Apple ID email',
      'Pristine 4K HDR + Spatial Audio with Dolby Atmos',
      'Download on iPhone, iPad, Mac for offline viewing',
      'No password sharing needed'
    ],
    plans: [
      { id: 'at-12m', duration: '12 Months (Annual)', price: 669, originalPrice: 1188, badge: 'On Your Mail' }
    ]
  },
  {
    id: 'discovery-plus',
    name: 'Discovery+ Premium',
    category: 'Entertainment',
    tagline: 'Science, Nature & Wildlife',
    description: 'Explore BBC Earth documentaries, Discovery science, TLC lifestyle, and Animal Planet in full HD ad-free.',
    image: '/subsplit-assets/discovery-CQUUmB0X.jpg',
    deliveryType: 'Instant Screen',
    devices: 'All Devices Supported',
    features: [
      'Ad-free premium documentaries & reality TV',
      'Exclusive BBC Earth and space shows',
      'Watch on Mobile, TV and Web',
      'Quick delivery & replacement warranty'
    ],
    plans: [
      { id: 'dc-1m', duration: '1 Month', price: 99, originalPrice: 199 },
      { id: 'dc-12m', duration: '12 Months (Annual)', price: 499, originalPrice: 599 }
    ]
  },
  {
    id: 'hungama-play',
    name: 'Hungama Play + Music Pro',
    category: 'Music',
    tagline: 'Movies, Music & Micro-Dramas',
    description: 'All-in-one entertainment with movies, music, podcasts, and audiobooks under a single VIP subscription.',
    image: '/subsplit-assets/hungama-CEb2LYzc.jpg',
    deliveryType: 'Instant Screen',
    devices: 'Multiple Devices',
    features: [
      'Ad-free streaming of movies and originals',
      'Offline downloads for both video and audio',
      'Full music and audiobook library included',
      'Instant delivery on payment'
    ],
    plans: [
      { id: 'hg-1m', duration: '1 Month', price: 99, originalPrice: 199 },
      { id: 'hg-3m', duration: '3 Months', price: 199, originalPrice: 399 },
      { id: 'hg-6m', duration: '6 Months', price: 249, originalPrice: 599 },
      { id: 'hg-12m', duration: '12 Months (Annual)', price: 399, originalPrice: 899 }
    ]
  },
  {
    id: 'chaupal',
    name: 'Chaupal Premium',
    category: 'Regional',
    tagline: 'Punjabi, Haryanvi & Bhojpuri',
    description: 'Your go-to regional OTT platform for Punjabi blockbuster movies, Haryanvi humor, and Bhojpuri entertainment.',
    image: '/subsplit-assets/chaupal-B2CsDWHR.jpg',
    deliveryType: 'Instant Screen',
    devices: 'All Devices Supported',
    features: [
      'All content unlocked with zero ads',
      'HD quality playback with clear regional audio',
      'Watch anytime on mobile, TV, or web',
      'Instant delivery of credentials'
    ],
    plans: [
      { id: 'ch-1m', duration: '1 Month', price: 129, originalPrice: 299 },
      { id: 'ch-12m', duration: '12 Months (Annual)', price: 699, originalPrice: 1299 }
    ]
  },
  {
    id: 'telegram-premium',
    name: 'Telegram Premium (1 Year)',
    category: 'Special',
    tagline: 'Doubled Limits, 4GB Uploads, Star Badge',
    description: 'Get verified star badge, 4GB file uploads, faster downloads, voice-to-text transcriptions, and custom emoji reactions.',
    image: '/subsplit-assets/telegram.png',
    popular: true,
    deliveryType: 'On Your Account',
    devices: 'All Telegram Apps',
    features: [
      '4 GB Cloud File Upload Size',
      'Faster Download Speeds with No Cap',
      'Voice-to-Text Transcription',
      'Custom Animated Emoji & Premium Reactions',
      'Premium Profile Star Badge'
    ],
    plans: [
      { id: 'tg-ready', duration: '1 Year (Readymade Account)', price: 1800, originalPrice: 2899, badge: 'Instant' },
      { id: 'tg-own', duration: '1 Year (On Your Account)', price: 1800, originalPrice: 2899, badge: 'On Your Acc' }
    ]
  },
  {
    id: 'netmeds',
    name: 'Netmeds First Membership',
    category: 'Special',
    tagline: 'Healthcare Savings & Free Shipping',
    description: 'Save big on genuine medicines and healthcare products with extra cashback, free doctor consultations, and priority delivery.',
    image: '/subsplit-assets/netmeds.svg',
    deliveryType: 'On Your Number',
    devices: 'Netmeds App / Web',
    features: [
      'Extra 2% to 5% savings on all medicine orders',
      'Free shipping on all orders above ₹99',
      'Free online doctor consultations',
      'Activated on your registered mobile number'
    ],
    plans: [
      { id: 'nm-6m', duration: '6 Months', price: 499, originalPrice: 999 },
      { id: 'nm-12m', duration: '12 Months (Annual)', price: 799, originalPrice: 1499, badge: 'Annual Pass' }
    ]
  }
];
