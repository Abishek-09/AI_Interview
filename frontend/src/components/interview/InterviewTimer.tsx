"use client";
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface InterviewTimerProps {
  initialTimeSeconds: number;
  onTimeUp?: () => void;
}

export function InterviewTimer({ initialTimeSeconds, onTimeUp }: InterviewTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTimeSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 300; // 5 minutes
  const isCritical = timeLeft <= 60; // 1 minute

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      padding: '8px 16px', 
      borderRadius: 'var(--radius-md)', 
      backgroundColor: isCritical ? 'color-mix(in srgb, var(--error) 15%, transparent)' : 
                       isWarning ? 'color-mix(in srgb, var(--warning) 15%, transparent)' : 'var(--bg-secondary)',
      color: isCritical ? 'var(--error)' : 
             isWarning ? 'var(--warning)' : 'var(--text-primary)',
      border: `1px solid ${isCritical ? 'var(--error)' : isWarning ? 'var(--warning)' : 'var(--border-color)'}`,
      fontWeight: 600,
      transition: 'all 0.3s ease'
    }}>
      <Clock size={16} className={isCritical ? 'animate-pulse' : ''} />
      <span style={{ fontSize: 'var(--text-lg)', fontVariantNumeric: 'tabular-nums' }}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
