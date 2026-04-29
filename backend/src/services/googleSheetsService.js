import { google } from 'googleapis';
import logger from '../utils/logger.js';
import { formatItemsForSheet, formatCustomItemsForSheet, calculateTotalQuantity, sleep } from '../utils/helpers.js';
import { RETRY_CONFIG } from '../utils/constants.js';

// Setup Google Auth Client
let authClient;

async function getAuthClient() {
  if (authClient) return authClient;

  try {
    const credentialsStr = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
    if (credentialsStr) {
      const credentials = JSON.parse(credentialsStr);
      authClient = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      return authClient;
    }
    
    // Fallback to separate env vars
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
      throw new Error('Missing Google Service Account credentials in environment variables');
    }

    authClient = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return authClient;
  } catch (error) {
    logger.error('Failed to initialize Google Auth', { error: error.message });
    return null;
  }
}

/**
 * Syncs a single submission to Google Sheets with exponential backoff retry
 */
export const googleSheetsService = {
  async appendRow(submissionData, attempt = 1) {
    try {
      const auth = await getAuthClient();
      if (!auth) throw new Error('Google Auth not initialized');

      const sheets = google.sheets({ version: 'v4', auth });
      const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

      if (!spreadsheetId) throw new Error('GOOGLE_SHEETS_ID is not configured');

      // Format row data according to headers
      // Expected Headers: Submission Date, School Name, Institution Code, Contact Person, Email Address, Phone Number, Lab Category, Selected Items Count, Total Quantity, Custom Items, Additional Notes, Status, Synced At
      
      const values = [[
        new Date(submissionData.created_at || new Date()).toISOString(),
        submissionData.school_name,
        submissionData.school_code || '',
        submissionData.contact_person,
        submissionData.contact_email,
        submissionData.contact_phone || '',
        submissionData.lab_category,
        submissionData.selected_items?.length || 0,
        calculateTotalQuantity(submissionData.selected_items),
        formatCustomItemsForSheet(submissionData.custom_items),
        submissionData.additional_notes || '',
        'Synced',
        new Date().toISOString()
      ]];

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:M', // Adjust range if your sheet name is different
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      });

      logger.info('Successfully appended row to Google Sheets', { 
        updates: response.data.updates 
      });

      return {
        success: true,
        updatedRange: response.data.updates.updatedRange
      };

    } catch (error) {
      logger.error(`Google Sheets sync failed (Attempt ${attempt})`, { error: error.message });

      if (attempt < RETRY_CONFIG.MAX_ATTEMPTS) {
        const delay = RETRY_CONFIG.BASE_DELAY_MS * Math.pow(2, attempt - 1); // Exponential backoff: 1s, 2s, 4s, 8s
        logger.info(`Retrying in ${delay}ms...`);
        await sleep(delay);
        return this.appendRow(submissionData, attempt + 1);
      }

      throw new Error(`Failed to sync to Google Sheets after ${RETRY_CONFIG.MAX_ATTEMPTS} attempts: ${error.message}`);
    }
  }
};
