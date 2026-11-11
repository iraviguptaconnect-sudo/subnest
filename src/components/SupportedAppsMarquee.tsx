import React from 'react';

interface AppPill {
  name: string;
  price: string;
  logo: string;
}

export const SupportedAppsMarquee: React.FC = () => {
  const row1: AppPill[] = [
    { name: 'Netflix 4K', price: '₹99/mo', logo: '/subsplit-assets/63f6b054-05c0-4d74-a590-3065938a5a29.png' },
    { name: 'Prime Video', price: '₹49/mo', logo: '/subsplit-assets/prime-DGvjTNGk.svg' },
    { name: 'JioHotstar Super', price: '₹75/mo', logo: '/subsplit-assets/jiohotstar-C7NGZwUa.svg' },
    { name: 'YouTube Premium', price: '₹50/mo', logo: '/subsplit-assets/youtube-8Mu4VYTW.svg' },
    { name: 'Spotify Premium', price: '₹49/mo', logo: '/subsplit-assets/spotify-eBjxoM9M.png' },
    { name: 'SonyLIV 4K', price: '₹69/mo', logo: '/subsplit-assets/3d3a76fb-45dc-4f65-a16c-434684ee0e07.png' },
    { name: 'ZEE5 HD', price: '₹69/mo', logo: '/subsplit-assets/c9a646f1-42f2-4813-83d3-33a97edd66bd.png' },
    { name: 'Crunchyroll', price: '₹59/mo', logo: '/subsplit-assets/crunchyroll-D3OPRWb7.png' },
    { name: 'Aha Video', price: '₹99/mo', logo: '/subsplit-assets/aha-gold-BSCtIOhv.png' },
  ];

  const row2: AppPill[] = [
    { name: 'Apple TV+', price: '₹669/yr', logo: '/subsplit-assets/appletv-D7Jt46VN.png' },
    { name: 'Hoichoi Premium', price: '₹49/mo', logo: '/subsplit-assets/hoichoi-5TzT9QCT.png' },
    { name: 'FanCode Pass', price: '₹149/mo', logo: '/subsplit-assets/fancode-D1PAMbQj.png' },
    { name: 'Chaupal Punjabi', price: '₹129/mo', logo: '/subsplit-assets/chaupal-B2CsDWHR.jpg' },
    { name: 'Lionsgate Play', price: '₹99/mo', logo: '/subsplit-assets/lionsgate-CFu76W2-.jpg' },
    { name: 'Discovery+', price: '₹99/mo', logo: '/subsplit-assets/discovery-CQUUmB0X.jpg' },
    { name: 'Hungama Play', price: '₹99/mo', logo: '/subsplit-assets/hungama-CEb2LYzc.jpg' },
    { name: 'Telegram Premium', price: '₹1800/yr', logo: '/subsplit-assets/telegram.png' },
  ];

  const renderTrack = (apps: AppPill[], reverse = false) => {
    // Duplicate apps array for infinite smooth loop
    const doubled = [...apps, ...apps, ...apps];
    return (
      <div className="marquee-track-wrap py-2">
        <div className={`marquee-track ${reverse ? 'marquee-left' : 'marquee-right'}`}>
          {doubled.map((app, idx) => (
            <div
              key={`${app.name}-${idx}`}
              className="marquee-pill group relative flex items-center gap-2.5 sm:gap-3 shrink-0 h-11 sm:h-[52px] px-4 sm:px-5 rounded-full bg-card border border-border backdrop-blur-xl shadow-sm transition-[transform,background-color,border-color] duration-200 ease-out hover:bg-secondary cursor-pointer"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden bg-background/80 flex items-center justify-center p-0.5 shrink-0">
                <img
                  src={app.logo}
                  alt={app.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-foreground leading-tight">
                  {app.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {app.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full py-6 sm:py-10 overflow-hidden">
      <div className="text-center mb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Supported Apps & Tools
        </span>
      </div>
      <div className="space-y-3">
        {renderTrack(row1, false)}
        {renderTrack(row2, true)}
      </div>
    </section>
  );
};

