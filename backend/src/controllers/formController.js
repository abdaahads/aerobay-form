import { supabaseService } from '../services/supabaseService.js';
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

      // 5. Return success
      res.status(201).json({
        success: true,
        submissionId: savedSubmission.id,
        message: 'Form submitted successfully'
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
