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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* ── Fulfillment Summary Cards ── */}
                <div className="fulfillment-summary">
                  <div className="fulfillment-summary-item">
                    <div className="value" style={{ color: 'var(--ink)' }}>{totals.ordered}</div>
                    <div className="label">Total Ordered</div>
                  </div>
                  <div className="fulfillment-summary-item">
                    <div className="value" style={{ color: '#3B82F6' }}>{totals.shipped}</div>
                    <div className="label">Units Shipped</div>
                  </div>
                  <div className="fulfillment-summary-item">
                    <div className="value" style={{ color: totals.remaining > 0 ? '#EF4444' : '#10B981' }}>{totals.remaining}</div>
                    <div className="label">Remaining</div>
                  </div>
                </div>

                {/* ── Overall Progress Bar ── */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Overall Fulfillment</h3>
                    <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: totals.percentage >= 100 ? '#10B981' : totals.percentage > 0 ? '#F59E0B' : '#EF4444' }}>
                      {totals.percentage}%
                    </span>
                  </div>
                  <div className="fulfillment-progress-bar" style={{ height: '12px' }}>
                    <div className="fulfillment-progress-fill" style={{ 
                      width: `${totals.percentage}%`, 
                      background: totals.percentage >= 100 ? 'linear-gradient(90deg, #10B981, #34D399)' : totals.percentage > 0 ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' : '#E2E8F0'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--ink-muted)' }}>
                    <span>{totals.shipped} of {totals.ordered} units shipped</span>
                    <span>{(submission.shipments || []).length} batch{(submission.shipments || []).length !== 1 ? 'es' : ''} dispatched</span>
                  </div>
                </div>

                {/* ── Shipment Timeline ── */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Shipment Timeline</h3>
                    <button className="admin-btn-primary" onClick={() => setIsCreatingShipment(true)} style={{ padding: '8px 16px', fontSize: '13px' }}>
                      + Log New Shipment
                    </button>
                  </div>
                  
                  {!(submission.shipments && submission.shipments.length > 0) ? (
                    <div style={{ padding: '48px 24px', textAlign: 'center', background: '#F8FAFC', borderRadius: '12px', border: '2px dashed var(--border-line)' }}>
                      <div style={{ fontSize: '36px', marginBottom: '12px' }}>📦</div>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>No shipments yet</div>
                      <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>Click "Log New Shipment" to record your first dispatch</div>
                    </div>
                  ) : (
                    <div className="shipment-timeline">
                      {[...(submission.shipments)].reverse().map((shipment) => (
                        <div key={shipment.id} className="shipment-timeline-item">
                          <div className={`shipment-timeline-dot ${shipment.status === 'Delivered' ? 'delivered' : 'dispatched'}`} />
                          <div className="shipment-timeline-content">
                            {/* Shipment header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '0.02em' }}>{shipment.shipment_code}</div>
                                <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '2px' }}>
                                  {new Date(shipment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                              </div>
                              <span style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                padding: '5px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, 
                                background: shipment.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                                color: shipment.status === 'Delivered' ? '#059669' : '#2563EB' 
                              }}>
                                {shipment.status === 'Delivered' ? '✓' : '→'} {shipment.status}
                              </span>
                            </div>

                            {/* Notes */}
                            {shipment.notes && (
                              <p style={{ fontSize: '13px', margin: '0 0 12px 0', color: 'var(--ink-light)', fontStyle: 'italic' }}>"{shipment.notes}"</p>
                            )}
                            
                            {/* Items in this batch */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {shipment.items.map((item, i) => (
                                <span key={i} style={{ 
                                  fontSize: '12px', background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px', 
                                  border: '1px solid #E2E8F0', fontWeight: 500 
                                }}>
                                  {item.name} <strong style={{ color: '#3B82F6' }}>×{item.qty_shipped}</strong>
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
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-line)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>Item Fulfillment Breakdown</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table" style={{ border: '1px solid var(--border-line)', borderRadius: '8px', overflow: 'hidden' }}>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th style={{ textAlign: 'center', width: '80px' }}>Ordered</th>
                          <th style={{ textAlign: 'center', width: '80px' }}>Shipped</th>
                          <th style={{ textAlign: 'center', width: '80px' }}>Left</th>
                          <th style={{ minWidth: '140px' }}>Progress</th>
                          <th style={{ width: '90px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logisticsData.map((row, i) => {
                          const pct = row.orderedQty > 0 ? Math.min(100, Math.round((row.shippedTotal / row.orderedQty) * 100)) : 0;
                          return (
                            <tr key={i}>
                              <td style={{ fontWeight: 500 }}>{row.name}</td>
                              <td style={{ textAlign: 'center' }}>{row.orderedQty}</td>
                              <td style={{ textAlign: 'center' }}>
                                <strong style={{ color: row.shippedTotal > 0 ? '#3B82F6' : 'var(--ink-muted)' }}>{row.shippedTotal}</strong>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <strong style={{ color: row.remaining > 0 ? '#EF4444' : '#10B981' }}>{row.remaining}</strong>
                              </td>
                              <td>
                                <div className="fulfillment-progress-bar">
                                  <div className="fulfillment-progress-fill" style={{ 
                                    width: `${pct}%`, 
                                    background: pct >= 100 ? '#10B981' : pct > 0 ? '#F59E0B' : '#E2E8F0' 
                                  }} />
                                </div>
                              </td>
                              <td>
                                {row.status === 'Fulfilled' && <span style={{ color: '#059669', fontWeight: 600, fontSize: '12px' }}>✓ Done</span>}
                                {row.status === 'Partial' && <span style={{ color: '#D97706', fontWeight: 600, fontSize: '12px' }}>In Progress</span>}
                                {row.status === 'Pending' && <span style={{ color: '#9CA3AF', fontWeight: 600, fontSize: '12px' }}>Pending</span>}
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
