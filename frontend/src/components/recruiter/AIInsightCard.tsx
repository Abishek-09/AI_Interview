"use client";
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Lightbulb, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AIInsightCardProps {
  type: 'strength' | 'weakness' | 'risk' | 'recommendation';
  title: string;
  points: string[];
}

export function AIInsightCard({ type, title, points }: AIInsightCardProps) {
  const config = {
    strength: {
      icon: <Lightbulb size={20} />,
      color: 'var(--success)',
      bg: 'var(--success-bg)',
      border: 'var(--success)'
    },
    weakness: {
      icon: <AlertTriangle size={20} />,
      color: 'var(--warning)',
      bg: 'var(--warning-bg)',
      border: 'var(--warning)'
    },
    risk: {
      icon: <ShieldAlert size={20} />,
      color: 'var(--error)',
      bg: 'var(--error-bg)',
      border: 'var(--error)'
    },
    recommendation: {
      icon: <CheckCircle2 size={20} />,
      color: 'var(--accent-color)',
      bg: 'var(--accent-glow)',
      border: 'var(--accent-color)'
    }
  }[type];

  return (
    <div style={{
      border: `1px solid ${config.border}40`,
      backgroundColor: `color-mix(in srgb, ${config.bg} 30%, transparent)`,
      borderRadius: 'var(--radius-md)',
      padding: 'var(--spacing-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: config.color, fontWeight: 'bold' }}>
        {config.icon}
        <span>{title}</span>
      </div>
      <ul style={{ margin: 0, paddingLeft: 'var(--spacing-5)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
