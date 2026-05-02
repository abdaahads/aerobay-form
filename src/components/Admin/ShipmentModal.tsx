import { useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import type { Submission, Shipment } from '../../types';

interface ShipmentModalProps {
  submission: Submission;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ShipmentModal({ submission, onClose, onSuccess }: ShipmentModalProps) {
  const generateCode = () => `SHP-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const [shipmentCode] = useState(generateCode());
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('Dispatched');
  const [notes, setNotes] = useState('');

  const orderedItems = [
    ...(submission.selected_items || []),
    ...(submission.custom_items || []).map(c => ({ name: c.itemName, quantity: Number(c.quantity) || 1 }))
  ];

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

  const handleQtyChange = (name: string, val: string, max: number) => {
    const qty = parseInt(val, 10);
    const validQty = isNaN(qty) ? 0 : Math.max(0, Math.min(max, qty));
    setShippingItems(prev => prev.map(item => item.name === name ? { ...item, qty_shipped: validQty } : item));
  };

  const handleSave = async () => {
    const itemsToShip = shippingItems.filter(i => i.qty_shipped > 0).map(i => ({ name: i.name, qty_shipped: i.qty_shipped }));
    
    if (itemsToShip.length === 0) {
      toast.error('Please specify quantities for at least one item');
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading('Logging shipment...');

    const newShipment: Shipment = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      shipment_code: shipmentCode,
      date,
      status,
      notes,
      items: itemsToShip
    };

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
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const setAllToRemaining = () => {
    setShippingItems(prev => prev.map(item => ({ ...item, qty_shipped: item.remaining })));
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose} style={{ zIndex: 2000, padding: '40px 20px', alignItems: 'flex-start', overflowY: 'auto' }}>
      <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <div className="admin-modal-header" style={{ position: 'sticky', top: 0, background: 'var(--surface-main)', zIndex: 10 }}>
          <h2>Log New Shipment</h2>
          <button className="admin-modal-close" onClick={onClose} disabled={isSaving}>×</button>
        </div>
        
        <div className="admin-modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label">Shipment Code</label>
              <input type="text" className="form-input" value={shipmentCode} readOnly style={{ background: 'var(--surface-alt)', color: 'var(--ink-muted)' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Dispatch Date</label>
              <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <input type="text" className="form-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Courier info, etc." />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Items in this Shipment</h3>
            <button type="button" onClick={setAllToRemaining} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Ship All Remaining</button>
          </div>
          
          {shippingItems.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', background: 'var(--surface-alt)', borderRadius: '8px' }}>
              All ordered items have already been fully shipped!
            </div>
          ) : (
            <table className="admin-table" style={{ border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden' }}>
              <thead style={{ background: 'var(--surface-alt)' }}>
                <tr>
                  <th>Item Name</th>
                  <th>Remaining</th>
                  <th style={{ width: '120px' }}>Qty to Ship</th>
                </tr>
              </thead>
              <tbody>
                {shippingItems.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.remaining}</td>
                    <td>
                      <input 
                        type="number" 
                        className="form-input" 
                        style={{ padding: '4px 8px', height: 'auto', minHeight: '32px' }} 
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
          )}
        </div>

        <div className="admin-modal-footer" style={{ padding: '20px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'var(--surface-main)' }}>
          <button className="admin-btn-outline" onClick={onClose} disabled={isSaving}>Cancel</button>
          <button className="admin-btn-primary" onClick={handleSave} disabled={isSaving || shippingItems.length === 0}>
            {isSaving ? 'Saving...' : 'Save Shipment'}
          </button>
        </div>
      </div>
    </div>
  );
}
