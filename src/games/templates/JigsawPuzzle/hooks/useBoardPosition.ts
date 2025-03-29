// Custom hook for tracking board position
import { useState, useCallback, useEffect, RefObject } from 'react';

export const useBoardPosition = (containerRef: RefObject<HTMLDivElement | null>) => {
  const [boardRect, setBoardRect] = useState({ top: 0, left: 0 });
  
  const updateBoardRect = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setBoardRect({ top: rect.top, left: rect.left });
      console.log(`Board position updated: ${rect.top}px, ${rect.left}px`);
    }
  }, [containerRef]);
  
  useEffect(() => {
    updateBoardRect();
    window.addEventListener('resize', updateBoardRect);
    
    // Make sure we get the correct position after everything renders
    const timerIds = [
      setTimeout(updateBoardRect, 100),
      setTimeout(updateBoardRect, 500),
      setTimeout(updateBoardRect, 1000)
    ];
    
    return () => {
      window.removeEventListener('resize', updateBoardRect);
      timerIds.forEach(id => clearTimeout(id));
    };
  }, [updateBoardRect]);
  
  return { boardRect, updateBoardRect };
};
