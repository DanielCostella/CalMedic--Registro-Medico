import { useState, useEffect, useRef } from 'react';

interface TouchState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  deltaX: number;
  deltaY: number;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  isSwipe: boolean;
}

export const useTouch = (threshold: number = 50) => {
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    deltaX: 0,
    deltaY: 0,
    direction: null,
    isSwipe: false
  });

  const touchStartRef = useRef<TouchState>();

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    const newState = {
      startX: touch.clientX,
      startY: touch.clientY,
      endX: touch.clientX,
      endY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
      direction: null,
      isSwipe: false
    };
    
    touchStartRef.current = newState;
    setTouchState(newState);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.startX;
    const deltaY = touch.clientY - touchStartRef.current.startY;
    
    setTouchState(prev => ({
      ...prev,
      endX: touch.clientX,
      endY: touch.clientY,
      deltaX,
      deltaY
    }));
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.startX;
    const deltaY = touch.clientY - touchStartRef.current.startY;
    
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    let direction: 'left' | 'right' | 'up' | 'down' | null = null;
    let isSwipe = false;
    
    if (Math.max(absDeltaX, absDeltaY) > threshold) {
      isSwipe = true;
      if (absDeltaX > absDeltaY) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }
    }
    
    setTouchState(prev => ({
      ...prev,
      endX: touch.clientX,
      endY: touch.clientY,
      deltaX,
      deltaY,
      direction,
      isSwipe
    }));
  };

  const bindTouch = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };

  return {
    touchState,
    bindTouch
  };
};