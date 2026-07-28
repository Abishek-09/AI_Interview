"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, XCircle, Clock, Cpu } from 'lucide-react';

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  isHidden: boolean;
  executionTimeMs?: number;
  memoryMb?: number;
}

interface TestCasesPanelProps {
  testCases: TestCase[];
  isRunning: boolean;
}

export function TestCasesPanel({ testCases, isRunning }: TestCasesPanelProps) {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(testCases[0]?.id);

  const selectedCase = testCases.find(tc => tc.id === selectedTestCaseId);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Test Case List */}
      <div style={{ width: '200px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', overflowY: 'auto', backgroundColor: 'var(--bg-secondary)' }}>
        {testCases.map((tc, index) => (
          <div 
            key={tc.id} 
            onClick={() => setSelectedTestCaseId(tc.id)}
            style={{ 
              padding: '12px var(--spacing-3)', 
              cursor: 'pointer', 
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: tc.id === selectedTestCaseId ? 'var(--bg-panel)' : 'transparent',
              borderLeft: tc.id === selectedTestCaseId ? '3px solid var(--accent-color)' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            className="hover-bg"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: tc.id === selectedTestCaseId ? 600 : 'normal' }}>
                Case {index + 1}
              </span>
              {tc.isHidden && <Badge variant="default" style={{ fontSize: '10px' }}>Hidden</Badge>}
            </div>
            {tc.passed !== undefined && (
              tc.passed ? <CheckCircle2 size={16} color="var(--success)" /> : <XCircle size={16} color="var(--error)" />
            )}
          </div>
        ))}
      </div>

      {/* Test Case Details */}
      <div style={{ flex: 1, padding: 'var(--spacing-4)', overflowY: 'auto' }}>
        {isRunning ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
             Running test cases...
          </div>
        ) : selectedCase ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>{selectedCase.name}</h3>
              {selectedCase.executionTimeMs !== undefined && (
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> {selectedCase.executionTimeMs}ms</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Cpu size={12}/> {selectedCase.memoryMb}MB</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>Input</span>
              <pre style={{ margin: 0, padding: 'var(--spacing-3)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', border: '1px solid var(--border-color)', fontFamily: 'monospace' }}>
                {selectedCase.isHidden ? 'Hidden test case input' : selectedCase.input}
              </pre>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>Expected Output</span>
                <pre style={{ margin: 0, padding: 'var(--spacing-3)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', border: '1px solid var(--border-color)', fontFamily: 'monospace' }}>
                  {selectedCase.isHidden ? 'Hidden' : selectedCase.expectedOutput}
                </pre>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>Actual Output</span>
                <pre style={{ margin: 0, padding: 'var(--spacing-3)', backgroundColor: selectedCase.passed === false ? 'color-mix(in srgb, var(--error) 10%, transparent)' : 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', border: selectedCase.passed === false ? '1px solid var(--error)' : '1px solid var(--border-color)', fontFamily: 'monospace' }}>
                  {selectedCase.actualOutput || 'Not run yet'}
                </pre>
              </div>
            </div>

          </div>
        ) : (
           <div style={{ color: 'var(--text-muted)' }}>Select a test case to view details</div>
        )}
      </div>
    </div>
  );
}
