"use client";
import React from 'react';
import { Card } from '@/components/ui/Card';
import { HiringFunnelChart } from '@/components/recruiter/Charts/HiringFunnelChart';
import { RadarSkillsChart } from '@/components/recruiter/Charts/RadarSkillsChart';
import { TrendLineChart } from '@/components/recruiter/Charts/TrendLineChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const diffData = [
    { name: 'Easy', count: 120 },
    { name: 'Medium', count: 450 },
    { name: 'Hard', count: 210 },
    { name: 'Expert', count: 45 }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-2)' }}>Analytics & Insights</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Deep dive into your hiring funnel and candidate performance metrics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-6)' }}>
        <Card padding="lg">
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Hiring Funnel</h2>
          <HiringFunnelChart />
        </Card>

        <Card padding="lg">
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Skills Radar (Avg)</h2>
          <RadarSkillsChart />
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
        <Card padding="lg">
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Score Trends (Last 30 Days)</h2>
          <TrendLineChart />
        </Card>

        <Card padding="lg">
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Question Difficulty Distribution</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={diffData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  cursor={{ fill: 'var(--bg-secondary)' }}
                />
                <Bar dataKey="count" fill="var(--info)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
