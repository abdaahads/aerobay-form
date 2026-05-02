/**
 * ── Type Definitions for AeroBay Lab Form ──
 *
 * This is the single source of truth for ALL TypeScript interfaces in the app.
 * Both the form submission flow and the admin dashboard consume these types.
 *
 * NAMING CONVENTION:
 *   - Frontend state uses camelCase (e.g. schoolName)
 *   - Database / API responses use snake_case (e.g. school_name)
 *   - This is by design — the backend controller maps between them.
 *
 * IMPORTANT: If you add or rename a field here, you must also update:
 *   1. backend/schema.sql      — the Supabase table definition
 *   2. formController.js       — the camelCase → snake_case mapper
 *   3. formStore.ts            — loadSubmission() snake_case → camelCase mapper
 */

// ── Lab Catalog Types ───────────────────────────────────────────────────────

/** A single lab component from the master catalog (defined in data/labItems.ts). */
export interface LabItem {
  sno: number;   // Serial number within its group
  name: string;  // Human-readable component name
  qty: number;   // Default minimum quantity for this tier
}

/** A logical grouping of lab items (e.g. "Electronics", "Mechanical"). */
export interface ItemGroup {
  group: string;      // Group display name
  items: LabItem[];   // Items belonging to this group
}

/**
 * The four lab tiers offered by AeroBay.
 * These map 1:1 to the CHECK constraint on `form_submissions.lab_category`.
 */
export type LabCategoryName = 'Basix' | 'Standard' | 'Advanced' | 'Premium';

// ── Form Submission Types (Frontend → Backend) ──────────────────────────────

/**
 * Represents a single item the user has selected/modified on the form.
 * `included` is always true when this appears in a submission payload —
 * we only send items the user explicitly checked.
 */
export interface SelectedItem {
  sno: number;
  name: string;
  group: string;
  quantity: number;   // User-specified qty (>= catalog minimum)
  remarks: string;    // Optional per-item notes
  included: boolean;  // Always true in payloads; exists for store toggle state
}

/**
 * A free-text item the user added beyond the catalog.
 * Note: `quantity` is a string here because the form input is free-text.
 * It is converted to a number when needed for logistics calculations.
 */
export interface CustomItem {
  itemName: string;
  quantity: string;
  remarks: string;
}

// ── Shipment / Logistics Types ──────────────────────────────────────────────

/** A single item within a shipment batch. */
export interface ShippedItem {
  name: string;        // Must exactly match SelectedItem.name or CustomItem.itemName
  qty_shipped: number; // How many units were dispatched in this batch
}

/**
 * A shipment record, stored as a JSONB array element on the submission row.
 *
 * WHY JSONB and not a separate table?
 * - Shipments are always read together with their parent submission.
 * - The volume is low (typically 2-5 shipments per order).
 * - Avoids JOIN overhead and keeps the schema simple.
 * - Trade-off: cross-order shipment analytics would need a migration later.
 */
export interface Shipment {
  id: string;            // UUID — generated client-side via crypto.randomUUID()
  shipment_code: string; // Auto-generated code, e.g. "SHP-20260502-A3KF"
  date: string;          // ISO date string (YYYY-MM-DD)
  status: string;        // "Dispatched" | "Delivered"
  items: ShippedItem[];  // What was included in this batch
  notes: string;         // Free-text (courier info, invoice ref, etc.)
}

// ── Form Page Payload Types ─────────────────────────────────────────────────

/** School contact information collected on the form. */
export interface SchoolInfo {
  schoolName: string;
  schoolCode: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

/** Metadata about who submitted the form. */
export interface SubmittedBy {
  submitterName: string;
  targetDate: string;
  additionalNotes: string;
}

/** The complete payload sent from the frontend to POST /api/forms/submit. */
export interface FormSubmissionPayload {
  schoolInfo: SchoolInfo;
  labCategory: LabCategoryName;
  selectedItems: SelectedItem[];
  customItems: CustomItem[];
  submittedBy: SubmittedBy;
}

/** The response shape returned by POST /api/forms/submit. */
export interface FormSubmissionResponse {
  success: boolean;
  submissionId: string;
  message: string;
}

// ── Admin Dashboard Types (Backend → Frontend) ──────────────────────────────

/**
 * A single submission record as it comes back from the database.
 * All fields use snake_case because they mirror the Supabase column names.
 */
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
  shipments?: Shipment[];    // JSONB array — may be undefined for legacy rows
  created_at: string;
  updated_at: string;
  is_deleted?: boolean;      // Soft-delete flag (not currently used in UI)
}

/** Aggregated counts shown on the dashboard header cards. */
export interface DashboardStats {
  totalSubmissions: number;
  byCategory: Record<string, number>;
}

/** Paginated response wrapper for GET /api/admin/submissions. */
export interface SubmissionsResponse {
  submissions: Submission[];
  total: number;
  page: number;
}

// ── Auth Types ──────────────────────────────────────────────────────────────

/** Shape of the Zustand auth store (see store/authStore.ts). */
export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

// ── Filter Types ────────────────────────────────────────────────────────────

/** Query parameters for the admin submissions list endpoint. */
export interface SubmissionFilters {
  limit: number;
  offset: number;
  category?: LabCategoryName;
  dateFrom?: string;   // ISO date string
  dateTo?: string;     // ISO date string
}
