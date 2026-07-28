"use client";
import { Card } from '@/components/ui/Card';
import { Users, UserCheck, Clock, BrainCircuit, Calendar, TrendingUp } from 'lucide-react';

function KPICard({ title, value, icon, trend, trendLabel, color = 'var(--accent-color)' }: { title: string, value: string, icon: React.ReactNode, trend: string, trendLabel: string, color?: string }) {
  return (
    <Card padding="md" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1, color: color, transform: 'scale(2)' }}>
        {icon}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>{title}</div>
        <div style={{ color: color, background: `color-mix(in srgb, ${color} 15%, transparent)`, padding: '8px', borderRadius: 'var(--radius-md)' }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-2)' }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--text-xs)' }}>
        <span style={{ color: trend.startsWith('+') ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>{trend}</span>
        <span style={{ color: 'var(--text-muted)' }}>{trendLabel}</span>
      </div>
    </Card>
  );
}

export default function RecruiterDashboardHome() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-2)' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back. Here is what's happening with your hiring pipeline today.</p>
      </div>
      
      {/* Top KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-6)' }}>
        <KPICard 
          title="Total Candidates" 
          value="1,248" 
          icon={<Users size={24} />} 
          trend="+12%" 
          trendLabel="vs last month"
          color="var(--accent-color)"
        />
        <KPICard 
          title="Interviews Today" 
          value="24" 
          icon={<Calendar size={24} />} 
          trend="+4" 
          trendLabel="vs yesterday"
          color="var(--info)"
        />
        <KPICard 
          title="Average Score" 
          value="76/100" 
          icon={<TrendingUp size={24} />} 
          trend="+2.4%" 
          trendLabel="vs last month"
          color="var(--success)"
        />
        <KPICard 
          title="AI Confidence" 
          value="94%" 
          icon={<BrainCircuit size={24} />} 
          trend="+0.8%" 
          trendLabel="accuracy score"
          color="#8a2be2"
        />
      </div>

      {/* Mini Activity Section (Placeholder until Analytics Page) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-6)' }}>
        <Card padding="lg">
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Recent Interviews</h2>
          <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            (Mini Chart / Table - View Candidates tab for details)
          </div>
        </Card>

        <Card padding="lg">
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Upcoming Today</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            {[
              { time: '10:00 AM', name: 'Alice Smith', role: 'Frontend Engineer' },
              { time: '01:30 PM', name: 'Bob Johnson', role: 'Data Scientist' },
              { time: '03:00 PM', name: 'Charlie Davis', role: 'Product Manager' },
            ].map((meeting, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', minWidth: '70px' }}>
                  {meeting.time}
                </div>
                <div style={{ width: '4px', height: '40px', backgroundColor: 'var(--accent-color)', borderRadius: '4px' }}></div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>{meeting.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{meeting.role}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
