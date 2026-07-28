"use client";
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Play, Send, RotateCcw, Square, Trash2 } from 'lucide-react';

interface ExecutionPanelProps {
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  onStop: () => void;
  isExecuting: boolean;
  isSubmitted: boolean;
  executionStatus: 'Idle' | 'Running' | 'Completed' | 'Failed' | 'Timeout';
}

export function ExecutionPanel({
  onRun, onSubmit, onReset, onStop, isExecuting, isSubmitted, executionStatus
}: ExecutionPanelProps) {
  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
      {isExecuting ? (
        <Button variant="outline" size="sm" onClick={onStop} style={{ color: 'var(--error)' }}>
          <Square size={14} style={{ marginRight: '6px' }} /> Stop
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={onRun} disabled={isSubmitted} style={{ color: 'var(--success)' }}>
          <Play size={14} style={{ marginRight: '6px' }} /> Run Code
        </Button>
      )}

      <Button variant="ghost" size="sm" onClick={onReset} disabled={isExecuting || isSubmitted}>
        <RotateCcw size={14} style={{ marginRight: '6px' }} /> Reset
      </Button>
      
      <Button variant="primary" size="sm" onClick={onSubmit} disabled={isExecuting || isSubmitted}>
        <Send size={14} style={{ marginRight: '6px' }} /> {isSubmitted ? 'Submitted' : 'Submit'}
      </Button>

      {/* Status Badge */}
      <div style={{ marginLeft: 'var(--spacing-2)', fontSize: 'var(--text-xs)', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
         <span style={{ 
           width: '8px', height: '8px', borderRadius: '50%', 
           backgroundColor: executionStatus === 'Running' ? 'var(--warning)' : 
                            executionStatus === 'Completed' ? 'var(--success)' : 
                            executionStatus === 'Idle' ? 'var(--text-muted)' : 'var(--error)' 
         }}></span>
         {executionStatus}
      </div>
    </div>
  );
}
