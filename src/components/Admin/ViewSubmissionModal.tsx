import { useState, useMemo } from 'react';
import type { Submission } from '../../types';
import { LAB_DATA } from '../../data/labItems';
import ShipmentModal from './ShipmentModal';

interface ViewSubmissionModalProps {
  submission: Submission;
  onClose: () => void;
  onRefresh: () => void;
}

export default function ViewSubmissionModal({ submission, onClose, onRefresh }: ViewSubmissionModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'logistics'>('details');
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);

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
        name: itemName, 
        orderedQty, 
        shippedTotal, 
        remaining: Math.max(0, orderedQty - shippedTotal),
        status: shippedTotal >= orderedQty ? 'Fulfilled' : (shippedTotal > 0 ? 'Partial' : 'Pending')
      };
    });
  }, [orderedItems, submission.shipments]);

  const handleShipmentSuccess = () => {
    setIsCreatingShipment(false);
    onRefresh(); // Refresh dashboard data to get updated shipments
  };

  return (
    <>
      <div className="admin-modal-overlay" onClick={onClose} style={{ zIndex: 1000, padding: '40px 20px', alignItems: 'flex-start', overflowY: 'auto' }}>
        <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '900px', margin: '0 auto', overflow: 'hidden' }}>
          
          <div className="admin-modal-header" style={{ paddingBottom: 0, flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2>Submission: {submission.school_name}</h2>
              <button className="admin-modal-close" onClick={onClose}>×</button>
            </div>
            
            <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border-light)' }}>
              <button 
                style={{ background: 'none', border: 'none', padding: '12px 0', borderBottom: activeTab === 'details' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'details' ? 'var(--primary)' : 'var(--ink-muted)', fontWeight: activeTab === 'details' ? 600 : 400, cursor: 'pointer', fontSize: '15px' }}
                onClick={() => setActiveTab('details')}
              >
                Submission Details
              </button>
              <button 
                style={{ background: 'none', border: 'none', padding: '12px 0', borderBottom: activeTab === 'logistics' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'logistics' ? 'var(--primary)' : 'var(--ink-muted)', fontWeight: activeTab === 'logistics' ? 600 : 400, cursor: 'pointer', fontSize: '15px' }}
                onClick={() => setActiveTab('logistics')}
              >
                Logistics & Fulfillment
              </button>
            </div>
          </div>

          <div className="admin-modal-body" style={{ background: 'var(--surface-alt)', minHeight: '400px' }}>
            
            {activeTab === 'details' && (
              <div style={{ background: 'var(--surface-main)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div className="admin-detail-grid">
                  <div><strong>School:</strong> {submission.school_name}</div>
                  <div><strong>Code:</strong> {submission.school_code || '—'}</div>
                  <div><strong>Contact:</strong> {submission.contact_person}</div>
                  <div><strong>Email:</strong> {submission.contact_email}</div>
                  <div><strong>Phone:</strong> {submission.contact_phone || '—'}</div>
                  <div><strong>Category:</strong> {submission.lab_category}</div>
                  <div><strong>Submitted By:</strong> {submission.submitted_by_name}</div>
                  <div><strong>Target Date:</strong> {submission.target_date || '—'}</div>
                  <div><strong>Created:</strong> {new Date(submission.created_at).toLocaleString()}</div>
                </div>

                {submission.additional_notes && (
                  <div style={{ marginTop: '24px' }}>
                    <strong>Notes:</strong>
                    <p style={{ marginTop: '8px', color: 'var(--ink-muted)', background: 'var(--surface-alt)', padding: '12px', borderRadius: '6px' }}>{submission.additional_notes}</p>
                  </div>
                )}

                {Array.isArray(submission.selected_items) && submission.selected_items.length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <strong>Selected Items ({submission.selected_items.length}):</strong>
                    <div className="admin-items-list" style={{ marginTop: '12px' }}>
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
                  <div style={{ marginTop: '24px' }}>
                    <strong>Missing Items ({missingItems.length}):</strong>
                    <div className="admin-items-list" style={{ marginTop: '12px' }}>
                      {missingItems.map((item, i) => (
                        <div key={i} className="admin-item-chip" style={{ opacity: 0.6, background: 'var(--surface-alt)' }}>
                          {item.name} <span style={{ fontSize: '11px', marginLeft: '4px' }}>(Expected Qty: {item.qty})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(submission.custom_items) && submission.custom_items.length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <strong>Custom Items:</strong>
                    <div className="admin-items-list" style={{ marginTop: '12px' }}>
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

            {activeTab === 'logistics' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Shipments List */}
                <div style={{ background: 'var(--surface-main)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Shipment History</h3>
                    <button className="admin-btn-primary" onClick={() => setIsCreatingShipment(true)}>+ Log Shipment</button>
                  </div>
                  
                  {!(submission.shipments && submission.shipments.length > 0) ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--ink-muted)', background: 'var(--surface-alt)', borderRadius: '8px' }}>
                      No shipments have been logged yet for this order.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {submission.shipments.map((shipment) => (
                        <div key={shipment.id} style={{ border: '1px solid var(--border-light)', borderRadius: '8px', padding: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div>
                              <strong style={{ display: 'block', fontSize: '15px' }}>{shipment.shipment_code}</strong>
                              <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>{new Date(shipment.date).toLocaleDateString()}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, background: shipment.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: shipment.status === 'Delivered' ? 'var(--success)' : 'var(--primary)' }}>
                                {shipment.status}
                              </span>
                            </div>
                          </div>
                          {shipment.notes && <p style={{ fontSize: '13px', margin: '0 0 12px 0', color: 'var(--ink-light)' }}>{shipment.notes}</p>}
                          
                          <div style={{ background: 'var(--surface-alt)', padding: '12px', borderRadius: '6px' }}>
                            <strong style={{ fontSize: '12px', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items in this batch:</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                              {shipment.items.map((item, i) => (
                                <span key={i} style={{ fontSize: '13px', background: 'var(--surface-main)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                                  {item.name} <strong style={{ color: 'var(--primary)', marginLeft: '4px' }}>x{item.qty_shipped}</strong>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fulfillment Progress */}
                <div style={{ background: 'var(--surface-main)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Fulfillment Progress</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th style={{ textAlign: 'center' }}>Ordered</th>
                          <th style={{ textAlign: 'center' }}>Shipped</th>
                          <th style={{ textAlign: 'center' }}>Remaining</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logisticsData.map((row, i) => (
                          <tr key={i}>
                            <td>{row.name}</td>
                            <td style={{ textAlign: 'center' }}>{row.orderedQty}</td>
                            <td style={{ textAlign: 'center' }}>
                              {row.shippedTotal > 0 ? <strong style={{ color: 'var(--primary)' }}>{row.shippedTotal}</strong> : <span style={{ color: 'var(--ink-muted)' }}>0</span>}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {row.remaining > 0 ? <strong style={{ color: 'var(--danger)' }}>{row.remaining}</strong> : <span style={{ color: 'var(--success)' }}>0</span>}
                            </td>
                            <td>
                              {row.status === 'Fulfilled' && <span style={{ color: 'var(--success)' }}>✓ Fulfilled</span>}
                              {row.status === 'Partial' && <span style={{ color: 'var(--warning)' }}>Partial</span>}
                              {row.status === 'Pending' && <span style={{ color: 'var(--ink-muted)' }}>Pending</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

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
