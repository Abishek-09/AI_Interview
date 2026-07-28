import React, { useState } from 'react';
import { Message } from './ConversationUI';
import { useToast } from '../ui/ToastProvider';

interface LiveTranscriptProps {
  messages: Message[];
}

export function LiveTranscript({ messages }: LiveTranscriptProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();

  const filteredMessages = messages.filter(msg => 
    msg.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = () => {
    const text = messages.map(m => `[${m.role.toUpperCase()}] ${m.text}`).join('\n\n');
    navigator.clipboard.writeText(text);
    addToast('Transcript copied to clipboard', 'success');
  };

  const handleExport = () => {
    const text = messages.map(m => `[${m.role.toUpperCase()}] ${m.text}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_transcript_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Transcript exported', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: 'var(--spacing-3) var(--spacing-4)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-panel)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>Live Transcript</h3>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <button onClick={handleCopy} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }} title="Copy">📋</button>
          <button onClick={handleExport} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }} title="Export">💾</button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: 'var(--spacing-2) var(--spacing-4)', borderBottom: '1px solid var(--border-color)' }}>
        <input 
          type="text" 
          placeholder="Search transcript..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-panel)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)' }}
        />
      </div>

      {/* Transcript List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        {filteredMessages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--spacing-4)' }}>
            No transcript available yet.
          </div>
        ) : (
          filteredMessages.map((msg, idx) => {
            const isLatest = idx === filteredMessages.length - 1 && searchTerm === '';
            return (
              <div key={idx} style={{ 
                padding: 'var(--spacing-2) var(--spacing-3)', 
                borderRadius: 'var(--radius-md)', 
                background: isLatest ? 'rgba(var(--accent-color-rgb), 0.1)' : 'transparent',
                borderLeft: isLatest ? '2px solid var(--accent-color)' : '2px solid transparent'
              }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px', display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ color: msg.role === 'agent' ? 'var(--accent-color)' : 'var(--text-primary)' }}>
                    {msg.role === 'agent' ? 'Interviewer' : 'You'}
                  </strong>
                  <span>{msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
