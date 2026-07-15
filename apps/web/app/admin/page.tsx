'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Dashboard & pagination state
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedReg, setSelectedReg] = useState<any | null>(null);

  // Check login state on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('kl_admin_session');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      localStorage.setItem('kl_admin_session', 'true');
      setIsAuthenticated(true);
      toast.success('Successfully logged in as Admin');
    } else {
      toast.error('Invalid email or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kl_admin_session');
    setIsAuthenticated(false);
    setRegistrations([]);
    toast.success('Logged out');
  };

  // Fetch registrations
  const fetchRegistrations = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/registrations?page=${page}&limit=15`);
      const result = await response.json();
      if (response.ok && result.success) {
        setRegistrations(result.data || []);
        setMeta(result.meta || { total: 0, page: 1, limit: 15, totalPages: 1 });
      } else {
        toast.error(result.error || 'Failed to fetch registrations');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error occurred while fetching registrations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/registrations?page=1&limit=100000`);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch registrations for export');
      }
      
      const allData = result.data || [];
      if (allData.length === 0) {
        toast.info('No registrations to export');
        return;
      }

      const headers = [
        'ID', 'Name', 'Email', 'Phone', 'Age', 'City', 'Role', 
        'Church Name', 'Denomination', 'Food Preference', 
        'Accommodation Required', 'Expectations', 'Agree To Time', 'Created At'
      ];

      const csvRows = [
        headers.join(','),
        ...allData.map((row: any) => [
          row.id,
          `"${(row.name || '').replace(/"/g, '""')}"`,
          `"${(row.email || '').replace(/"/g, '""')}"`,
          `"${(row.phone || '').replace(/"/g, '""')}"`,
          `"${(row.age || '').replace(/"/g, '""')}"`,
          `"${(row.city || '').replace(/"/g, '""')}"`,
          `"${(row.role || '').replace(/"/g, '""')}"`,
          `"${(row.churchName || '').replace(/"/g, '""')}"`,
          `"${(row.denomination || '').replace(/"/g, '""')}"`,
          `"${(row.foodPreference || '').replace(/"/g, '""')}"`,
          `"${(row.accommodationRequired || '').replace(/"/g, '""')}"`,
          `"${(row.expectations || '').replace(/"/g, '""')}"`,
          `"${(row.agreeToTime || '').replace(/"/g, '""')}"`,
          `"${(row.createdAt || '').replace(/"/g, '""')}"`
        ].join(','))
      ];

      const csvContent = '\uFEFF' + csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `kingdom_leaders_registrations_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Successfully exported registrations to CSV');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error occurred during export');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations(meta.page);
    }
  }, [isAuthenticated, meta.page, fetchRegistrations]);

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Glow backgrounds */}
        <div className="glow-bg">
          <div className="glow-orb-1"></div>
          <div className="glow-orb-2"></div>
        </div>

        <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '440px', padding: '40px', border: '1px solid var(--border-color)', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/logo.png" alt="Kingdom Leaders Logo" style={{ height: '70px', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>Admin Portal</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>Please log in to manage conference registrations</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>EMAIL ADDRESS</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
                placeholder="admin@gmail.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '14px', marginTop: '8px', fontSize: '14px', fontWeight: 600 }}>
              Sign In
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '13px', textDecoration: 'none', transition: 'color var(--transition-fast)' }}>
              ← Back to Landing Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingBottom: '60px' }}>
      {/* Navigation Header */}
      <nav className="glass" style={{ position: 'sticky', top: 0, height: 'var(--header-height)', display: 'flex', alignItems: 'center', zIndex: 40, borderBottom: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo.png" alt="Logo" style={{ height: '60px' }} />
            </Link>
            <span style={{ fontSize: '18px', fontWeight: 700, borderLeft: '1px solid var(--border-color)', paddingLeft: '16px', color: 'var(--text-primary)' }}>Admin Dashboard</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '13px' }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container" style={{ marginTop: '40px' }}>
        {/* Metric Card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Total Registrations</span>
            <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-secondary)' }}>{meta.total}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Page {meta.page} of {meta.totalPages}</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Registered Delegates</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Click any row to view full details and expectations</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleExportCSV} className="btn btn-gold" style={{ padding: '8px 16px', fontSize: '13px' }} disabled={isExporting || isLoading}>
                {isExporting ? 'Exporting...' : 'Export to Excel'}
              </button>
              <button onClick={() => fetchRegistrations(meta.page)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} disabled={isLoading}>
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.02)' }}>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Name</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Phone</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Age</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>City</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Role</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Church</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Food</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Acc.</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading registrations...</td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No registrations found.</td>
                  </tr>
                ) : (
                  registrations.map((reg) => (
                    <tr 
                      key={reg.id} 
                      onClick={() => setSelectedReg(reg)}
                      style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background var(--transition-fast)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '16px 24px', fontWeight: 600 }}>{reg.name}</td>
                      <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{reg.email}</td>
                      <td style={{ padding: '16px 24px' }}>{reg.phone}</td>
                      <td style={{ padding: '16px 24px' }}>{reg.age}</td>
                      <td style={{ padding: '16px 24px' }}>{reg.city}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', background: reg.role === 'pastor' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: reg.role === 'pastor' ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
                          {reg.role}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{reg.churchName}</td>
                      <td style={{ padding: '16px 24px', textTransform: 'capitalize' }}>{reg.foodPreference}</td>
                      <td style={{ padding: '16px 24px', textTransform: 'capitalize' }}>{reg.accommodationRequired}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Showing {registrations.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} records
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={() => setMeta(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))} 
                disabled={meta.page <= 1 || isLoading}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '13px' }}
              >
                Previous
              </button>
              <span style={{ fontSize: '13px', fontWeight: 600, padding: '0 8px' }}>
                Page {meta.page} of {meta.totalPages}
              </span>
              <button 
                onClick={() => setMeta(prev => ({ ...prev, page: Math.min(prev.page + 1, meta.totalPages) }))} 
                disabled={meta.page >= meta.totalPages || isLoading}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '13px' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row details popup modal */}
      {selectedReg && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setSelectedReg(null)}>
          <div className="glass-card fade-in" style={{ width: '90%', maxWidth: '600px', padding: '32px', border: '1px solid var(--border-color)', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Registration Details</h3>
              <button onClick={() => setSelectedReg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-secondary)' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>NAME</span>
                <span style={{ fontSize: '15px', fontWeight: 600 }}>{selectedReg.name}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>EMAIL</span>
                <span style={{ fontSize: '15px' }}>{selectedReg.email}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>PHONE</span>
                <span style={{ fontSize: '15px' }}>{selectedReg.phone}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>AGE / CITY</span>
                <span style={{ fontSize: '15px' }}>{selectedReg.age} | {selectedReg.city}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>ROLE</span>
                <span style={{ fontSize: '15px', textTransform: 'capitalize' }}>{selectedReg.role}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>CHURCH & DENOMINATION</span>
                <span style={{ fontSize: '15px' }}>{selectedReg.churchName} ({selectedReg.denomination})</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>FOOD PREFERENCE</span>
                <span style={{ fontSize: '15px', textTransform: 'capitalize' }}>{selectedReg.foodPreference}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>ACCOMMODATION REQUIRED</span>
                <span style={{ fontSize: '15px', textTransform: 'capitalize' }}>{selectedReg.accommodationRequired}</span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>EXPECTATIONS</span>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)', background: 'rgba(0, 0, 0, 0.02)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', margin: 0 }}>
                {selectedReg.expectations || 'No expectations provided.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedReg(null)} className="btn btn-secondary" style={{ padding: '8px 24px' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
