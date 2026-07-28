"use client";
import React, { useEffect, useRef } from 'react';

export interface Infraction {
  type: 'tab_switch' | 'paste' | 'idle' | 'media_drop';
  timestamp: Date;
  details?: string;
}

interface CheatingDetectorProps {
  onInfraction: (infraction: Infraction) => void;
  idleThresholdMs?: number;
}

export function CheatingDetector({ onInfraction, idleThresholdMs = 120000 }: CheatingDetectorProps) {
  const lastActivityRef = useRef<number>(Date.now());
  const idleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Detect Tab Switching (Visibility API)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onInfraction({
          type: 'tab_switch',
          timestamp: new Date(),
          details: 'User switched away from the interview tab.'
        });
      }
    };

    // 2. Detect Blur (Window focus lost)
    const handleBlur = () => {
      if (!document.hidden) { // Avoid duplicate with visibility
        onInfraction({
          type: 'tab_switch',
          timestamp: new Date(),
          details: 'Window lost focus.'
        });
      }
    };

    // 3. Detect Paste
    const handlePaste = (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData('text') || '';
      if (pastedText.length > 50) { // Only flag substantial pastes
        onInfraction({
          type: 'paste',
          timestamp: new Date(),
          details: `Pasted ${pastedText.length} characters.`
        });
      }
    };

    // 4. Idle Detection
    const resetIdleTimer = () => {
      lastActivityRef.current = Date.now();
    };

    idleIntervalRef.current = setInterval(() => {
      if (Date.now() - lastActivityRef.current > idleThresholdMs) {
        onInfraction({
          type: 'idle',
          timestamp: new Date(),
          details: `User idle for over ${idleThresholdMs / 1000} seconds.`
        });
        // Reset so we don't spam
        lastActivityRef.current = Date.now();
      }
    }, 10000); // Check every 10s

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('paste', handlePaste);
    
    // Activity listeners
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('paste', handlePaste);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('scroll', resetIdleTimer);
      if (idleIntervalRef.current) clearInterval(idleIntervalRef.current);
    };
  }, [onInfraction, idleThresholdMs]);

  return null; // Headless component
}
