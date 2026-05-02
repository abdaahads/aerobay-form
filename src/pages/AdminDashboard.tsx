/**
 * ── AdminDashboard Page ──
 *
 * Main admin interface for AeroBay. Redesigned with logistics-first visibility:
 *   - Fulfillment stats prominently displayed alongside submission counts
 *   - Progress bar + percentage shown per row in the table
 *   - Dedicated "Ship" action button for quick shipment logging
 *   - View modal opens directly to Logistics tab when accessed via Ship button
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { adminService } from '../services/adminService';
import { useFormStore } from '../store/formStore';
import type { Submission, DashboardStats, LabCategoryName } from '../types';

import EditSubmissionModal from '../components/Admin/EditSubmissionModal';
import ViewSubmissionModal from '../components/Admin/ViewSubmissionModal';
import toast from 'react-hot-toast';
import '../styles/admin.css';

export default function AdminDashboard() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedTab, setSelectedTab] = useState<'details' | 'logistics'>('details');
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  
  const store = useFormStore();

  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const limit = 15;

  // ── Data Fetching ─────────────────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch {
      toast.error('Failed to load stats');
    }
  }, []);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getSubmissions({
        limit,
        offset: (page - 1) * limit,
        category: filterCategory as LabCategoryName || undefined,
        dateFrom: filterDateFrom || undefined,
        dateTo: filterDateTo || undefined,
      });
      setSubmissions(data.submissions);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [page, filterCategory, filterDateFrom, filterDateTo]);

  useEffect(() => {
    fetchStats();
    fetchSubmissions();
  }, [fetchStats, fetchSubmissions]);

  // ── Fulfillment Stats (computed from loaded submissions) ──────────────

  const fulfillmentStats = useMemo(() => {
    let pending = 0, partial = 0, fulfilled = 0;
    submissions.forEach(sub => {
      const status = getFulfillmentInfo(sub);
      if (status.percentage === 0) pending++;
      else if (status.percentage >= 100) fulfilled++;
      else partial++;
    });
    return { pending, partial, fulfilled };
  }, [submissions]);

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      await adminService.deleteSubmission(id);
      toast.success('Submission deleted');
      fetchSubmissions();
      fetchStats();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleEdit = (sub: Submission) => {
    store.loadSubmission(sub);
    setEditingSubmission(sub);
  };

  const handleEditSuccess = () => {
    setEditingSubmission(null);
    fetchSubmissions();
    fetchStats();
  };

  /** Open view modal directly to the Logistics tab */
  const handleOpenShipping = (sub: Submission) => {
    setSelectedTab('logistics');
    setSelectedSubmission(sub);
  };

  /** Open view modal to the Details tab */
  const handleOpenDetails = (sub: Submission) => {
    setSelectedTab('details');
    setSelectedSubmission(sub);
  };

  const handleExportCSV = async () => {
    try {
      const blob = await adminService.exportCSV({
        dateFrom: filterDateFrom,
        dateTo: filterDateTo,
        category: filterCategory,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported');
    } catch {
      toast.error('Export failed');
    }
  };

  const totalPages = Math.ceil(total / limit);

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="admin-wrapper">

      {/* ── Header ── */}
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>AeroBay Admin</h1>
          <span className="admin-subtitle">Orders & Logistics Dashboard</span>
        </div>
        <div className="admin-header-right">
          <a href="/" className="admin-btn-outline">← Back to Form</a>
          <button className="admin-btn-outline" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* ── Stats: Submission Counts + Fulfillment Overview ── */}
      {stats && (
        <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <div className="admin-stat-card">
            <div className="admin-stat-val">{stats.totalSubmissions}</div>
            <div className="admin-stat-lbl">Total Orders</div>
          </div>
          {Object.entries(stats.byCategory || {}).map(([cat, count]) => (
            <div className="admin-stat-card" key={cat}>
              <div className="admin-stat-val">{count as number}</div>
              <div className="admin-stat-lbl">{cat}</div>
            </div>
          ))}
          {/* Fulfillment-specific stats */}
          <div className="admin-stat-card" style={{ borderLeft: '4px solid #EF4444' }}>
            <div className="admin-stat-val" style={{ color: '#EF4444' }}>{fulfillmentStats.pending}</div>
            <div className="admin-stat-lbl">Pending Shipment</div>
          </div>
          <div className="admin-stat-card" style={{ borderLeft: '4px solid #F59E0B' }}>
            <div className="admin-stat-val" style={{ color: '#F59E0B' }}>{fulfillmentStats.partial}</div>
            <div className="admin-stat-lbl">Partially Shipped</div>
          </div>
          <div className="admin-stat-card" style={{ borderLeft: '4px solid #10B981' }}>
            <div className="admin-stat-val" style={{ color: '#10B981' }}>{fulfillmentStats.fulfilled}</div>
            <div className="admin-stat-lbl">Fully Shipped</div>
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="admin-filters">
        <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          <option value="Basix">Basix</option>
          <option value="Standard">Standard</option>
          <option value="Advanced">Advanced</option>
          <option value="Premium">Premium</option>
        </select>
        <input type="date" value={filterDateFrom} onChange={(e) => { setFilterDateFrom(e.target.value); setPage(1); }} />
        <input type="date" value={filterDateTo} onChange={(e) => { setFilterDateTo(e.target.value); setPage(1); }} />
        <button className="admin-btn-primary" onClick={handleExportCSV}>Export CSV</button>
      </div>

      {/* ── Orders Table ── */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>School</th>
              <th>Category</th>
              <th>Items</th>
              <th style={{ minWidth: '200px' }}>Fulfillment</th>
              <th>Shipments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>Loading…</td></tr>
            ) : submissions.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-muted)' }}>No submissions found</td></tr>
            ) : (
              submissions.map(sub => {
                const info = getFulfillmentInfo(sub);
                return (
                  <tr key={sub.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(sub.created_at).toLocaleDateString()}</td>
                    <td>
                      <strong>{sub.school_name}</strong>
                      <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{sub.contact_person}</div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, background: '#F1F5F9', color: 'var(--ink)' }}>
                        {sub.lab_category}
                      </span>
                    </td>
                    <td>{Array.isArray(sub.selected_items) ? sub.selected_items.length : 0}</td>

                    {/* ── Fulfillment column with progress bar ── */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="fulfillment-progress-bar" style={{ flex: 1 }}>
                          <div
                            className="fulfillment-progress-fill"
                            style={{
                              width: `${info.percentage}%`,
                              background: info.percentage >= 100 ? '#10B981' : info.percentage > 0 ? '#F59E0B' : '#E2E8F0'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: info.color, minWidth: '36px', textAlign: 'right' }}>
                          {info.percentage}%
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '4px' }}>
                        {info.shipped}/{info.ordered} units
                      </div>
                    </td>

                    {/* ── Shipments count ── */}
                    <td>
                      <span style={{ fontWeight: 600 }}>{(sub.shipments || []).length}</span>
                      <span style={{ color: 'var(--ink-muted)', fontSize: '12px', marginLeft: '4px' }}>batch{(sub.shipments || []).length !== 1 ? 'es' : ''}</span>
                    </td>

                    {/* ── Action Buttons ── */}
                    <td>
                      <div className="admin-actions">
                        <button className="admin-action-btn admin-action-ship" onClick={() => handleOpenShipping(sub)} title="Ship / Track">📦</button>
                        <button className="admin-action-btn" onClick={() => handleOpenDetails(sub)} title="View Details">👁</button>
                        <button className="admin-action-btn" onClick={() => handleEdit(sub)} title="Edit">✎</button>
                        <button className="admin-action-btn admin-action-delete" onClick={() => handleDelete(sub.id)} title="Delete">🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="admin-btn-outline">← Prev</button>
          <span>Page {page} of {totalPages} ({total} total)</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="admin-btn-outline">Next →</button>
        </div>
      )}

      {/* ── View/Logistics Modal ── */}
      {selectedSubmission && (
        <ViewSubmissionModal 
          submission={selectedSubmission}
          initialTab={selectedTab}
          onClose={() => setSelectedSubmission(null)}
          onRefresh={() => {
            fetchSubmissions();
            fetchStats();
            setSelectedSubmission(null);
          }}
        />
      )}

      {/* ── Edit Modal ── */}
      {editingSubmission && (
        <EditSubmissionModal 
          submissionId={editingSubmission.id} 
          onClose={() => setEditingSubmission(null)} 
          onSuccess={handleEditSuccess} 
        />
      )}
    </div>
  );
}

