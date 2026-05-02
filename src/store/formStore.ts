/**
 * ── Zustand Form Store ──
 *
 * This is the global state management for the AeroBay lab order form.
 * It uses Zustand (a lightweight alternative to Redux) for simplicity.
 *
 * KEY CONCEPTS:
 *   - `itemStates` is a flat map keyed by "sno-groupName" strings.
 *     This avoids nested state and makes individual item updates O(1).
 *   - `loadSubmission()` allows the admin to edit a previously saved submission
 *     by mapping snake_case DB fields back into this camelCase store.
 *   - `getSelectedItems()` is a computed helper (not reactive state) — it reads
 *     current state on demand. This avoids stale derived-state bugs.
 *
 * ARCHITECTURE NOTE:
 *   The Form components (SchoolInfoSection, ItemSelectionTable, etc.) all read
 *   from this store directly via `useFormStore()`. This means opening the
 *   EditSubmissionModal and calling `loadSubmission()` will instantly populate
 *   all those components with the saved data — zero prop-drilling required.
 */

import { create } from 'zustand';
import type { LabCategoryName, CustomItem, Submission } from '../types';
import { LAB_DATA } from '../data/labItems';

// ── Internal Types ──────────────────────────────────────────────────────────

/**
 * Tracks the UI state for a single lab catalog item.
 * `included` = whether the checkbox is ticked.
 * `quantity` = user-adjusted quantity (clamped to 1–999).
 * `remarks`  = free-text notes for this specific item.
 */
interface ItemState {
  included: boolean;
  quantity: number;
  remarks: string;
}

// ── Store Interface ─────────────────────────────────────────────────────────

interface FormStore {
  // ── School Info Fields ──
  schoolName: string;
  schoolCode: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;

  // ── Lab Selection ──
  selectedCategory: LabCategoryName | null;
  /**
   * Flat map of item states, keyed by "sno-groupName".
   * Example key: "3-Electronics" → { included: true, quantity: 5, remarks: "" }
   */
  itemStates: Record<string, ItemState>;

  // ── Custom Items (user-added, not from catalog) ──
  customItems: CustomItem[];

  // ── Submitter Metadata ──
  submitterName: string;
  targetDate: string;
  additionalNotes: string;

  // ── UI Submission State ──
  isSubmitting: boolean;
  isSubmitted: boolean;

  // ── Actions ──
  setField: (field: string, value: string) => void;
  setCategory: (category: LabCategoryName) => void;
  toggleItem: (key: string) => void;
  setItemQuantity: (key: string, qty: number) => void;
  setItemRemarks: (key: string, remarks: string) => void;
  addCustomItem: () => void;
  removeCustomItem: (index: number) => void;
  updateCustomItem: (index: number, field: keyof CustomItem, value: string) => void;
  setSubmitting: (val: boolean) => void;
  setSubmitted: (val: boolean) => void;
  resetForm: () => void;
  loadSubmission: (submission: Submission) => void;

  // ── Computed Helpers (not reactive — call these on-demand) ──
  getSelectedItems: () => { sno: number; name: string; group: string; quantity: number; remarks: string; included: boolean }[];
  getSelectedCount: () => number;
  getTotalQuantity: () => number;
}

// ── Default State ───────────────────────────────────────────────────────────

const initialState = {
  schoolName: '',
  schoolCode: '',
  contactPerson: '',
  contactEmail: '',
  contactPhone: '',
  selectedCategory: null as LabCategoryName | null,
  itemStates: {} as Record<string, ItemState>,
  customItems: [{ itemName: '', quantity: '', remarks: '' }] as CustomItem[],
  submitterName: '',
  targetDate: '',
  additionalNotes: '',
  isSubmitting: false,
  isSubmitted: false,
};

// ── Store Creation ──────────────────────────────────────────────────────────

