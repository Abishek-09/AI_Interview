"use client";
import React from 'react';
import { CandidateTable } from '@/components/recruiter/CandidateTable';

export default function CandidatesPage() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-2)' }}>Candidates Directory</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage and review all candidates across active requisitions.</p>
      </div>

      <CandidateTable />
    </div>
  );
}
