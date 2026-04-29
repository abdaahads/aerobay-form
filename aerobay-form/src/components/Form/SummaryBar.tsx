import { useFormStore } from '../../store/formStore';

export default function SummaryBar() {
  const selectedCount = useFormStore(s => s.getSelectedCount());
  const totalQty = useFormStore(s => s.getTotalQuantity());
  const category = useFormStore(s => s.selectedCategory);

  if (!category) return null;

  return (
    <div className={`summary-bar ${selectedCount > 0 ? 'show' : ''}`}>
      <div className="summary-stat">
        <span className="val">{selectedCount}</span>
        <span className="lbl">Items Selected</span>
      </div>
      <div className="summary-stat">
        <span className="val">{totalQty}</span>
        <span className="lbl">Total Quantity</span>
      </div>
      <div className="summary-stat">
        <span className="val">{category || '—'}</span>
        <span className="lbl">Lab Category</span>
      </div>
    </div>
  );
}
