// ── Type definitions for AeroBay Lab Form ──

export interface LabItem {
  sno: number;
  name: string;
  qty: number;
}

export interface ItemGroup {
  group: string;
  items: LabItem[];
}

export type LabCategoryName = 'Basix' | 'Standard' | 'Advanced' | 'Premium';

export interface SelectedItem {
  sno: number;
  name: string;
  group: string;
  quantity: number;
  remarks: string;
  included: boolean;
}

export interface CustomItem {
  itemName: string;
  quantity: string;
  remarks: string;
}

export interface SchoolInfo {
  schoolName: string;
  schoolCode: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

export interface SubmittedBy {
  submitterName: string;
  targetDate: string;
  additionalNotes: string;
}

export interface FormSubmissionPayload {
  schoolInfo: SchoolInfo;
  labCategory: LabCategoryName;
  selectedItems: SelectedItem[];
  customItems: CustomItem[];
  submittedBy: SubmittedBy;
}

export interface FormSubmissionResponse {
  success: boolean;
  submissionId: string;
  message: string;
}

export interface Submission {
  id: string;
  submission_date: string;
  school_name: string;
  school_code: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  lab_category: LabCategoryName;
  selected_items: SelectedItem[];
  custom_items: CustomItem[];
  submitted_by_name: string;
  target_date: string;
  additional_notes: string;
  created_at: string;
  updated_at: string;
  is_deleted?: boolean;
}

export interface DashboardStats {
  totalSubmissions: number;
  byCategory: Record<string, number>;
}

export interface SubmissionsResponse {
  submissions: Submission[];
  total: number;
  page: number;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

export interface SubmissionFilters {
  limit: number;
  offset: number;
  category?: LabCategoryName;
  dateFrom?: string;
  dateTo?: string;
}
