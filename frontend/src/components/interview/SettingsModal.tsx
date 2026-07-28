"use client";
import React from 'react';
import { Button } from '@/components/ui/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  speechSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  availableVoices,
  selectedVoice,
  onVoiceChange,
  speechSpeed,
  onSpeedChange
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '500px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>Studio Settings</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
        </div>

        <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
          
          {/* AI Voice Selection */}
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '8px' }}>AI Interviewer Voice</label>
            <select 
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const v = availableVoices.find(voice => voice.name === e.target.value);
                if (v) onVoiceChange(v);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}
            >
              {availableVoices.map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          {/* AI Speech Speed */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Speaking Rate</label>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{speechSpeed}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" max="2" step="0.1" 
              value={speechSpeed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>Slow</span>
                <span>Fast</span>
            </div>
          </div>

          {/* Device Selection Mock (Browser relies on OS mostly for displayMedia unless explicitly requested via deviceIds which we can add later) */}
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '8px' }}>Camera / Mic / Screen</label>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }}>
              Your browser manages hardware selection. Make sure permissions are granted in the URL bar. Noise suppression and Echo Cancellation are automatically applied.
            </div>
          </div>

        </div>

        <div style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
          <Button variant="primary" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
}
