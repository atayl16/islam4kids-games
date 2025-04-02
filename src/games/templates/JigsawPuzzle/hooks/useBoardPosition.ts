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
    right: number;
    bottom: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    right: 0,
    bottom: 0
  });

  const updateBoardRect = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      
      // Get the parent container's position if it exists
      const parentRect = containerRef.current.parentElement 
        ? containerRef.current.parentElement.getBoundingClientRect() 
        : { top: 0, left: 0 };
      
      // Calculate position relative to parent container
      const relativeTop = rect.top - parentRect.top;
      const relativeLeft = rect.left - parentRect.left;
      
      const updatedRect = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        right: rect.right,
        bottom: rect.bottom
      };
      
      setBoardRect(updatedRect);
      
      console.log("Board position updated:", {
        absolutePosition: {
          top: rect.top,
          left: rect.left
        },
        relativePosition: {
          top: relativeTop,
          left: relativeLeft
        },
        dimensions: {
          width: rect.width,
          height: rect.height
        },
        parentPosition: {
          top: parentRect.top,
          left: parentRect.left
        }
      });
    }
  }, [containerRef]);

  useEffect(() => {
    updateBoardRect();
    window.addEventListener("resize", updateBoardRect);
    window.addEventListener("scroll", updateBoardRect);

    // Run multiple times to ensure correct position after any animations or layout changes
    const timers = [
      setTimeout(updateBoardRect, 100),
      setTimeout(updateBoardRect, 500),
      setTimeout(updateBoardRect, 1000)
    ];

    return () => {
      window.removeEventListener("resize", updateBoardRect);
      window.removeEventListener("scroll", updateBoardRect);
      timers.forEach(clearTimeout);
    };
  }, [updateBoardRect]);

  return { boardRect, updateBoardRect };
};
