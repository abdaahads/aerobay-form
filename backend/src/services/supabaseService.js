import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

// Initialize Supabase client
// We use the service role key for backend operations to bypass RLS if needed,
// but anon key works too depending on RLS policies.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.warn('Supabase URL or Key is missing. Database operations will fail.');
}

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

export const supabaseService = {
  async insertSubmission(data) {
    try {
      const { data: insertedData, error } = await supabase
        .from('form_submissions')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return insertedData;
    } catch (error) {
      logger.error('Supabase insert failed', { error: error.message });
      throw error;
    }
  },

  async updateSubmission(id, data) {
    try {
      const { data: updatedData, error } = await supabase
        .from('form_submissions')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    } catch (error) {
      logger.error('Supabase update failed', { id, error: error.message });
      throw error;
    }
  },

  async getSubmissions({ limit = 15, offset = 0, category, syncStatus, dateFrom, dateTo }) {
    try {
      let query = supabase
        .from('form_submissions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (category) query = query.eq('lab_category', category);
      if (syncStatus) query = query.eq('sync_status', syncStatus);
      if (dateFrom) query = query.gte('created_at', dateFrom);
      if (dateTo) query = query.lte('created_at', `${dateTo}T23:59:59.999Z`);

      const { data, count, error } = await query;
      if (error) throw error;

      return { submissions: data, total: count };
    } catch (error) {
      logger.error('Supabase getSubmissions failed', { error: error.message });
      throw error;
    }
  },

  async getSubmissionById(id) {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Supabase getSubmissionById failed', { id, error: error.message });
      throw error;
    }
  },

  async deleteSubmission(id) {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Supabase delete failed', { id, error: error.message });
      throw error;
    }
  },

  async getStats() {
    try {
      // Get total count
      const { count: totalSubmissions, error: totalError } = await supabase
        .from('form_submissions')
        .select('*', { count: 'exact', head: true });

      // Get sync failures count
      const { count: syncFailures, error: syncError } = await supabase
        .from('form_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('sync_status', 'failed');

      if (totalError || syncError) throw totalError || syncError;

      // Group by category (Supabase RPC would be better, but doing it via JS for simplicity if counts are low,
      // or we can do multiple queries for the 4 categories since they are fixed)
      const categories = ['Basix', 'Standard', 'Advanced', 'Premium'];
      const byCategory = {};
      
      for (const cat of categories) {
        const { count } = await supabase
          .from('form_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('lab_category', cat);
        byCategory[cat] = count || 0;
      }

      return {
        totalSubmissions: totalSubmissions || 0,
        syncFailures: syncFailures || 0,
        byCategory,
        lastSync: new Date().toISOString() // Or get the max updated_at where sync_status='synced'
      };
    } catch (error) {
      logger.error('Supabase getStats failed', { error: error.message });
      throw error;
    }
  }
};
