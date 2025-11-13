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
    <div className="completion-overlay" data-testid="completion-overlay">
      <div className="completion-overlay-content" ref={overlayRef}>
        {/* Close Button */}
        <button 
          className="close-button" 
          onClick={() => setIsVisible?.(false)} 
          aria-label="Close overlay"
        >
          ×
        </button>

        <h2>{title}</h2>
        <p>{message}</p>
        
        {children}
        
        {onPlayAgain && (
          <button 
            className="play-again-button" 
            onClick={onPlayAgain}
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};

export default CompletionOverlay;
