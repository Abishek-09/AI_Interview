"use client";
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AIInsightCard } from '@/components/recruiter/AIInsightCard';
import { RadarSkillsChart } from '@/components/recruiter/Charts/RadarSkillsChart';
import { Download, Printer, PlayCircle, ExternalLink, Calendar, MapPin, Mail, Phone, Briefcase } from 'lucide-react';

export default function CandidateDetailsPage({ params }: { params: { id: string } }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in print-container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      
      {/* Header Actions */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Button variant="ghost" onClick={() => window.history.back()} style={{ marginBottom: 'var(--spacing-2)' }}>← Back to Candidates</Button>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button variant="outline"><PlayCircle size={16} style={{ marginRight: '8px' }} /> Replay Interview</Button>
          <Button variant="outline" onClick={handlePrint}><Printer size={16} style={{ marginRight: '8px' }} /> Print / PDF</Button>
          <Button variant="primary"><Download size={16} style={{ marginRight: '8px' }} /> Export Report</Button>
        </div>
      </div>

      {/* Candidate Header */}
      <Card padding="lg" style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
          AS
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', margin: 0 }}>Alice Smith</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', marginTop: '4px' }}>Senior Frontend Engineer</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Overall Score</div>
              <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'bold', color: 'var(--success)' }}>92/100</div>
              <Badge variant="success" style={{ marginTop: 'var(--spacing-2)' }}>Strong Hire</Badge>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> alice.smith@example.com</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14} /> +1 (555) 123-4567</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> San Francisco, CA</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={14} /> 6 YOE</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> Oct 24, 2026</span>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-6)' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          
          {/* AI Evaluation */}
          <Card padding="lg">
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>AI Evaluation Summary</h2>
            <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 'var(--spacing-6)' }}>
              Alice demonstrated exceptional mastery over modern React paradigms. She was able to quickly diagnose the buggy component provided in the technical challenge and refactored it using custom hooks and memoization. Her communication was extremely clear and she naturally articulated tradeoffs between different architectural approaches. She showed deep knowledge of Next.js routing and server components. Highly recommended for the Senior position.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <AIInsightCard 
                type="strength" 
                title="Top Strengths" 
                points={[
                  "Deep understanding of React concurrency",
                  "Excellent systemic debugging skills",
                  "Clear, proactive communication"
                ]} 
              />
              <AIInsightCard 
                type="weakness" 
                title="Areas for Improvement" 
                points={[
                  "Slightly hesitant on CI/CD specifics",
                  "CSS-in-JS knowledge is a bit dated"
                ]} 
              />
            </div>
            
            <div style={{ marginTop: 'var(--spacing-4)' }}>
               <AIInsightCard 
                  type="recommendation" 
                  title="Final Verdict: Strong Hire" 
                  points={[
                    "Candidate is fully aligned with the technical requirements of the role.",
                    "Demonstrates the leadership qualities expected of a Senior Engineer."
                  ]} 
                />
            </div>
          </Card>

          {/* Interview Timeline */}
          <Card padding="lg">
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Interview Transcript</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                <div style={{ width: '40px', color: 'var(--accent-color)', fontWeight: 'bold' }}>AI</div>
                <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)' }}>
                  Welcome Alice. Let's start by discussing a time you had to optimize a particularly slow React application.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                <div style={{ width: '40px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Alice</div>
                <div style={{ flex: 1, padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  Absolutely. In my previous role at TechCorp, our main dashboard was taking over 4 seconds to render. I profiled the app using React DevTools and identified that a large data table was causing unnecessary re-renders across the entire component tree...
                </div>
              </div>
              {/* More transcript... */}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          
          {/* Skills Breakdown */}
          <Card padding="lg">
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Competency Breakdown</h2>
            <RadarSkillsChart />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: 'var(--text-sm)' }}>
                  <span>Technical Knowledge</span>
                  <span style={{ fontWeight: 'bold' }}>95%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px' }}>
                  <div style={{ width: '95%', height: '100%', backgroundColor: 'var(--success)', borderRadius: '3px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: 'var(--text-sm)' }}>
                  <span>Problem Solving</span>
                  <span style={{ fontWeight: 'bold' }}>88%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px' }}>
                  <div style={{ width: '88%', height: '100%', backgroundColor: 'var(--success)', borderRadius: '3px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: 'var(--text-sm)' }}>
                  <span>Communication</span>
                  <span style={{ fontWeight: 'bold' }}>92%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px' }}>
                  <div style={{ width: '92%', height: '100%', backgroundColor: 'var(--success)', borderRadius: '3px' }}></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Info */}
          <Card padding="lg">
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Resume Highlights</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Briefcase size={16} color="var(--text-muted)" />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>Senior Frontend Engineer</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>TechCorp Inc. (2022 - Present)</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Briefcase size={16} color="var(--text-muted)" />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>Frontend Developer</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>StartupJS (2019 - 2022)</div>
                </div>
              </div>
            </div>
            <Button variant="outline" style={{ width: '100%', marginTop: 'var(--spacing-4)' }}><ExternalLink size={14} style={{ marginRight: '8px' }}/> View Full Resume</Button>
          </Card>

        </div>
      </div>
    </div>
  );
}
