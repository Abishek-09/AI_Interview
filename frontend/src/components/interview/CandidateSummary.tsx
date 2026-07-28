import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';

interface CandidateSummaryProps {
  id: string;
  name?: string;
  targetRole?: string;
}

export function CandidateSummary({ id, name = 'Candidate', targetRole = 'Senior AI Engineer' }: CandidateSummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={{ background: 'var(--bg-panel)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ padding: 'var(--spacing-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'var(--bg-secondary)' }}
      >
        <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0 }}>Candidate Profile</h3>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{isCollapsed ? '▼ Expand' : '▲ Collapse'}</span>
      </div>

      {!isCollapsed && (
        <div style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {name.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>{name}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>ID: {id}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Target Role:</span>
              <span style={{ fontWeight: 'bold' }}>{targetRole}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Experience:</span>
              <span style={{ fontWeight: 'bold' }}>5+ Years</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Difficulty:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--warning)' }}>Advanced</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Skills Context</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              <Badge variant="success">React</Badge>
              <Badge variant="success">TypeScript</Badge>
              <Badge variant="success">Python</Badge>
              <Badge variant="neutral">LLMs</Badge>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--spacing-3)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>System State</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Badge variant="success">Resume Parsed</Badge>
               <Badge variant="success">RAG Active</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
