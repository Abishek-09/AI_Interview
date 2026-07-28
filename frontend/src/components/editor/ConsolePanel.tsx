"use client";
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Copy, Trash2, Download } from 'lucide-react';

interface ConsolePanelProps {
  logs: string[];
  onClear: () => void;
  isRunning: boolean;
}

export function ConsolePanel({ logs, onClear, isRunning }: ConsolePanelProps) {
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom on new logs
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isRunning]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(logs.join('\n'));
  };

  const downloadLogs = () => {
    const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'console_logs.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--bg-panel)' }}>
      {/* Console Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 16px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', gap: 'var(--spacing-2)' }}>
        <Button variant="ghost" size="sm" onClick={copyToClipboard} title="Copy to clipboard"><Copy size={14} /></Button>
        <Button variant="ghost" size="sm" onClick={downloadLogs} title="Download logs"><Download size={14} /></Button>
        <Button variant="ghost" size="sm" onClick={onClear} title="Clear console"><Trash2 size={14} /></Button>
      </div>
      
      {/* Console Output */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-4)', fontFamily: 'monospace', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
        {logs.length === 0 && !isRunning && (
          <div style={{ color: 'var(--text-muted)' }}>Run your code to see output here.</div>
        )}
        
        {logs.map((log, i) => (
          <div key={i} style={{ 
            marginBottom: '4px',
            color: log.toLowerCase().includes('error') || log.toLowerCase().includes('exception') ? 'var(--error)' : 
                   log.toLowerCase().includes('warn') ? 'var(--warning)' : 'inherit',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {log}
          </div>
        ))}

        {isRunning && (
          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span className="animate-spin" style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid var(--text-muted)', borderRightColor: 'transparent', borderRadius: '50%' }}></span>
            Executing code in secure sandbox...
          </div>
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
}
