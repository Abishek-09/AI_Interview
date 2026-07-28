import React from 'react';
import { Button } from '@/components/ui/Button';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 'var(--spacing-8)' }}>
      <div className="animate-fade-in" style={{ 
        maxWidth: '600px', 
        width: '100%',
        background: 'var(--bg-panel)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: 'var(--spacing-8)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-2)' }}>🤝</div>
          <h2 style={{ fontSize: 'var(--text-2xl)', margin: 0 }}>Welcome to Your Interview</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Senior AI Technical Interview</p>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-6)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--spacing-3)', color: 'var(--text-primary)' }}>System Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)' }}>
               <span style={{ color: 'var(--success)' }}>●</span> Resume Analyzed
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)' }}>
               <span style={{ color: 'var(--success)' }}>●</span> Audio System Ready
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)' }}>
               <span style={{ color: 'var(--success)' }}>●</span> Code Sandbox Ready
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)' }}>
               <span style={{ color: 'var(--success)' }}>●</span> Network Stable
             </div>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--spacing-8)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--spacing-3)', color: 'var(--text-primary)' }}>Important Guidelines</h3>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
            <li>Estimated duration is <strong>45 minutes</strong>.</li>
            <li>Use the <strong>Push-to-Talk</strong> microphone button to speak your answers naturally.</li>
            <li>You can use the built-in IDE for coding questions. Remember to <strong>Run Code</strong> before submitting.</li>
            <li>If you need time to think, simply tell the AI interviewer.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="primary" size="lg" onClick={onStart}>
            I'm Ready — Start Interview
          </Button>
        </div>
      </div>
    </div>
  );
}
