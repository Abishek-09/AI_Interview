"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Oct 01', Technical: 72, Behavioral: 85 },
  { date: 'Oct 05', Technical: 74, Behavioral: 82 },
  { date: 'Oct 10', Technical: 78, Behavioral: 88 },
  { date: 'Oct 15', Technical: 75, Behavioral: 84 },
  { date: 'Oct 20', Technical: 82, Behavioral: 89 },
  { date: 'Oct 25', Technical: 85, Behavioral: 92 },
  { date: 'Oct 30', Technical: 88, Behavioral: 90 },
];

export function TrendLineChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
          <Legend wrapperStyle={{ color: 'var(--text-primary)' }} />
          <Line type="monotone" dataKey="Technical" stroke="var(--accent-color)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Behavioral" stroke="var(--info)" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
