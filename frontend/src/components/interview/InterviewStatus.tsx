import React from 'react';

export type AIState = 
  | 'idle' 
  | 'listening' 
  | 'thinking' 
  | 'generating' 
  | 'speaking' 
  | 'evaluating' 
  | 'waiting' 
  | 'disconnected' 
  | 'reconnecting';

interface InterviewStatusProps {
  state: AIState;
}

export function InterviewStatus({ state }: InterviewStatusProps) {
  const getStateDetails = (state: AIState) => {
    switch (state) {
      case 'listening': return { icon: '🎧', color: 'var(--info)', text: 'Listening', animation: 'animate-pulse' };
      case 'thinking': return { icon: '🧠', color: 'var(--warning)', text: 'Thinking', animation: 'animate-bounce' };
      case 'generating': return { icon: '⚙️', color: 'var(--accent-color)', text: 'Generating Question', animation: 'animate-spin' };
      case 'speaking': return { icon: '💬', color: 'var(--success)', text: 'Speaking', animation: 'animate-pulse' };
      case 'evaluating': return { icon: '📊', color: 'var(--accent-color)', text: 'Evaluating Answer', animation: 'animate-pulse' };
      case 'waiting': return { icon: '⏳', color: 'var(--text-secondary)', text: 'Waiting for Candidate', animation: '' };
      case 'disconnected': return { icon: '❌', color: 'var(--error)', text: 'Disconnected', animation: '' };
      case 'reconnecting': return { icon: '🔄', color: 'var(--error)', text: 'Reconnecting', animation: 'animate-spin' };
      case 'idle':
      default: return { icon: '💤', color: 'var(--text-secondary)', text: 'Idle', animation: '' };
    }
  };

  const details = getStateDetails(state);

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      borderRadius: '20px',
      background: 'var(--bg-secondary)',
      border: `1px solid ${details.color}40`, // 40 is hex for 25% opacity
    }}>
      <span className={details.animation} style={{ display: 'inline-block', fontSize: '14px' }}>
        {details.icon}
      </span>
      <span style={{ fontSize: 'var(--text-xs)', color: details.color, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {details.text}
      </span>
    </div>
  );
}
