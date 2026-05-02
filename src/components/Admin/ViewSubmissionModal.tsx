/**
 * ── ViewSubmissionModal Component ──
 *
 * Amazon-inspired order tracking interface with two tabs:
 *   Tab 1 — "Order Details": school info, ordered items, missing items
 *   Tab 2 — "Shipment Tracking": timeline view, fulfillment progress, summary cards
 *
 * The Logistics tab is designed to look like Amazon's shipping details page:
 *   - Large fulfillment summary cards at the top (ordered / shipped / remaining)
 *   - Visual progress bar
 *   - Chronological timeline with status dots and batch contents
 *   - Detailed item-level fulfillment grid
 */

import { useState, useMemo } from 'react';
import type { Submission } from '../../types';
import { LAB_DATA } from '../../data/labItems';
import ShipmentModal from './ShipmentModal';

interface ViewSubmissionModalProps {
  submission: Submission;
  initialTab?: 'details' | 'logistics';
  onClose: () => void;
  onRefresh: () => void;
}

export default function ViewSubmissionModal({ submission, initialTab = 'details', onClose, onRefresh }: ViewSubmissionModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'logistics'>(initialTab);
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);

  // ── Computed Data ─────────────────────────────────────────────────────

  const missingItems = useMemo(() => {
    const categoryData = LAB_DATA[submission.lab_category] || [];
    const allLabItems = categoryData.flatMap(g => g.items);
    const selectedNames = new Set((submission.selected_items || []).map(item => item.name));
    return allLabItems.filter(item => !selectedNames.has(item.name));
  }, [submission]);

  const orderedItems = useMemo(() => [
    ...(submission.selected_items || []),
    ...(submission.custom_items || []).map(c => ({ name: c.itemName, quantity: Number(c.quantity) || 1 }))
  ], [submission]);

  const logisticsData = useMemo(() => {
    return orderedItems.map(item => {
      const itemName = item.name || (item as any).itemName;
      const orderedQty = item.quantity ? Number(item.quantity) : 1;
      let shippedTotal = 0;
      (submission.shipments || []).forEach(shipment => {
        const shippedItem = shipment.items.find(i => i.name === itemName);
        if (shippedItem) shippedTotal += shippedItem.qty_shipped;
      });
      return { 
        name: itemName, orderedQty, shippedTotal, 
        remaining: Math.max(0, orderedQty - shippedTotal),
        status: shippedTotal >= orderedQty ? 'Fulfilled' : (shippedTotal > 0 ? 'Partial' : 'Pending')
      };
    });
  }, [orderedItems, submission.shipments]);

  /** Aggregate counts for the summary cards */
  const totals = useMemo(() => {
    let ordered = 0, shipped = 0;
    logisticsData.forEach(item => { ordered += item.orderedQty; shipped += item.shippedTotal; });
    const percentage = ordered > 0 ? Math.min(100, Math.round((shipped / ordered) * 100)) : 0;
    return { ordered, shipped, remaining: Math.max(0, ordered - shipped), percentage };
  }, [logisticsData]);

  const handleShipmentSuccess = () => {
    setIsCreatingShipment(false);
    onRefresh();
  };

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <>
      <div className="admin-modal-overlay" onClick={onClose} style={{ zIndex: 1000, padding: '20px' }}>
        <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '960px', maxHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' }}>
          
          {/* ── Header with Tabs ── */}
          <div className="admin-modal-header" style={{ paddingBottom: 0, flexDirection: 'column', alignItems: 'stretch', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ margin: 0 }}>{submission.school_name}</h2>
                <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '4px' }}>
                  {submission.lab_category} Lab • Order #{submission.id.substring(0, 8).toUpperCase()}
                </div>
              </div>
              <button className="admin-modal-close" onClick={onClose}>×</button>
            </div>
            
            <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border-line)' }}>
              {(['details', 'logistics'] as const).map(tab => (
                <button 
                  key={tab}
                  style={{ 
                    background: 'none', border: 'none', padding: '14px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, letterSpacing: '0.01em',
                    borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent', 
                    color: activeTab === tab ? 'var(--primary)' : 'var(--ink-muted)',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'details' ? '📋 Order Details' : '🚚 Shipment Tracking'}
                </button>
              ))}
            </div>
          </div>

          {/* ── Scrollable Body ── */}
          <div className="admin-modal-body" style={{ flex: 1, overflowY: 'auto', background: '#F1F5F9', padding: '24px 32px' }}>
            
            {/* ════════════════════════════════════════════════════════ */}
            {/* TAB 1: ORDER DETAILS                                    */}
            {/* ════════════════════════════════════════════════════════ */}
            {activeTab === 'details' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-line)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>School Information</h3>
                  <div className="admin-detail-grid">
                    <div><strong>School:</strong> {submission.school_name}</div>
                    <div><strong>Code:</strong> {submission.school_code || '—'}</div>
                    <div><strong>Contact:</strong> {submission.contact_person}</div>
                    <div><strong>Email:</strong> {submission.contact_email}</div>
                    <div><strong>Phone:</strong> {submission.contact_phone || '—'}</div>
                    <div><strong>Category:</strong> {submission.lab_category}</div>
                    <div><strong>Submitted By:</strong> {submission.submitted_by_name}</div>
                    <div><strong>Target Date:</strong> {submission.target_date || '—'}</div>
                  </div>
                </div>

                {submission.additional_notes && (
                  <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-line)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>Notes</h3>
                    <p style={{ margin: 0, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{submission.additional_notes}</p>
                  </div>
                )}

                {Array.isArray(submission.selected_items) && submission.selected_items.length > 0 && (
                  <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-line)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>Selected Items ({submission.selected_items.length})</h3>
                    <div className="admin-items-list">
                      {submission.selected_items.map((item, i) => (
                        <div key={i} className="admin-item-chip">
                          {item.name} × {item.quantity}
                          {item.remarks && <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}> — {item.remarks}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {missingItems.length > 0 && (
                  <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #FEF3C7' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: '#D97706' }}>⚠ Missing Items ({missingItems.length})</h3>
                    <div className="admin-items-list">
                      {missingItems.map((item, i) => (
                        <div key={i} className="admin-item-chip" style={{ opacity: 0.7, background: '#FFFBEB' }}>
                          {item.name} <span style={{ fontSize: '11px' }}>(Qty: {item.qty})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(submission.custom_items) && submission.custom_items.length > 0 && (
                  <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px dashed var(--primary)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>Custom Items</h3>
                    <div className="admin-items-list">
                      {submission.custom_items.map((item, i) => (
                        <div key={i} className="admin-item-chip" style={{ border: '1px dashed var(--primary)', background: 'transparent' }}>
                          {item.itemName} × {item.quantity}
                          {item.remarks && <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}> — {item.remarks}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ════════════════════════════════════════════════════════ */}
            {/* TAB 2: SHIPMENT TRACKING (Amazon-style)                 */}
            {/* ════════════════════════════════════════════════════════ */}
            {activeTab === 'logistics' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* ── Fulfillment Summary Cards ── */}
                <div className="fulfillment-summary" style={{ gap: '20px' }}>
                  <div className="fulfillment-summary-item" style={{ background: 'white', boxShadow: 'var(--shadow-sm)', border: 'none' }}>
                    <div className="value" style={{ color: 'var(--ink)' }}>{totals.ordered}</div>
                    <div className="label">Total Units Ordered</div>
                  </div>
                  <div className="fulfillment-summary-item" style={{ background: '#EFF6FF', border: '1px solid #DBEAFE' }}>
                    <div className="value" style={{ color: '#2563EB' }}>{totals.shipped}</div>
                    <div className="label">Total Units Shipped</div>
                  </div>
                  <div className="fulfillment-summary-item" style={{ background: totals.remaining > 0 ? '#FEF2F2' : '#F0FDF4', border: totals.remaining > 0 ? '1px solid #FEE2E2' : '1px solid #DCFCE7' }}>
                    <div className="value" style={{ color: totals.remaining > 0 ? '#DC2626' : '#16A34A' }}>{totals.remaining}</div>
                    <div className="label">Units Remaining</div>
                  </div>
                </div>

                {/* ── Overall Progress Bar ── */}
                <div style={{ background: 'white', padding: '32px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>Fulfillment Progress</h3>
                      <div style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '4px' }}>
                        {totals.shipped} of {totals.ordered} total units dispatched across {(submission.shipments || []).length} batches
                      </div>
                    </div>
                    <span style={{ fontSize: '36px', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: totals.percentage >= 100 ? '#10B981' : totals.percentage > 0 ? '#F59E0B' : '#EF4444', lineHeight: 1 }}>
                      {totals.percentage}%
                    </span>
                  </div>
                  <div className="fulfillment-progress-bar" style={{ height: '16px', background: '#F1F5F9' }}>
                    <div className="fulfillment-progress-fill" style={{ 
                      width: `${totals.percentage}%`, 
                      background: totals.percentage >= 100 ? 'linear-gradient(90deg, #10B981, #34D399)' : totals.percentage > 0 ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' : '#E2E8F0',
                      boxShadow: '0 0 12px rgba(16, 185, 129, 0.2)'
                    }} />
                  </div>
                </div>

                {/* ── Shipment Timeline ── */}
                <div style={{ background: 'white', padding: '32px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>Dispatch Timeline</h3>
                    <button className="admin-btn-primary" onClick={() => setIsCreatingShipment(true)} style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 700, background: 'var(--ink)' }}>
                      📦 Log New Shipment
                    </button>
                  </div>
                  
                  {!(submission.shipments && submission.shipments.length > 0) ? (
                    <div style={{ padding: '60px 24px', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px', border: '2px dashed var(--border-line)' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚛</div>
                      <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--ink)' }}>No Dispatches Recorded</div>
                      <div style={{ fontSize: '15px', color: 'var(--ink-muted)', marginTop: '8px' }}>Start by logging your first shipment batch.</div>
                    </div>
                  ) : (
                    <div className="shipment-timeline">
                      {[...(submission.shipments)].reverse().map((shipment) => (
                        <div key={shipment.id} className="shipment-timeline-item">
                          <div className={`shipment-timeline-dot ${shipment.status === 'Delivered' ? 'delivered' : 'dispatched'}`} style={{ width: '18px', height: '18px', left: '-32px' }} />
                          <div className="shipment-timeline-content">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                              <div>
                                <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.01em', color: 'var(--ink)' }}>{shipment.shipment_code}</div>
                                <div style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '4px', fontWeight: 500 }}>
                                  {new Date(shipment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                              </div>
                              <span style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, 
                                background: shipment.status === 'Delivered' ? '#DCFCE7' : '#DBEAFE', 
                                color: shipment.status === 'Delivered' ? '#166534' : '#1E40AF' 
                              }}>
                                {shipment.status === 'Delivered' ? '✅' : '🚚'} {shipment.status}
                              </span>
                            </div>

                            {shipment.notes && (
                              <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid #CBD5E1', margin: '0 0 16px 0', fontSize: '14px', color: 'var(--ink-light)', lineHeight: 1.5 }}>
                                {shipment.notes}
                              </div>
                            )}
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {shipment.items.map((item, i) => (
                                <span key={i} style={{ 
                                  fontSize: '13px', background: 'white', padding: '6px 14px', borderRadius: '8px', 
                                  border: '1px solid var(--border-line)', fontWeight: 600, color: 'var(--ink)',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}>
                                  {item.name} <strong style={{ color: '#2563EB', marginLeft: '4px' }}>×{item.qty_shipped}</strong>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Item-Level Fulfillment Grid ── */}
                <div style={{ background: 'white', padding: '32px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-line)' }}>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>Inventory Fulfillment Breakdown</h3>
                  <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-line)' }}>
                    <table className="admin-table">
                      <thead>
                        <tr style={{ background: '#F8FAFC' }}>
                          <th style={{ padding: '16px 24px' }}>Component Name</th>
                          <th style={{ textAlign: 'center', width: '100px' }}>Ordered</th>
                          <th style={{ textAlign: 'center', width: '100px' }}>Shipped</th>
                          <th style={{ textAlign: 'center', width: '100px' }}>Pending</th>
                          <th style={{ minWidth: '160px' }}>Progress</th>
                          <th style={{ width: '120px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logisticsData.map((row, i) => {
                          const pct = row.orderedQty > 0 ? Math.min(100, Math.round((row.shippedTotal / row.orderedQty) * 100)) : 0;
                          return (
                            <tr key={i}>
                              <td style={{ fontWeight: 700, fontSize: '14px' }}>{row.name}</td>
                              <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.orderedQty}</td>
                              <td style={{ textAlign: 'center' }}>
                                <span style={{ color: '#2563EB', fontWeight: 800 }}>{row.shippedTotal}</span>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <span style={{ color: row.remaining > 0 ? '#DC2626' : '#16A34A', fontWeight: 800 }}>{row.remaining}</span>
                              </td>
                              <td style={{ verticalAlign: 'middle' }}>
                                <div className="fulfillment-progress-bar" style={{ height: '10px' }}>
                                  <div className="fulfillment-progress-fill" style={{ 
                                    width: `${pct}%`, 
                                    background: pct >= 100 ? '#10B981' : pct > 0 ? '#F59E0B' : '#E2E8F0' 
                                  }} />
                                </div>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)', marginTop: '4px', textAlign: 'right' }}>{pct}%</div>
                              </td>
                              <td>
                                {row.status === 'Fulfilled' && <span style={{ color: '#16A34A', background: '#F0FDF4', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '12px' }}>COMPLETE</span>}
                                {row.status === 'Partial' && <span style={{ color: '#D97706', background: '#FFFBEB', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '12px' }}>PARTIAL</span>}
                                {row.status === 'Pending' && <span style={{ color: '#64748B', background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '12px' }}>PENDING</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Shipment Creation Modal ── */}
      {isCreatingShipment && (
        <ShipmentModal 
          submission={submission} 
          onClose={() => setIsCreatingShipment(false)} 
          onSuccess={handleShipmentSuccess} 
        />
      )}
    </>
  );
}