// ── Helper: Compute fulfillment percentage and counts for a submission ──

function getFulfillmentInfo(sub: Submission) {
  const orderedItems = [
    ...(sub.selected_items || []),
    ...(sub.custom_items || []).map(c => ({ name: c.itemName, quantity: Number(c.quantity) || 1 }))
  ];
  if (orderedItems.length === 0) return { percentage: 0, shipped: 0, ordered: 0, label: 'Empty', color: 'var(--ink-muted)' };

  let totalOrdered = 0;
  let totalShipped = 0;

  orderedItems.forEach(item => {
    const qty = item.quantity ? Number(item.quantity) : 1;
    totalOrdered += qty;
    (sub.shipments || []).forEach(shipment => {
      const shippedItem = shipment.items.find(i => i.name === (item.name || (item as any).itemName));
      if (shippedItem) totalShipped += shippedItem.qty_shipped;
    });
  });

  const percentage = totalOrdered > 0 ? Math.min(100, Math.round((totalShipped / totalOrdered) * 100)) : 0;
  
  let color = 'var(--ink-muted)';
  let label = 'Pending';
  if (percentage >= 100) { color = '#10B981'; label = 'Fulfilled'; }
  else if (percentage > 0) { color = '#F59E0B'; label = 'Partial'; }
  else { color = '#EF4444'; label = 'Pending'; }

  return { percentage, shipped: totalShipped, ordered: totalOrdered, label, color };
}
