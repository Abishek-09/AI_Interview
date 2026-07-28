"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Search, Filter, ChevronDown, ChevronUp, Download, Eye, FileText } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface Candidate {
  id: string;
  name: string;
  role: string;
  status: 'Passed' | 'Failed' | 'In Progress' | 'Pending Review';
  score: number;
  date: string;
  experience: string;
}

const mockCandidates: Candidate[] = Array.from({ length: 50 }, (_, i) => ({
  id: `cnd-${i}`,
  name: `Candidate ${i + 1}`,
  role: i % 3 === 0 ? 'Data Scientist' : i % 2 === 0 ? 'Backend Engineer' : 'Frontend Engineer',
  status: i % 5 === 0 ? 'Failed' : i % 4 === 0 ? 'In Progress' : i % 3 === 0 ? 'Pending Review' : 'Passed',
  score: Math.floor(Math.random() * 40) + 60,
  date: `Oct ${Math.floor(Math.random() * 30) + 1}, 2026`,
  experience: `${Math.floor(Math.random() * 8) + 1} years`,
}));

export function CandidateTable() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof Candidate>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof Candidate) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredData = useMemo(() => {
    let data = mockCandidates.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.role.toLowerCase().includes(search.toLowerCase())
    );

    data.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [search, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const exportCSV = () => {
    const headers = ['ID,Name,Role,Status,Score,Date,Experience'];
    const rows = filteredData.map(c => `${c.id},${c.name},${c.role},${c.status},${c.score},${c.date},${c.experience}`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "candidates_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', width: '100%' }}>
      
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <Input 
            type="text" 
            placeholder="Search candidates or roles..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button variant="outline"><Filter size={16} style={{ marginRight: '8px' }} /> Filter</Button>
          <Button variant="primary" onClick={exportCSV}><Download size={16} style={{ marginRight: '8px' }} /> Export CSV</Button>
        </div>
      </div>

      {/* Data Grid */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface)' }}>
        <table className="data-table" style={{ minWidth: '800px' }}>
          <thead style={{ backgroundColor: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 10 }}>
            <tr>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Candidate {sortField === 'name' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>
                Role {sortField === 'role' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th>Experience</th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                Status {sortField === 'status' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th onClick={() => handleSort('score')} style={{ cursor: 'pointer' }}>
                Score {sortField === 'score' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                Date {sortField === 'date' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th style={{ textAlign: 'right', position: 'sticky', right: 0, backgroundColor: 'var(--bg-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--text-muted)' }}>
                  No candidates found matching your search.
                </td>
              </tr>
            ) : (
              paginatedData.map((candidate) => (
                <tr key={candidate.id} style={{ transition: 'background-color 0.2s' }}>
                  <td style={{ fontWeight: 600 }}>{candidate.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{candidate.role}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{candidate.experience}</td>
                  <td>
                    <Badge variant={candidate.status === 'Passed' ? 'success' : candidate.status === 'Failed' ? 'error' : candidate.status === 'In Progress' ? 'info' : 'warning'}>
                      {candidate.status}
                    </Badge>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${candidate.score}%`, height: '100%', backgroundColor: candidate.score > 80 ? 'var(--success)' : candidate.score > 60 ? 'var(--warning)' : 'var(--error)' }}></div>
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{candidate.score}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{candidate.date}</td>
                  <td style={{ textAlign: 'right', position: 'sticky', right: 0, backgroundColor: 'var(--bg-surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-2)' }}>
                      <Link href={`/recruiter/candidates/${candidate.id}`}>
                        <Button variant="ghost" size="sm" title="View Profile"><Eye size={16} /></Button>
                      </Link>
                      <Button variant="ghost" size="sm" title="Resume"><FileText size={16} /></Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-2)' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length} candidates
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 var(--spacing-3)', fontWeight: 500 }}>
            {page} / {totalPages || 1}
          </div>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
