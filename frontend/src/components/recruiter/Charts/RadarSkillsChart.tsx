"use client";
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { subject: 'React', score: 95, average: 75, fullMark: 100 },
  { subject: 'TypeScript', score: 90, average: 80, fullMark: 100 },
  { subject: 'System Design', score: 85, average: 70, fullMark: 100 },
  { subject: 'Communication', score: 98, average: 85, fullMark: 100 },
  { subject: 'Problem Solving', score: 92, average: 78, fullMark: 100 },
  { subject: 'CSS/UI', score: 88, average: 75, fullMark: 100 },
];

export function RadarSkillsChart() {
  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="var(--border-color)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Candidate" dataKey="score" stroke="var(--accent-color)" fill="var(--accent-color)" fillOpacity={0.5} />
          <Radar name="Average" dataKey="average" stroke="var(--text-muted)" fill="var(--text-muted)" fillOpacity={0.2} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
