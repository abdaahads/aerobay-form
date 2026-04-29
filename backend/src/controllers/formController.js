import { supabaseService } from '../services/supabaseService.js';
import { googleSheetsService } from '../services/googleSheetsService.js';
import logger from '../utils/logger.js';
import { SYNC_STATUS } from '../utils/constants.js';

export const formController = {
  async submitForm(req, res, next) {
    try {
      const { schoolInfo, labCategory, selectedItems, customItems, submittedBy } = req.body;

      // 1. Prepare data for Supabase
      const submissionData = {
        school_name: schoolInfo.schoolName,
        school_code: schoolInfo.schoolCode || null,
        contact_person: schoolInfo.contactPerson,
        contact_email: schoolInfo.contactEmail,
        contact_phone: schoolInfo.contactPhone || null,
        lab_category: labCategory,
        selected_items: selectedItems,
        custom_items: customItems || [],
        submitted_by_name: submittedBy.submitterName,
        target_date: submittedBy.targetDate || null,
        additional_notes: submittedBy.additionalNotes || null,
        sync_status: SYNC_STATUS.PENDING,
        sync_attempts: 0,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
      };

      // 2. Insert into Supabase
      const savedSubmission = await supabaseService.insertSubmission(submissionData);
      logger.info('Saved submission to database', { id: savedSubmission.id });

      // 3. Attempt Google Sheets Sync (Async, but we await it to report status immediately if possible, or handle background)
      let syncResult;
      try {
        syncResult = await googleSheetsService.appendRow(savedSubmission);
        
        // 4. Update sync status on success
        await supabaseService.updateSubmission(savedSubmission.id, {
          sync_status: SYNC_STATUS.SYNCED,
          google_sheets_row_id: syncResult.updatedRange,
          sync_attempts: savedSubmission.sync_attempts + 1
        });
      } catch (syncError) {
        // 4b. Update sync status on failure
        await supabaseService.updateSubmission(savedSubmission.id, {
          sync_status: SYNC_STATUS.FAILED,
          sync_error: syncError.message,
          sync_attempts: savedSubmission.sync_attempts + 1
        });
        // We don't fail the whole request if sheet sync fails, just log it
        logger.error('Form submission saved, but Google Sheets sync failed', { id: savedSubmission.id });
      }

      // 5. Return success
      res.status(201).json({
        success: true,
        submissionId: savedSubmission.id,
        message: 'Form submitted successfully',
        syncStatus: syncResult ? SYNC_STATUS.SYNCED : SYNC_STATUS.FAILED
      });

    } catch (error) {
      next(error);
    }
  },

  async getCategories(req, res) {
    // This is handled entirely on the frontend now via the data module,
    // but providing an endpoint if needed later for dynamic loading.
    res.json({ success: true, message: 'Categories are managed on the client side.' });
  }
};
