import { supabaseService } from '../services/supabaseService.js';
import { googleSheetsService } from '../services/googleSheetsService.js';
import { SYNC_STATUS } from '../utils/constants.js';
import { AsyncParser } from 'json2csv';

export const adminController = {
  async getSubmissions(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 15;
      const offset = parseInt(req.query.offset) || 0;
      const { category, dateFrom, dateTo, syncStatus } = req.query;

      const data = await supabaseService.getSubmissions({
        limit,
        offset,
        category,
        dateFrom,
        dateTo,
        syncStatus
      });

      res.json({
        success: true,
        submissions: data.submissions,
        total: data.total,
        page: Math.floor(offset / limit) + 1
      });
    } catch (error) {
      next(error);
    }
  },

  async getSubmission(req, res, next) {
    try {
      const data = await supabaseService.getSubmissionById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Submission not found' });
      
      res.json({ success: true, submission: data });
    } catch (error) {
      next(error);
    }
  },

  async updateSubmission(req, res, next) {
    try {
      const data = await supabaseService.updateSubmission(req.params.id, req.body);
      res.json({ success: true, submission: data });
    } catch (error) {
      next(error);
    }
  },

  async deleteSubmission(req, res, next) {
    try {
      await supabaseService.deleteSubmission(req.params.id);
      res.json({ success: true, message: 'Submission deleted' });
    } catch (error) {
      next(error);
    }
  },

  async getDashboardStats(req, res, next) {
    try {
      const stats = await supabaseService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },

  async retrySync(req, res, next) {
    try {
      const submission = await supabaseService.getSubmissionById(req.params.id);
      if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

      const syncResult = await googleSheetsService.appendRow(submission);

      await supabaseService.updateSubmission(req.params.id, {
        sync_status: SYNC_STATUS.SYNCED,
        google_sheets_row_id: syncResult.updatedRange,
        sync_attempts: submission.sync_attempts + 1,
        sync_error: null
      });

      res.json({ success: true, message: 'Sync retry successful' });
    } catch (error) {
      // Update attempts even on failure
      const submission = await supabaseService.getSubmissionById(req.params.id);
      if (submission) {
        await supabaseService.updateSubmission(req.params.id, {
          sync_attempts: submission.sync_attempts + 1,
          sync_error: error.message
        });
      }
      next(error);
    }
  },

  async exportCSV(req, res, next) {
    try {
      const { category, dateFrom, dateTo } = req.query;
      
      // Get all records matching filters without limit
      const data = await supabaseService.getSubmissions({
        limit: 10000, // Practically all for this use case
        offset: 0,
        category,
        dateFrom,
        dateTo
      });

      const fields = [
        'submission_date', 'school_name', 'school_code', 'contact_person',
        'contact_email', 'contact_phone', 'lab_category', 'submitted_by_name',
        'target_date', 'sync_status'
      ];
      
      const opts = { fields };
      const parser = new AsyncParser(opts);
      const csv = await parser.parse(data.submissions).promise();

      res.header('Content-Type', 'text/csv');
      res.attachment(`submissions_${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }
};
