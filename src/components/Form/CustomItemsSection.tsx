import { useFormStore } from '../../store/formStore';

export default function CustomItemsSection() {
  const { customItems, addCustomItem, removeCustomItem, updateCustomItem, selectedCategory } = useFormStore();

  if (!selectedCategory) return null;

  return (
    <div className="extra-columns">
      <h4>✦ Additional Custom Items</h4>
      <div>
        {customItems.map((item, index) => (
          <div className="extra-row" key={index}>
            <input
              type="text"
              placeholder="Item name"
              value={item.itemName}
              onChange={(e) => updateCustomItem(index, 'itemName', e.target.value)}
            />
            <input
              type="text"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => updateCustomItem(index, 'quantity', e.target.value)}
              style={{ maxWidth: '80px' }}
            />
            <input
              type="text"
              placeholder="Remarks"
              value={item.remarks}
              onChange={(e) => updateCustomItem(index, 'remarks', e.target.value)}
            />
            <button
              type="button"
              className="remove-extra-btn"
              onClick={() => removeCustomItem(index)}
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="add-extra-btn" onClick={addCustomItem}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        Add Item
      </button>
    </div>
  );
}
