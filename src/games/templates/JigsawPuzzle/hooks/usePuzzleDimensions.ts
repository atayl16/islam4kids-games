// Custom hook for calculating puzzle dimensions
import { useCallback, RefObject } from 'react';
import { MAX_CONTAINER_WIDTH, MIN_PIECE_WIDTH, VISUAL_CONFIG } from '../constants';

export const usePuzzleDimensions = (
  containerRef: RefObject<HTMLDivElement | null>,
  rows: number,
  columns: number
) => {
  const calculateDimensions = useCallback(() => {
    // Calculate available viewport height to ensure puzzle fits
    const viewportHeight = window.innerHeight * VISUAL_CONFIG.VIEWPORT_HEIGHT_RATIO;

    // Get base container width - limit to 50% of the total width for the split view
    const baseWidth = Math.min(
      MAX_CONTAINER_WIDTH / 2,
      (containerRef.current?.clientWidth || MAX_CONTAINER_WIDTH) / 2
    );

    // Initial calculations
    let pieceWidth = baseWidth / columns;
    if (pieceWidth < MIN_PIECE_WIDTH) {
      pieceWidth = MIN_PIECE_WIDTH;
    }

    let pieceHeight = pieceWidth;

    // Calculate total dimensions preserving aspect ratio
    const containerHeight = pieceHeight * rows;

    // If container is too tall, scale down proportionally
    if (containerHeight > viewportHeight) {
      const scale = viewportHeight / containerHeight;
      pieceWidth = pieceWidth * scale;
      pieceHeight = pieceHeight * scale;
    }

    return {
      containerWidth: pieceWidth * columns,
      containerHeight: pieceHeight * rows,
      pieceWidth,
      pieceHeight,
    };
  }, [containerRef, rows, columns]);

  return { calculateDimensions };
};
