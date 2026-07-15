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
  
  // CRUD Detail & Edit states
  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  
  // CRUD Create state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    role: 'pastor',
    churchName: '',
    denomination: '',
    foodPreference: 'veg',
    accommodationRequired: 'no',
    expectations: '',
    agreeToTime: 'yes',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations(meta.page);
    }
  }, [isAuthenticated, meta.page, fetchRegistrations]);

  // Export registrations
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

  // CRUD: Create Delegate
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addFormData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast.success('Registration created successfully');
        setIsAddModalOpen(false);
        setAddFormData({
          name: '',
          email: '',
          phone: '',
          age: '',
          city: '',
          role: 'pastor',
          churchName: '',
          denomination: '',
          foodPreference: 'veg',
          accommodationRequired: 'no',
          expectations: '',
          agreeToTime: 'yes',
        });
        fetchRegistrations(meta.page);
      } else {
        toast.error(result.error || 'Failed to create registration');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CRUD: Update Delegate
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/registrations/${selectedReg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast.success('Registration updated successfully');
        setIsEditing(false);
        setSelectedReg(result.data);
        fetchRegistrations(meta.page);
      } else {
        toast.error(result.error || 'Failed to update registration');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during update');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CRUD: Delete Delegate
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/registrations/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast.success('Registration deleted successfully');
        setSelectedReg(null);
        fetchRegistrations(meta.page);
      } else {
        toast.error(result.error || 'Failed to delete registration');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during deletion');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
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
        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Total Registrations</span>
            <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-secondary)' }}>{meta.total}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Page {meta.page} of {meta.totalPages}</span>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Event Capacity</span>
            <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {meta.total} <span style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-secondary)' }}>/ 100 Seats</span>
            </span>
            <div style={{ width: '100%', height: '8px', background: 'rgba(0, 0, 0, 0.05)', borderRadius: '4px', overflow: 'hidden', marginTop: '4px', border: '1px solid var(--border-color)' }}>
              <div style={{ width: `${Math.min((meta.total / 100) * 100, 100)}%`, height: '100%', background: 'var(--color-secondary)', borderRadius: '4px', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Registered Delegates</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Manage registration records. Click any row to view, edit, or delete.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                + Add Registration
              </button>
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
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
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
                    <td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading registrations...</td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No registrations found.</td>
                  </tr>
                ) : (
                  registrations.map((reg) => (
                    <tr 
                      key={reg.id} 
                      onClick={() => {
                        setSelectedReg(reg);
                        setEditFormData(reg);
                        setIsEditing(false);
                      }}
                      style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background var(--transition-fast)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                        {new Date(reg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
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

      {/* CRUD: Detail & Edit Popup Modal */}
      {selectedReg && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setSelectedReg(null)}>
          <div className="glass-card fade-in" style={{ width: '90%', maxWidth: '650px', padding: '32px', border: '1px solid var(--border-color)', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{isEditing ? 'Edit Registration' : 'Registration Details'}</h3>
              <button onClick={() => setSelectedReg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-secondary)' }}>✕</button>
            </div>

            <form onSubmit={handleUpdateSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                
                {/* Name */}
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>NAME</span>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    />
                  ) : (
                    <span style={{ fontSize: '15px', fontWeight: 600 }}>{selectedReg.name}</span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>EMAIL</span>
                  {isEditing ? (
                    <input
                      type="email"
                      required
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    />
                  ) : (
                    <span style={{ fontSize: '15px' }}>{selectedReg.email}</span>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>PHONE</span>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    />
                  ) : (
                    <span style={{ fontSize: '15px' }}>{selectedReg.phone}</span>
                  )}
                </div>

                {/* Age */}
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>AGE</span>
                  {isEditing ? (
                    <input
                      type="number"
                      required
                      value={editFormData.age || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    />
                  ) : (
                    <span style={{ fontSize: '15px' }}>{selectedReg.age}</span>
                  )}
                </div>

                {/* City */}
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>CITY</span>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={editFormData.city || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    />
                  ) : (
                    <span style={{ fontSize: '15px' }}>{selectedReg.city}</span>
                  )}
                </div>

                {/* Role */}
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>ROLE</span>
                  {isEditing ? (
                    <select
                      value={editFormData.role || 'pastor'}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)', outline: 'none' }}
                    >
                      <option value="pastor">Pastor / Evangelist</option>
                      <option value="elder">Church Elder / Coordinator</option>
                      <option value="ce-leader">Christian Endeavour Leader</option>
                      <option value="youth-leader">Youth / Student Leader</option>
                      <option value="sunday-school">Sunday School Teacher</option>
                      <option value="small-group">Small Group Facilitator</option>
                      <option value="volunteer">Ministry Volunteer</option>
                      <option value="emerging-leader">Emerging Christian Leader</option>
                    </select>
                  ) : (
                    <span style={{ fontSize: '15px', textTransform: 'capitalize' }}>{selectedReg.role}</span>
                  )}
                </div>

                {/* Church Name */}
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>CHURCH NAME</span>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={editFormData.churchName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, churchName: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    />
                  ) : (
                    <span style={{ fontSize: '15px' }}>{selectedReg.churchName}</span>
                  )}
                </div>

                {/* Denomination */}
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>DENOMINATION</span>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={editFormData.denomination || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, denomination: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    />
                  ) : (
                    <span style={{ fontSize: '15px' }}>{selectedReg.denomination}</span>
                  )}
                </div>

                {/* Food Preference */}
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>FOOD PREFERENCE</span>
                  {isEditing ? (
                    <select
                      value={editFormData.foodPreference || 'veg'}
                      onChange={(e) => setEditFormData({ ...editFormData, foodPreference: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-Vegetarian</option>
                    </select>
                  ) : (
                    <span style={{ fontSize: '15px', textTransform: 'capitalize' }}>{selectedReg.foodPreference}</span>
                  )}
                </div>

                {/* Accommodation Required */}
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>ACCOMMODATION REQUIRED</span>
                  {isEditing ? (
                    <select
                      value={editFormData.accommodationRequired || 'no'}
                      onChange={(e) => setEditFormData({ ...editFormData, accommodationRequired: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  ) : (
                    <span style={{ fontSize: '15px', textTransform: 'capitalize' }}>{selectedReg.accommodationRequired}</span>
                  )}
                </div>
              </div>

              {/* Expectations */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>EXPECTATIONS</span>
                {isEditing ? (
                  <textarea
                    required
                    rows={3}
                    value={editFormData.expectations || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, expectations: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)', resize: 'vertical' }}
                  />
                ) : (
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)', background: 'rgba(0, 0, 0, 0.02)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', margin: 0 }}>
                    {selectedReg.expectations || 'No expectations provided.'}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <div>
                  {!isEditing && (
                    <button type="button" onClick={() => handleDelete(selectedReg.id)} className="btn btn-secondary" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '8px 16px' }} disabled={isSubmitting}>
                      Delete Delegate
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {isEditing ? (
                    <>
                      <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ padding: '8px 20px' }} disabled={isSubmitting}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-gold" style={{ padding: '8px 20px' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => setIsEditing(true)} className="btn btn-gold" style={{ padding: '8px 24px' }}>
                        Edit Details
                      </button>
                      <button type="button" onClick={() => setSelectedReg(null)} className="btn btn-secondary" style={{ padding: '8px 24px' }}>
                        Close
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD: Add Registration Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setIsAddModalOpen(false)}>
          <div className="glass-card fade-in" style={{ width: '90%', maxWidth: '650px', padding: '32px', border: '1px solid var(--border-color)', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Create New Delegate</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-secondary)' }}>✕</button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                
                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={addFormData.name}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    placeholder="Enter full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={addFormData.email}
                    onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    placeholder="example@mail.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Phone Number</label>
                  <input
                    type="text"
                    required
                    value={addFormData.phone}
                    onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* Age */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Age</label>
                  <input
                    type="number"
                    required
                    min="15"
                    value={addFormData.age}
                    onChange={(e) => setAddFormData({ ...addFormData, age: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    placeholder="30"
                  />
                </div>

                {/* City */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>City & State</label>
                  <input
                    type="text"
                    required
                    value={addFormData.city}
                    onChange={(e) => setAddFormData({ ...addFormData, city: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    placeholder="Nagercoil, Tamil Nadu"
                  />
                </div>

                {/* Role */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Ministry Role</label>
                  <select
                    value={addFormData.role}
                    onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                  >
                    <option value="pastor">Pastor / Evangelist</option>
                    <option value="elder">Church Elder / Coordinator</option>
                    <option value="ce-leader">Christian Endeavour Leader</option>
                    <option value="youth-leader">Youth / Student Leader</option>
                    <option value="sunday-school">Sunday School Teacher</option>
                    <option value="small-group">Small Group Facilitator</option>
                    <option value="volunteer">Ministry Volunteer</option>
                    <option value="emerging-leader">Emerging Christian Leader</option>
                  </select>
                </div>

                {/* Church Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Church Name</label>
                  <input
                    type="text"
                    required
                    value={addFormData.churchName}
                    onChange={(e) => setAddFormData({ ...addFormData, churchName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    placeholder="Palpanabanouthoor C.S.I."
                  />
                </div>

                {/* Denomination */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Denomination</label>
                  <input
                    type="text"
                    required
                    value={addFormData.denomination}
                    onChange={(e) => setAddFormData({ ...addFormData, denomination: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    placeholder="C.S.I. / Protestant"
                  />
                </div>

                {/* Food Preference */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Food Preference</label>
                  <select
                    value={addFormData.foodPreference}
                    onChange={(e) => setAddFormData({ ...addFormData, foodPreference: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>

                {/* Accommodation */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Accommodation?</label>
                  <select
                    value={addFormData.accommodationRequired}
                    onChange={(e) => setAddFormData({ ...addFormData, accommodationRequired: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              {/* Expectations */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Expectations</label>
                <textarea
                  required
                  rows={3}
                  value={addFormData.expectations}
                  onChange={(e) => setAddFormData({ ...addFormData, expectations: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)', resize: 'vertical' }}
                  placeholder="What does the delegate hope to learn?"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary" style={{ padding: '8px 20px' }} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold" style={{ padding: '8px 20px' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Delegate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
