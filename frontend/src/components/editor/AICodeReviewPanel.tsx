"use client";
import React from 'react';
import { Card } from '@/components/ui/Card';
import { AIInsightCard } from '@/components/recruiter/AIInsightCard';
import { BrainCircuit, Star, Zap, Code2, ShieldAlert } from 'lucide-react';

interface AICodeReviewPanelProps {
  isEvaluating: boolean;
  score?: number;
  suggestions?: string[];
  strengths?: string[];
  weaknesses?: string[];
  refactoredCode?: string;
}

export function AICodeReviewPanel({ 
  isEvaluating, score, suggestions, strengths, weaknesses, refactoredCode 
}: AICodeReviewPanelProps) {
  
  if (isEvaluating) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: 'var(--spacing-4)' }}>
        <div className="animate-pulse">
          <BrainCircuit size={48} color="var(--accent-color)" />
        </div>
        <p>AI is analyzing your submission for time complexity, style, and edge cases...</p>
      </div>
    );
  }

  if (!score) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Submit your code to receive an automated AI review.
      </div>
    );
  }

  return (
    <div style={{ height: '100%', padding: 'var(--spacing-6)', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BrainCircuit size={24} color="var(--accent-color)" />
            AI Code Review
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Automated analysis of your submitted solution.</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Quality Score</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: score >= 85 ? 'var(--success)' : score >= 70 ? 'var(--warning)' : 'var(--error)' }}>
            {score}/100
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-6)' }}>
        <AIInsightCard 
          type="strength"
          title="Strengths"
          points={strengths || ['Good naming conventions', 'Handles basic edge cases']}
        />
        <AIInsightCard 
          type="weakness"
          title="Areas for Improvement"
          points={weaknesses || ['O(N^2) time complexity is sub-optimal', 'Missing null checks']}
        />
      </div>

      <Card padding="lg" style={{ marginBottom: 'var(--spacing-6)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={20} color="var(--warning)" />
          Optimization Suggestions
        </h3>
        <ul style={{ paddingLeft: 'var(--spacing-5)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {suggestions?.map((s, i) => (
            <li key={i} style={{ marginBottom: '8px' }}>{s}</li>
          ))}
        </ul>
      </Card>

      {refactoredCode && (
        <Card padding="lg">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code2 size={20} color="var(--accent-color)" />
            Refactored Solution (O(N))
          </h3>
          <pre style={{ backgroundColor: 'var(--bg-secondary)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto', fontFamily: 'monospace', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
            {refactoredCode}
          </pre>
        </Card>
      )}
    </div>
  );
}
