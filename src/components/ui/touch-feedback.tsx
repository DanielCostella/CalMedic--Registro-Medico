import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TouchFeedbackProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const TouchFeedback: React.FC<TouchFeedbackProps> = ({
  children,
  className,
  disabled = false,
  onTap,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    
    setIsPressed(true);
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (disabled) return;
    
    setIsPressed(false);
    
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    // Determine if it's a swipe or tap
    if (Math.max(absDeltaX, absDeltaY) < 10) {
      // It's a tap
      onTap?.();
    } else if (absDeltaX > absDeltaY && absDeltaX > 50) {
      // Horizontal swipe
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > 50) {
      // Vertical swipe
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }
    
    setTouchStart(null);
  };

  const handleTouchCancel = () => {
    setIsPressed(false);
    setTouchStart(null);
  };

  return (
    <div
      className={cn(
        'transition-transform duration-75 select-none',
        isPressed && !disabled && 'scale-95',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {children}
    </div>
  );
};