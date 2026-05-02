import { create } from 'zustand';
import type { LabCategoryName, CustomItem, Submission } from '../types';
import { LAB_DATA } from '../data/labItems';

interface ItemState {
  included: boolean;
  quantity: number;
  remarks: string;
}

interface FormStore {
  // School Info
  schoolName: string;
  schoolCode: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;

  // Lab
  selectedCategory: LabCategoryName | null;
  itemStates: Record<string, ItemState>; // key = "sno-groupName"

  // Custom items
  customItems: CustomItem[];

  // Submitted By
  submitterName: string;
  targetDate: string;
  additionalNotes: string;

  // Submission state
  isSubmitting: boolean;
  isSubmitted: boolean;

  // Actions
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

  // Computed helpers
  getSelectedItems: () => { sno: number; name: string; group: string; quantity: number; remarks: string; included: boolean }[];
  getSelectedCount: () => number;
  getTotalQuantity: () => number;
}

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

export const useFormStore = create<FormStore>((set, get) => ({
  ...initialState,

  setField: (field, value) => set({ [field]: value }),

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

  addCustomItem: () => set(state => ({
    customItems: [...state.customItems, { itemName: '', quantity: '', remarks: '' }]
  })),

  removeCustomItem: (index) => set(state => ({
    customItems: state.customItems.filter((_, i) => i !== index)
  })),

  updateCustomItem: (index, field, value) => set(state => {
    const items = [...state.customItems];
    items[index] = { ...items[index], [field]: value };
    return { customItems: items };
  }),

  setSubmitting: (val) => set({ isSubmitting: val }),
  setSubmitted: (val) => set({ isSubmitted: val }),

  resetForm: () => set({ ...initialState, customItems: [{ itemName: '', quantity: '', remarks: '' }] }),

  loadSubmission: (sub) => {
    const category = sub.lab_category;
    const groups = LAB_DATA[category] || [];
    const newStates: Record<string, ItemState> = {};
    
    // Default empty states
    groups.forEach(group => {
      group.items.forEach(item => {
        const key = `${item.sno}-${group.group}`;
        newStates[key] = { included: false, quantity: item.qty, remarks: '' };
      });
    });

    // Apply saved items
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

  getSelectedCount: () => {
    const { itemStates } = get();
    return Object.values(itemStates).filter(s => s.included).length;
  },

  getTotalQuantity: () => {
    const { itemStates } = get();
    return Object.values(itemStates)
      .filter(s => s.included)
      .reduce((sum, s) => sum + s.quantity, 0);
  },
}));
