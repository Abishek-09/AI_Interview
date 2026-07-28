import React from 'react';

interface AIInterviewCardProps {
  name: string;
  role: string;
  isConnected: boolean;
  round: string;
  questionCount: number;
  totalQuestions: number;
  timeRemaining: number;
  onEndInterview: () => void;
}

export function AIInterviewCard({
  name,
  role,
  isConnected,
  round,
  questionCount,
  totalQuestions,
  timeRemaining,
  onEndInterview
}: AIInterviewCardProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--spacing-4) var(--spacing-6)',
      background: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-color), #8a2be2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 'var(--text-xl)', border: '2px solid transparent'
          }}>
            🤖
          </div>
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px',
            borderRadius: '50%', background: isConnected ? 'var(--success)' : 'var(--error)',
            border: '2px solid var(--bg-panel)'
          }}></div>
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>{name}</h2>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            {role} &bull; <span style={{ color: isConnected ? 'var(--success)' : 'var(--error)' }}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Round</div>
          <div style={{ fontWeight: 'bold' }}>{round}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Question</div>
          <div style={{ fontWeight: 'bold' }}>{questionCount} / {totalQuestions}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Time Remaining</div>
          <div style={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: 'var(--text-lg)', color: timeRemaining < 300 ? 'var(--error)' : 'inherit' }}>
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      <button 
        onClick={onEndInterview}
        style={{
          background: 'var(--error)', color: 'white', border: 'none',
          padding: '8px 16px', borderRadius: 'var(--radius-md)',
          fontWeight: 'bold', cursor: 'pointer',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = '#d32f2f')}
        onMouseOut={(e) => (e.currentTarget.style.background = 'var(--error)')}
      >
        End Interview
      </button>
    </div>
  );
}
