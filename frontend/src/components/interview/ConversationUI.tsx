import React, { useEffect, useRef } from 'react';

export type Message = {
  role: 'agent' | 'candidate';
  text: string;
  timestamp?: Date;
};

interface ConversationUIProps {
  messages: Message[];
  isThinking: boolean;
  onReplayAudio?: (text: string) => void;
}

export function ConversationUI({ messages, isThinking, onReplayAudio }: ConversationUIProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <div style={{ flex: 1, padding: 'var(--spacing-4)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      {messages.length === 0 && (
        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: 'var(--spacing-8)' }}>
          Initializing interview protocol...
        </div>
      )}
      
      {messages.map((msg, i) => (
        <div key={i} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'candidate' ? 'flex-end' : 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--spacing-2)', flexDirection: msg.role === 'candidate' ? 'row-reverse' : 'row', maxWidth: '85%' }}>
            
            {/* Avatar */}
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: msg.role === 'candidate' ? 'var(--accent-color)' : 'linear-gradient(135deg, var(--accent-color), #8a2be2)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '14px', flexShrink: 0, color: 'white', fontWeight: 'bold' 
            }}>
              {msg.role === 'candidate' ? 'C' : '🤖'}
            </div>
            
            {/* Message Bubble */}
            <div style={{ 
              background: msg.role === 'candidate' ? 'var(--accent-color)' : 'var(--bg-panel)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
              borderBottomRightRadius: msg.role === 'candidate' ? '4px' : 'var(--radius-lg)',
              borderBottomLeftRadius: msg.role === 'agent' ? '4px' : 'var(--radius-lg)',
              border: msg.role === 'agent' ? '1px solid transparent' : 'none',
              backgroundClip: msg.role === 'agent' ? 'padding-box' : 'border-box',
              position: 'relative',
              color: msg.role === 'candidate' ? '#ffffff' : 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)',
              fontSize: 'var(--text-sm)',
              lineHeight: '1.6'
            }}>
              {/* Gradient border for AI via pseudo-element simulation (inline-styles are limited here, so relying on parent border and standard CSS classes would be better, but we do our best) */}
              {msg.role === 'agent' && (
                <div style={{ position: 'absolute', inset: '-1px', background: 'linear-gradient(135deg, var(--accent-color), #8a2be2)', zIndex: -1, borderRadius: 'var(--radius-lg)', borderBottomLeftRadius: '4px' }}></div>
              )}
              
              {msg.text}
              
              {msg.role === 'agent' && onReplayAudio && (
                <button 
                  onClick={() => onReplayAudio(msg.text)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'var(--spacing-2)', opacity: 0.6, fontSize: '12px' }} 
                  title="Replay Audio"
                  aria-label="Replay Audio"
                >
                  🔊
                </button>
              )}
              
              {msg.role === 'candidate' && (
                <span style={{ marginLeft: '8px', fontSize: '10px', opacity: 0.8 }}>✓</span>
              )}
            </div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', padding: msg.role === 'candidate' ? '0 42px 0 0' : '0 0 0 42px' }}>
            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
          </div>
        </div>
      ))}

      {isThinking && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--spacing-2)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-color), #8a2be2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0, color: 'white', fontWeight: 'bold' }}>
              🤖
            </div>
            <div style={{ position: 'relative', background: 'var(--bg-panel)', padding: '12px 16px', borderRadius: 'var(--radius-lg)', borderBottomLeftRadius: '4px' }}>
               <div style={{ position: 'absolute', inset: '-1px', background: 'linear-gradient(135deg, var(--accent-color), #8a2be2)', zIndex: -1, borderRadius: 'var(--radius-lg)', borderBottomLeftRadius: '4px' }}></div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <div className="typing-indicator" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                   <div className="typing-dot"></div>
                   <div className="typing-dot"></div>
                   <div className="typing-dot"></div>
                 </div>
                 <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Analyzing your response...</span>
               </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
