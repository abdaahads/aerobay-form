import { useState, useMemo, useCallback, useEffect } from 'react';
import { useFormStore } from '../../store/formStore';
import { LAB_DATA } from '../../data/labItems';

export default function ItemSelectionTable() {
  const { selectedCategory, itemStates, toggleItem, setItemQuantity, setItemRemarks } = useFormStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroups, setActiveGroups] = useState<Set<string>>(new Set());

  const groups = useMemo(() => {
    if (!selectedCategory) return [];
    return LAB_DATA[selectedCategory] || [];
  }, [selectedCategory]);

  const allGroupNames = useMemo(() => groups.map(g => g.group), [groups]);

  // Initialize active groups when category changes
  useEffect(() => {
    setActiveGroups(new Set(allGroupNames));
  }, [allGroupNames]);

  const toggleGroup = useCallback((group: string) => {
    setActiveGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  }, []);

  const filteredGroups = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return groups
      .filter(g => activeGroups.has(g.group))
      .map(g => ({
        ...g,
        items: g.items.filter(item => item.name.toLowerCase().includes(search)),
      }))
      .filter(g => g.items.length > 0);
  }, [groups, activeGroups, searchTerm]);

  if (!selectedCategory) return null;

  return (
    <div id="items-panel">
      <div className="section-label">Item Selection</div>

      {/* Toolbar */}
      <div className="items-toolbar">
        <div className="search-wrap">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10.5 10.5L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            id="itemSearch"
            placeholder="Search items…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="field"
            style={{
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 16px',
              paddingLeft: '38px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '15px',
              color: 'var(--ink)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        </div>
        <div className="filter-btns">
          {allGroupNames.map(group => (
            <button
              key={group}
              type="button"
              className={`filter-btn ${activeGroups.has(group) ? 'active' : ''}`}
              onClick={() => toggleGroup(group)}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="items-table-wrap">
        <table className="items-table">
          <thead>
            <tr>
              <th style={{ width: '50%' }}>Item Name</th>
              <th style={{ width: '12%' }}>Include</th>
              <th style={{ width: '22%' }}>Quantity</th>
              <th style={{ width: '16%' }}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map(group => (
              <GroupRows
                key={group.group}
                group={group}
                itemStates={itemStates}
                onToggle={toggleItem}
                onSetQty={setItemQuantity}
                onSetRemarks={setItemRemarks}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface GroupRowsProps {
  group: { group: string; items: { sno: number; name: string; qty: number }[] };
  itemStates: Record<string, { included: boolean; quantity: number; remarks: string }>;
  onToggle: (key: string) => void;
  onSetQty: (key: string, qty: number) => void;
  onSetRemarks: (key: string, remarks: string) => void;
}

function GroupRows({ group, itemStates, onToggle, onSetQty, onSetRemarks }: GroupRowsProps) {
  return (
    <>
      <tr className="group-header-row">
        <td colSpan={4}>{group.group}</td>
      </tr>
      {group.items.map(item => {
        const key = `${item.sno}-${group.group}`;
        const state = itemStates[key] || { included: false, quantity: item.qty, remarks: '' };
        return (
          <tr key={key} className={`item-row ${state.included ? 'selected' : ''}`}>
            <td className="item-name">
              <span style={{ fontWeight: 600 }}>{item.name}</span>
            </td>
            <td style={{ textAlign: 'center' }}>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={state.included}
                  onChange={() => onToggle(key)}
                />
                <span className="toggle-slider"></span>
              </label>
            </td>
            <td style={{ textAlign: 'center' }}>
              <div className="qty-input-wrap">
                <button
                  className="qty-btn"
                  type="button"
                  onClick={() => onSetQty(key, state.quantity - 1)}
                >
                  −
                </button>
                <input
                  type="number"
                  className="qty-num"
                  value={state.quantity}
                  min={1}
                  max={999}
                  onChange={(e) => onSetQty(key, parseInt(e.target.value) || 1)}
                />
                <button
                  className="qty-btn"
                  type="button"
                  onClick={() => onSetQty(key, state.quantity + 1)}
                >
                  +
                </button>
              </div>
            </td>
            <td>
              <input
                type="text"
                placeholder="Notes"
                className="item-remarks-input"
                value={state.remarks}
                onChange={(e) => onSetRemarks(key, e.target.value)}
              />
            </td>
          </tr>
        );
      })}
    </>
  );
}
