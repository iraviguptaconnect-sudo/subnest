import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  durationMs = 1400,
}) => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fading out after durationMs
    const fadeTimer = setTimeout(() => {
      setFading(true);
      // Remove from DOM after transition completes
      const removeTimer = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(removeTimer);
    }, durationMs);

    return () => clearTimeout(fadeTimer);
  }, [durationMs, onComplete]);

  // Click to skip splash screen immediately
  const handleSkip = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 200);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center transition-all duration-500 cursor-pointer select-none ${
        fading ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
      aria-label="Subnest Preloader (Click to skip)"
    >
      {/* Ambient center radial glow behind the logo */}
      <div className="absolute w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-40 animate-pulse-red" />

      <div className="relative z-10 text-center px-4">
        {/* Brand Logo with Luxury Aura & Subtle Breathing Scale */}
        <div className="mb-6 animate-luxury-glow">
          <img
            src="/assets/subnest-logo.png"
            alt="Subnest"
            className="w-36 h-36 sm:w-44 sm:h-44 mx-auto object-contain drop-shadow-2xl animate-luxury-pulse"
          />
        </div>

        {/* Minimalist Subsplit Tagline with Wide Letter Spacing */}
        <h2 className="text-foreground text-sm sm:text-base md:text-lg font-medium tracking-[0.2em] uppercase opacity-90 animate-luxury-text">
          Why Pay More? Get More.
        </h2>
      </div>
    </div>
  );
};

