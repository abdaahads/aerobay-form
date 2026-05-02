/**
 * ── ShipmentModal Component ──
 *
 * PURPOSE:
 *   Allows the admin to log a new batch shipment against an existing order.
 *   It intelligently computes which items still have remaining quantities
 *   and presents only those for dispatch.
 *
 * DATA FLOW:
 *   1. On mount, we merge selected_items + custom_items into one ordered list.
 *   2. For each item, we scan ALL previous shipments to calculate total shipped.
 *   3. We show only items where (orderedQty - shippedTotal) > 0.
 *   4. On save, we append a new Shipment object to the existing shipments array
 *      and persist it via PUT /api/admin/submissions/:id.
 *
 * WHY APPEND-ONLY?
 *   We never mutate or delete existing shipment records from the frontend.
 *   This ensures an immutable audit trail of all dispatches.
 *
 * SHIPMENT CODE:
 *   Auto-generated in format "SHP-YYYYMMDD-XXXX" (4 random alphanumeric chars).
 *   This is generated once on mount and displayed as read-only.
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import type { Submission, Shipment } from '../../types';

// ── Props ───────────────────────────────────────────────────────────────────

interface ShipmentModalProps {
  submission: Submission;   // The parent order we're shipping against
  onClose: () => void;      // Called when modal is dismissed
  onSuccess: () => void;    // Called after successful save — triggers dashboard refresh
}

// ── Component ───────────────────────────────────────────────────────────────

export default function ShipmentModal({ submission, onClose, onSuccess }: ShipmentModalProps) {
  /**
   * Generate a unique shipment code.
   * Format: SHP-YYYYMMDD-XXXX (e.g. SHP-20260502-A3KF)
   * Uses Math.random for the suffix — acceptable for this use case since
   * uniqueness is also guaranteed by the UUID `id` field.
   */
  const generateCode = () => `SHP-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const [shipmentCode] = useState(generateCode());
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('Dispatched');
  const [notes, setNotes] = useState('');

  /**
   * Build the unified ordered items list from both catalog items and custom items.
   * Custom items use `itemName` instead of `name`, so we normalize them here.
   */
  const orderedItems = [
    ...(submission.selected_items || []),
    ...(submission.custom_items || []).map(c => ({ name: c.itemName, quantity: Number(c.quantity) || 1 }))
  ];

  /**
   * For each ordered item, calculate how many units have already been shipped
   * across all previous shipments, then derive the `remaining` count.
   * We filter out items with remaining === 0 (fully shipped).
   */
  const [shippingItems, setShippingItems] = useState(orderedItems.map(item => {
    const itemName = item.name || (item as any).itemName;
    const orderedQty = item.quantity ? Number(item.quantity) : 1;
    let shippedTotal = 0;
    (submission.shipments || []).forEach(shipment => {
      const shippedItem = shipment.items.find(i => i.name === itemName);
      if (shippedItem) shippedTotal += shippedItem.qty_shipped;
    });
    return { name: itemName, qty_shipped: 0, remaining: Math.max(0, orderedQty - shippedTotal) };
  }).filter(i => i.remaining > 0));

  const [isSaving, setIsSaving] = useState(false);

  /**
   * Handles quantity input changes with strict clamping.
   * - Prevents negative values (Math.max(0, ...))
   * - Prevents over-shipping (Math.min(max, ...))
   * - Handles NaN from empty/invalid input gracefully
   */
  const handleQtyChange = (name: string, val: string, max: number) => {
    const qty = parseInt(val, 10);
    const validQty = isNaN(qty) ? 0 : Math.max(0, Math.min(max, qty));
    setShippingItems(prev => prev.map(item => item.name === name ? { ...item, qty_shipped: validQty } : item));
  };

  /** Persist the new shipment to the database. */
  const handleSave = async () => {
    // Only include items where the user actually specified a quantity > 0
    const itemsToShip = shippingItems.filter(i => i.qty_shipped > 0).map(i => ({ name: i.name, qty_shipped: i.qty_shipped }));
    
    if (itemsToShip.length === 0) {
      toast.error('Please specify quantities for at least one item');
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading('Logging shipment...');

    // Build the new shipment record
    const newShipment: Shipment = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      shipment_code: shipmentCode,
      date,
      status,
      notes,
      items: itemsToShip
    };

    // APPEND to the existing shipments array (never mutate old records)
    const updatedShipments = [...(submission.shipments || []), newShipment];

    try {
      const result = await adminService.updateSubmission(submission.id, { shipments: updatedShipments } as Partial<Submission>);
      toast.dismiss(loadingToast);
      if (result.success) {
        toast.success('Shipment logged successfully!');
        onSuccess();
      } else {
        toast.error('Failed to log shipment');
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  /** Convenience: fill all qty_shipped fields to their remaining values. */
  const setAllToRemaining = () => {
    setShippingItems(prev => prev.map(item => ({ ...item, qty_shipped: item.remaining })));
  };

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="admin-modal-overlay" onClick={onClose} style={{ zIndex: 2000, padding: '40px 20px', alignItems: 'flex-start', overflowY: 'auto' }}>
      <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div className="admin-modal-header" style={{ position: 'sticky', top: 0, background: 'var(--surface-main)', zIndex: 10 }}>
          <h2>Log New Shipment</h2>
          <button className="admin-modal-close" onClick={onClose} disabled={isSaving}>×</button>
        </div>
        
        {/* ── Shipment Metadata Fields ── */}
        <div className="admin-modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
            <div className="form-group">
              <label className="form-label">Shipment Batch Code</label>
              <input type="text" className="form-input" value={shipmentCode} readOnly style={{ background: '#F1F5F9', color: 'var(--ink-muted)', fontWeight: 600, borderStyle: 'dashed' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Dispatch Date</label>
              <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Status</label>
              <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Dispatched">🚚 Dispatched</option>
                <option value="Delivered">✅ Delivered</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Internal Notes (Optional)</label>
              <input type="text" className="form-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Courier name, tracking ID, etc." />
            </div>
          </div>

          {/* ── Items Table ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>Items to Dispatch</h3>
            <button 
              type="button" 
              onClick={setAllToRemaining} 
              style={{ background: '#EEF2FF', border: 'none', color: 'var(--primary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
            >
              Ship All Remaining
            </button>
          </div>
          
          {shippingItems.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px', border: '2px dashed var(--border-line)', color: 'var(--ink-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
              <strong>Order Fully Fulfilled</strong>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>All items have already been dispatched.</div>
            </div>
          ) : (
            <div style={{ border: '1px solid var(--border-line)', borderRadius: '16px', overflow: 'hidden', background: 'white' }}>
              <table className="admin-table">
                <thead style={{ background: '#F8FAFC' }}>
                  <tr>
                    <th>Item Description</th>
                    <th style={{ textAlign: 'center', width: '100px' }}>Left</th>
                    <th style={{ width: '140px' }}>Qty to Ship</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingItems.map((item, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 700 }}>{item.remaining}</span>
                      </td>
                      <td>
                        <input 
                          type="number" 
                          className="form-input" 
                          style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, borderColor: item.qty_shipped > 0 ? 'var(--primary)' : 'var(--border-line)' }} 
                          value={item.qty_shipped || ''} 
                          onChange={e => handleQtyChange(item.name, e.target.value, item.remaining)} 
                          min={0} 
                          max={item.remaining} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Footer Actions ── */}
        <div className="admin-modal-footer" style={{ padding: '24px 40px', borderTop: '1px solid var(--border-line)', display: 'flex', justifyContent: 'flex-end', gap: '16px', background: '#F8FAFC', borderRadius: '0 0 20px 20px' }}>
          <button className="admin-btn-outline" style={{ padding: '12px 24px', fontWeight: 600 }} onClick={onClose} disabled={isSaving}>Cancel</button>
          <button 
            className="admin-btn-primary" 
            style={{ padding: '12px 32px', fontWeight: 700, background: 'var(--ink)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
            onClick={handleSave} 
            disabled={isSaving || shippingItems.length === 0}
          >
            {isSaving ? 'Logging...' : 'Confirm Shipment'}
          </button>
        </div>
      </div>
    </div>
  );
}
