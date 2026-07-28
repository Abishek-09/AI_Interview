"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LayoutDashboard, Users, Building, Briefcase, FileText, BarChart3, Library, Calendar, Sun, Moon } from 'lucide-react';

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState('dark');
  const pathname = usePathname();

  const navItems = [
    { id: '/recruiter', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: '/recruiter/candidates', label: 'Candidates', icon: <Users size={20} /> },
    { id: '/recruiter/companies', label: 'Companies', icon: <Building size={20} /> },
    { id: '/recruiter/jobs', label: 'Jobs', icon: <Briefcase size={20} /> },
    { id: '/recruiter/reports', label: 'Reports', icon: <FileText size={20} /> },
    { id: '/recruiter/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: '/recruiter/resume-library', label: 'Resume Library', icon: <Library size={20} /> },
    { id: '/recruiter/scheduling', label: 'Scheduling', icon: <Calendar size={20} /> }
  ];

  return (
    <div className={`admin-root ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`} style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar" style={{ width: '260px', display: 'flex', flexDirection: 'column', height: '100vh', borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ padding: 'var(--spacing-6)' }}>
          <h2 className="gradient-text" style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', margin: 0 }}>Portal</h2>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Enterprise Interview</div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', padding: '0 var(--spacing-4)' }}>
          {navItems.map(item => {
            const isActive = pathname === item.id || (item.id !== '/recruiter' && pathname.startsWith(item.id));
            return (
              <Link 
                href={item.id}
                key={item.id} 
                className={`admin-sidebar-item ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s, color 0.2s',
                  fontWeight: isActive ? 600 : 400
                }}
              >
                <span style={{ display: 'flex', color: isActive ? 'var(--accent-color)' : 'inherit' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div style={{ marginTop: 'auto', padding: 'var(--spacing-6)' }}>
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
             ← Return to Home
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
        <header className="admin-header" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--spacing-8)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ width: '300px' }}>
            <Input type="text" placeholder="Global search..." />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            <Button variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ padding: 'var(--spacing-2)' }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-color), #8a2be2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                R
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: 1.2 }}>Recruiter Admin</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Hiring Manager</span>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content" style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-8)' }}>
          {children}
        </div>
      </main>
      
    </div>
  );
}
