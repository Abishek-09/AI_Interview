"use client";
import React from 'react';

interface AIAvatarProps {
  state: 'idle' | 'listening' | 'thinking' | 'speaking' | 'reconnecting';
}

export function AIAvatar({ state }: AIAvatarProps) {
  const getGlowColor = () => {
    switch (state) {
      case 'listening': return 'var(--success)';
      case 'speaking': return 'var(--accent-color)';
      case 'thinking': return 'var(--warning)';
      case 'reconnecting': return 'var(--error)';
      default: return 'var(--text-muted)';
    }
  };

  const getAnimationClass = () => {
    switch (state) {
      case 'listening': return 'animate-pulse';
      case 'speaking': return 'animate-waveform';
      case 'thinking': return 'animate-spin-slow';
      case 'reconnecting': return 'animate-bounce';
      default: return 'animate-breathe'; // subtle idle
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'listening': return 'Listening...';
      case 'speaking': return 'Speaking...';
      case 'thinking': return 'Evaluating...';
      case 'reconnecting': return 'Reconnecting...';
      default: return 'Idle';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-3)' }}>
      {/* Avatar Circle */}
      <div 
        className={getAnimationClass()}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-panel)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `3px solid ${getGlowColor()}`,
          boxShadow: `0 0 20px color-mix(in srgb, ${getGlowColor()} 40%, transparent)`,
          transition: 'all 0.4s ease-in-out',
          position: 'relative'
        }}
      >
        <span style={{ fontSize: '32px' }}>🤖</span>
        
        {/* Speaking visualizer rings */}
        {state === 'speaking' && (
          <>
            <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: `1px solid ${getGlowColor()}`, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
            <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: `1px solid ${getGlowColor()}`, animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '0.5s' }} />
          </>
        )}
      </div>

      <div style={{ fontSize: 'var(--text-sm)', color: getGlowColor(), fontWeight: 600, letterSpacing: '0.5px' }}>
        {getStatusText()}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes animate-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes animate-waveform {
          0% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(0.95); }
          75% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes animate-spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
