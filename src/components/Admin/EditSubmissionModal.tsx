/**
 * ── EditSubmissionModal Component ──
 *
 * PURPOSE:
 *   Allows the admin to modify an existing form submission using the EXACT
 *   same UI components that the public form uses (SchoolInfoSection,
 *   ItemSelectionTable, etc.).
 *
 * HOW IT WORKS:
 *   Before this modal is rendered, the parent (AdminDashboard) calls
 *   `formStore.loadSubmission(sub)` which populates the global Zustand store
 *   with the saved submission's data. Since all Form components read from
 *   useFormStore(), they instantly render the existing data — no prop-drilling.
 *
 * ON SAVE:
 *   We read the current store state, construct a snake_case payload matching
 *   the Supabase column names, and PUT it to /api/admin/submissions/:id.
 *
 * VALIDATION:
 *   Mirrors the same validation rules as the initial form submission.
 *   This is intentionally duplicated (not shared) because the edit modal
 *   might need different rules in the future (e.g. allowing partial saves).
 */

import React from 'react';
import toast from 'react-hot-toast';
import { useFormStore } from '../../store/formStore';
import { adminService } from '../../services/adminService';
import type { Submission } from '../../types';
import SchoolInfoSection from '../Form/SchoolInfoSection';
import LabCategorySelector from '../Form/LabCategorySelector';
import ItemSelectionTable from '../Form/ItemSelectionTable';
import SummaryBar from '../Form/SummaryBar';
import CustomItemsSection from '../Form/CustomItemsSection';
import SubmittedBySection from '../Form/SubmittedBySection';

// ── Props ───────────────────────────────────────────────────────────────────

interface EditSubmissionModalProps {
  submissionId: string;     // UUID of the submission being edited
  onClose: () => void;      // Close the modal without saving
  onSuccess: () => void;    // Called after successful update — triggers table refresh
}

// ── Component ───────────────────────────────────────────────────────────────

export default function EditSubmissionModal({ submissionId, onClose, onSuccess }: EditSubmissionModalProps) {
  const store = useFormStore();
  const [isUpdating, setIsUpdating] = React.useState(false);

  /**
   * Validate inputs and send the update to the backend.
   * The validation here mirrors FormPage.tsx — keep them in sync.
   */
  const handleUpdate = async () => {
    // ── Client-Side Validation ──
    if (!store.schoolName.trim()) {
      toast.error('Please enter the School Name');
      return;
    }
    if (!store.contactPerson.trim()) {
      toast.error('Please enter the Contact Person');
      return;
    }
    if (!store.contactEmail.trim()) {
      toast.error('Please enter the Email Address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(store.contactEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!store.submitterName.trim()) {
      toast.error('Please enter Your Name');
      return;
    }
    if (!store.selectedCategory) {
      toast.error('Please select a Lab Category');
      return;
    }

    setIsUpdating(true);
    const loadingToast = toast.loading('Updating submission...');

    try {
      // Get only the items the user has checked
      const selectedItems = store.getSelectedItems();
      // Filter out empty custom item rows
      const validCustomItems = store.customItems.filter(c => c.itemName.trim());

      /**
       * Build the update payload using snake_case keys to match Supabase columns.
       * We use Partial<Submission> so TypeScript validates the field names.
       */
      const payload: Partial<Submission> = {
        school_name: store.schoolName,
        school_code: store.schoolCode,
        contact_person: store.contactPerson,
        contact_email: store.contactEmail,
        contact_phone: store.contactPhone,
        lab_category: store.selectedCategory,
        selected_items: selectedItems,
        custom_items: validCustomItems,
        submitted_by_name: store.submitterName,
        target_date: store.targetDate,
        additional_notes: store.additionalNotes,
      };

      const result = await adminService.updateSubmission(submissionId, payload);

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success('Submission updated successfully!');
        onSuccess();
      } else {
        toast.error('Update failed');
      }
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      const msg = error instanceof Error ? error.message : 'Something went wrong.';
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="admin-modal-overlay" onClick={onClose} style={{ zIndex: 1000, overflowY: 'auto', padding: '40px 20px', alignItems: 'flex-start' }}>
      <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '900px', margin: '0 auto', overflow: 'hidden' }}>

        {/* ── Sticky Header ── */}
        <div className="admin-modal-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--surface-main)', borderBottom: '1px solid var(--border-light)' }}>
          <h2>Edit Submission</h2>
          <button className="admin-modal-close" onClick={onClose} disabled={isUpdating}>×</button>
        </div>
        
        {/* 
          ── Form Body ──
          We reuse the exact same form section components here.
          They all read/write from useFormStore(), which was pre-populated
          via loadSubmission() before this modal was rendered.
        */}
        <div className="admin-modal-body" style={{ padding: '0', background: 'var(--surface-alt)' }}>
          <div className="form-card" style={{ border: 'none', borderRadius: '0', boxShadow: 'none' }}>
            <form onSubmit={(e) => e.preventDefault()} noValidate>
              <SchoolInfoSection />
              <div className="divider"></div>
              <LabCategorySelector />
              <div className="divider"></div>
              <ItemSelectionTable />
              <SummaryBar />
              <CustomItemsSection />
              {store.selectedCategory && <div className="divider"></div>}
              <SubmittedBySection />
            </form>
          </div>
        </div>

        {/* ── Sticky Footer with Actions ── */}
        <div className="admin-modal-footer" style={{ padding: '20px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'var(--surface-main)', position: 'sticky', bottom: 0, zIndex: 10 }}>
          <button className="admin-btn-outline" onClick={onClose} disabled={isUpdating}>
            Cancel
          </button>
          <button className="admin-btn-primary" onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Submission'}
          </button>
        </div>
      </div>
    </div>
  );
}
