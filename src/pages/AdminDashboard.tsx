import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { adminService } from '../services/adminService';
import { useFormStore } from '../store/formStore';
import type { Submission, DashboardStats, LabCategoryName } from '../types';
import { LAB_DATA } from '../data/labItems';
import EditSubmissionModal from '../components/Admin/EditSubmissionModal';
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
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  
  const store = useFormStore();

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const limit = 15;

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

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      await adminService.deleteSubmission(id);
      toast.success('Submission deleted');
      fetchSubmissions();
      fetchStats();
    } catch {
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

  const missingItems = useMemo(() => {
    if (!selectedSubmission) return [];
    
    // All items from the category
    const categoryData = LAB_DATA[selectedSubmission.lab_category] || [];
    const allLabItems = categoryData.flatMap(g => g.items);

    // Selected items
    const selected = selectedSubmission.selected_items || [];
    const selectedNames = new Set(selected.map(item => item.name));

    // Return items that are not in selected
    return allLabItems.filter(item => !selectedNames.has(item.name));
  }, [selectedSubmission]);

  return (
    <div className="admin-wrapper">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>AeroBay Admin</h1>
          <span className="admin-subtitle">Submissions Dashboard</span>
        </div>
        <div className="admin-header-right">
          <a href="/" className="admin-btn-outline">← Back to Form</a>
          <button className="admin-btn-outline" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Stats */}
      {stats && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-val">{stats.totalSubmissions}</div>
            <div className="admin-stat-lbl">Total Submissions</div>
          </div>
          {Object.entries(stats.byCategory || {}).map(([cat, count]) => (
            <div className="admin-stat-card" key={cat}>
              <div className="admin-stat-val">{count as number}</div>
              <div className="admin-stat-lbl">{cat}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="admin-filters">
        <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          <option value="Basix">Basix</option>
          <option value="Standard">Standard</option>
          <option value="Advanced">Advanced</option>
          <option value="Premium">Premium</option>
        </select>

        <input type="date" value={filterDateFrom} onChange={(e) => { setFilterDateFrom(e.target.value); setPage(1); }} placeholder="From" />
        <input type="date" value={filterDateTo} onChange={(e) => { setFilterDateTo(e.target.value); setPage(1); }} placeholder="To" />
        <button className="admin-btn-primary" onClick={handleExportCSV}>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>School Name</th>
              <th>Contact</th>
              <th>Category</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>Loading…</td></tr>
            ) : submissions.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-muted)' }}>No submissions found</td></tr>
            ) : (
              submissions.map(sub => (
                <tr key={sub.id}>
                  <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td><strong>{sub.school_name}</strong></td>
                  <td>
                    <div>{sub.contact_person}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{sub.contact_email}</div>
                  </td>
                  <td>{sub.lab_category}</td>
                  <td>{Array.isArray(sub.selected_items) ? sub.selected_items.length : 0}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn" onClick={() => handleEdit(sub)} title="Edit">✎</button>
                      <button className="admin-action-btn" onClick={() => setSelectedSubmission(sub)} title="View">👁</button>
                      <button className="admin-action-btn admin-action-delete" onClick={() => handleDelete(sub.id)} title="Delete">🗑</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="admin-btn-outline">← Prev</button>
          <span>Page {page} of {totalPages} ({total} total)</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="admin-btn-outline">Next →</button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="admin-modal-overlay" onClick={() => setSelectedSubmission(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Submission Details</h2>
              <button className="admin-modal-close" onClick={() => setSelectedSubmission(null)}>×</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-detail-grid">
                <div><strong>School:</strong> {selectedSubmission.school_name}</div>
                <div><strong>Code:</strong> {selectedSubmission.school_code || '—'}</div>
                <div><strong>Contact:</strong> {selectedSubmission.contact_person}</div>
                <div><strong>Email:</strong> {selectedSubmission.contact_email}</div>
                <div><strong>Phone:</strong> {selectedSubmission.contact_phone || '—'}</div>
                <div><strong>Category:</strong> {selectedSubmission.lab_category}</div>
                <div><strong>Submitted By:</strong> {selectedSubmission.submitted_by_name}</div>
                <div><strong>Target Date:</strong> {selectedSubmission.target_date || '—'}</div>

                <div><strong>Created:</strong> {new Date(selectedSubmission.created_at).toLocaleString()}</div>
              </div>

              {selectedSubmission.additional_notes && (
                <div style={{ marginTop: '16px' }}>
                  <strong>Notes:</strong>
                  <p style={{ marginTop: '4px', color: 'var(--ink-muted)' }}>{selectedSubmission.additional_notes}</p>
                </div>
              )}

              {Array.isArray(selectedSubmission.selected_items) && selectedSubmission.selected_items.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <strong>Selected Items ({selectedSubmission.selected_items.length}):</strong>
                  <div className="admin-items-list">
                    {selectedSubmission.selected_items.map((item, i) => (
                      <div key={i} className="admin-item-chip">
                        {item.name} × {item.quantity}
                        {item.remarks && <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}> — {item.remarks}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {missingItems.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <strong>Missing Items ({missingItems.length}):</strong>
                  <div className="admin-items-list" style={{ marginTop: '8px' }}>
                    {missingItems.map((item, i) => (
                      <div key={i} className="admin-item-chip" style={{ opacity: 0.6 }}>
                        {item.name} <span style={{ fontSize: '11px', marginLeft: '4px' }}>(Expected Qty: {item.qty})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(selectedSubmission.custom_items) && selectedSubmission.custom_items.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <strong>Custom Items:</strong>
                  <div className="admin-items-list">
                    {selectedSubmission.custom_items.map((item, i) => (
                      <div key={i} className="admin-item-chip">
                        {item.itemName} × {item.quantity}
                        {item.remarks && <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}> — {item.remarks}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      )}

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
