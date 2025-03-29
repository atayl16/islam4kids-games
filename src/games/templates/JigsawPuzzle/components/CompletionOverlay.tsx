// The overlay shown when the puzzle is completed
import { AUDIO_FILES } from '../constants';

interface CompletionOverlayProps {
  totalPieces: number;
  isVisible: boolean;
}

export const CompletionOverlay = ({ totalPieces, isVisible }: CompletionOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div 
      className="completion-message"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        zIndex: 50,
        borderRadius: "8px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h3>Mashallah! Puzzle Complete!</h3>
        <p>All {totalPieces} pieces solved!</p>
        <audio src={AUDIO_FILES.COMPLETE} autoPlay />
      </div>
    </div>
  );
};
