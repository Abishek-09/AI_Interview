import React from 'react';

interface ProgressMetricsProps {
  metrics: {
    communication: number;
    problemSolving: number;
    technical: number;
    confidence: number;
    coding: number;
  };
  overallScore: number;
  questionCount: number;
  totalQuestions: number;
}

export function ProgressMetrics({ metrics, overallScore, questionCount, totalQuestions }: ProgressMetricsProps) {
  const getScoreColor = (score: number) => 
    score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--error)';

  const overallProgress = (questionCount / totalQuestions) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      
      {/* Overall Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>Interview Progress</h3>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>{Math.round(overallProgress)}%</span>
        </div>
        <div className="metric-bar-bg" style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
          <div className="metric-fill" style={{ width: `${overallProgress}%`, backgroundColor: 'var(--info)', height: '100%', transition: 'width 0.5s ease' }}></div>
        </div>
      </div>

      {/* AI Confidence / Live Analytics */}
      <div>
        <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-3)' }}>AI Confidence Metrics</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {[
            { label: 'Technical Evaluation', value: metrics.technical },
            { label: 'Problem Solving', value: metrics.problemSolving },
            { label: 'Coding Ability', value: metrics.coding },
            { label: 'Communication', value: metrics.communication },
            { label: 'Conversation Context', value: metrics.confidence }
          ].map((m, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span>{m.label}</span>
                <span style={{ color: getScoreColor(m.value), fontWeight: 'bold' }}>{m.value}%</span>
              </div>
              <div style={{ height: '4px', background: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${m.value}%`, backgroundColor: getScoreColor(m.value), height: '100%', transition: 'width 0.5s ease' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
