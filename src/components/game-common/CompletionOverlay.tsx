import React, { useEffect } from 'react';

interface CompletionOverlayProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  onPlayAgain?: () => void;
  soundEffect?: string;
  children?: React.ReactNode;
}

/**
 * A reusable overlay component that appears when a game is completed.
 */
export const CompletionOverlay: React.FC<CompletionOverlayProps> = ({
  isVisible,
  title = "Mashallah! Well Done!",
  message = "You've completed the game!",
  onPlayAgain,
  soundEffect = "/audio/takbir.mp3",
  children
}) => {
  useEffect(() => {
    if (isVisible && soundEffect) {
      try {
        const audio = new Audio(soundEffect);
        audio.volume = 0.7;
        audio.play().catch(error => {
          console.log('Audio playback failed:', error);
        });
      } catch (error) {
        console.error('Error playing completion sound:', error);
      }
    }
  }, [isVisible, soundEffect]);

  if (!isVisible) return null;

  return (
    <div className="completion-message" data-testid="completion-overlay">
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
  );
};

export default CompletionOverlay;
