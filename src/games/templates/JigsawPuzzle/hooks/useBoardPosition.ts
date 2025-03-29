// Custom hook for tracking board position
import { useState, useCallback, useEffect, RefObject } from 'react';

export const useBoardPosition = (
  containerRef: RefObject<HTMLDivElement | null>
) => {
  const [boardRect, setBoardRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const updateBoardRect = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setBoardRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      console.log(
        `Board position updated: ${rect.top}px, ${rect.left}px, width: ${rect.width}px, height: ${rect.height}px`
      );
    }
  }, [containerRef]);

  useEffect(() => {
    updateBoardRect();
    window.addEventListener("resize", updateBoardRect);

    // Ensure the correct position after rendering
    const timerId = setTimeout(updateBoardRect, 500);

    return () => {
      window.removeEventListener("resize", updateBoardRect);
      clearTimeout(timerId);
    };
  }, [updateBoardRect]);

  return { boardRect, updateBoardRect };
};
