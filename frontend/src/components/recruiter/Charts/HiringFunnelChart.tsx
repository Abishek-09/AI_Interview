"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { stage: 'Applied', count: 1200 },
  { stage: 'Screened', count: 850 },
  { stage: 'Interviewed', count: 420 },
  { stage: 'Selected', count: 115 },
  { stage: 'Hired', count: 45 },
];

export function HiringFunnelChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="stage" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            itemStyle={{ color: 'var(--accent-color)' }}
          />
          <Area type="monotone" dataKey="count" stroke="var(--accent-color)" fillOpacity={1} fill="url(#colorCount)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