export const useFormStore = create<FormStore>((set, get) => ({
  ...initialState,

  /** Generic field setter — used by simple text inputs via onChange handlers. */
  setField: (field, value) => set({ [field]: value }),

  /**
   * When the user picks a lab category (Basix/Standard/Advanced/Premium):
   * 1. Load all items for that category from the master catalog.
   * 2. Build a fresh itemStates map with defaults (not included, catalog qty).
   * 3. This wipes any previous item selections — by design.
   */
  setCategory: (category) => {
    const groups = LAB_DATA[category] || [];
    const newStates: Record<string, ItemState> = {};
    groups.forEach(group => {
      group.items.forEach(item => {
        const key = `${item.sno}-${group.group}`;
        newStates[key] = { included: false, quantity: item.qty, remarks: '' };
      });
    });
    set({ selectedCategory: category, itemStates: newStates });
  },

  /** Toggle the checkbox for a single catalog item. */
  toggleItem: (key) => set(state => {
    const current = state.itemStates[key];
    if (!current) return state;
    return {
      itemStates: {
        ...state.itemStates,
        [key]: { ...current, included: !current.included }
      }
    };
  }),

  /**
   * Update the quantity for a single item.
   * Clamped to [1, 999] to prevent nonsensical values.
   */
  setItemQuantity: (key, qty) => set(state => {
    const current = state.itemStates[key];
    if (!current) return state;
    return {
      itemStates: {
        ...state.itemStates,
        [key]: { ...current, quantity: Math.max(1, Math.min(999, qty)) }
      }
    };
  }),

  /** Update the remarks text for a single item. */
  setItemRemarks: (key, remarks) => set(state => {
    const current = state.itemStates[key];
    if (!current) return state;
    return {
      itemStates: {
        ...state.itemStates,
        [key]: { ...current, remarks }
      }
    };
  }),

  /** Add a new empty row to the custom items list. */
  addCustomItem: () => set(state => ({
    customItems: [...state.customItems, { itemName: '', quantity: '', remarks: '' }]
  })),

  /** Remove a custom item row by its array index. */
  removeCustomItem: (index) => set(state => ({
    customItems: state.customItems.filter((_, i) => i !== index)
  })),

  /** Update a single field on a custom item row. */
  updateCustomItem: (index, field, value) => set(state => {
    const items = [...state.customItems];
    items[index] = { ...items[index], [field]: value };
    return { customItems: items };
  }),

  setSubmitting: (val) => set({ isSubmitting: val }),
  setSubmitted: (val) => set({ isSubmitted: val }),

  /** Reset the entire form back to its initial empty state. */
  resetForm: () => set({ ...initialState, customItems: [{ itemName: '', quantity: '', remarks: '' }] }),

  /**
   * ── CRUD Edit Support ──
   *
   * Loads a previously saved Submission (from the database) into the store,
   * so the admin can edit it using the same Form UI components.
   *
   * How it works:
   * 1. Sets the lab category and builds a fresh itemStates map (all unchecked).
   * 2. Iterates over the saved `selected_items` array and marks matching
   *    items as `included: true`, restoring their quantity and remarks.
   * 3. Populates all school info and submitter fields from snake_case DB fields.
   *
   * IMPORTANT: The key format ("sno-groupName") must match what setCategory()
   * generates and what the saved SelectedItem contains. If the catalog data
   * changes between save and edit, some items may not match — this is expected
   * and those items will simply appear unchecked.
   */
  loadSubmission: (sub) => {
    const category = sub.lab_category;
    const groups = LAB_DATA[category] || [];
    const newStates: Record<string, ItemState> = {};
    
    // Step 1: Build default empty states for every item in this category
    groups.forEach(group => {
      group.items.forEach(item => {
        const key = `${item.sno}-${group.group}`;
        newStates[key] = { included: false, quantity: item.qty, remarks: '' };
      });
    });

    // Step 2: Overlay the saved selections onto the defaults
    if (sub.selected_items && Array.isArray(sub.selected_items)) {
      sub.selected_items.forEach(si => {
        const key = `${si.sno}-${si.group}`;
        if (newStates[key]) {
          newStates[key] = {
            included: true,
            quantity: si.quantity || 1,
            remarks: si.remarks || ''
          };
        }
      });
    }

    // Step 3: Map all snake_case DB fields → camelCase store fields
    set({
      schoolName: sub.school_name || '',
      schoolCode: sub.school_code || '',
      contactPerson: sub.contact_person || '',
      contactEmail: sub.contact_email || '',
      contactPhone: sub.contact_phone || '',
      selectedCategory: category,
      itemStates: newStates,
      customItems: Array.isArray(sub.custom_items) && sub.custom_items.length > 0 
        ? sub.custom_items 
        : [{ itemName: '', quantity: '', remarks: '' }],
      submitterName: sub.submitted_by_name || '',
      targetDate: sub.target_date || '',
      additionalNotes: sub.additional_notes || '',
      isSubmitting: false,
      isSubmitted: false,
    });
  },

  /**
   * Returns an array of only the items the user has checked (`included: true`).
   * This is used to build the submission payload and the update payload.
   *
   * NOTE: This is NOT a reactive selector — it reads state at call time.
   * If you need reactive derived data, consider Zustand's `subscribe` or `useSyncExternalStore`.
   */
  getSelectedItems: () => {
    const { selectedCategory, itemStates } = get();
    if (!selectedCategory) return [];
    const groups = LAB_DATA[selectedCategory] || [];
    const selected: { sno: number; name: string; group: string; quantity: number; remarks: string; included: boolean }[] = [];
    groups.forEach(group => {
      group.items.forEach(item => {
        const key = `${item.sno}-${group.group}`;
        const state = itemStates[key];
        if (state?.included) {
          selected.push({
            sno: item.sno,
            name: item.name,
            group: group.group,
            quantity: state.quantity,
            remarks: state.remarks,
            included: true,
          });
        }
      });
    });
    return selected;
  },

  /** Count of checked items. Used by the SummaryBar component. */
  getSelectedCount: () => {
    const { itemStates } = get();
    return Object.values(itemStates).filter(s => s.included).length;
  },

  /** Sum of quantities across all checked items. Used by the SummaryBar component. */
  getTotalQuantity: () => {
    const { itemStates } = get();
    return Object.values(itemStates)
      .filter(s => s.included)
      .reduce((sum, s) => sum + s.quantity, 0);
  },
}));
