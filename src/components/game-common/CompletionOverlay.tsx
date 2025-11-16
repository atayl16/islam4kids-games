import React, { useEffect, useRef } from 'react';

interface CompletionOverlayProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  onPlayAgain?: () => void;
  soundEffect?: string;
  children?: React.ReactNode;
  setIsVisible?: (visible: boolean) => void; // Callback to update visibility
}

/**
 * A reusable overlay component that appears when a game is completed.
 */
export const CompletionOverlay: React.FC<CompletionOverlayProps> = ({
  isVisible,
  title = "Mashallah! Well Done!",
  message = "You've completed the game!",
  onPlayAgain,
  soundEffect = "/audio/success.mp3",
  children,
  setIsVisible
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Play sound effect when the overlay becomes visible
  useEffect(() => {
    if (isVisible && soundEffect) {
      try {
        const audio = new Audio(soundEffect);
        audio.volume = 0.7;
        audio.play().catch(() => {});
      } catch (error) {
        console.error('Error playing completion sound:', error);
      }
    }
  }, [isVisible, soundEffect]);

  // Close overlay when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setIsVisible?.(false); // Close the overlay
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isVisible, setIsVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      data-testid="completion-overlay"
    >
      <div
        ref={overlayRef}
        className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden animate-bounce-in"
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-violet-100 opacity-20"></div>
        <div className="h-2 absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 via-violet-500 to-amber-500"></div>

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-800 transition-all duration-200 text-2xl font-light leading-none"
          onClick={() => setIsVisible?.(false)}
          aria-label="Close overlay"
        >
          ×
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center shadow-lg">
            <span className="text-4xl">🎉</span>
          </div>
        </div>

        {/* Title and Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        <p className="text-lg text-slate-600 text-center mb-6">{message}</p>

        {children}

        {/* Play Again Button */}
        {onPlayAgain && (
          <div className="flex justify-center mt-6">
            <button
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-violet-500 text-white rounded-xl font-medium shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              onClick={onPlayAgain}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletionOverlay;
