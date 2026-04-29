export const LAB_CATEGORIES = ['Basix', 'Standard', 'Advanced', 'Premium'];

export const SYNC_STATUS = {
  PENDING: 'pending',
  SYNCED: 'synced',
  FAILED: 'failed',
};

export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  SUBMISSION_FAILED: 'Failed to save submission',
  SHEETS_SYNC_FAILED: 'Google Sheets sync failed',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  RATE_LIMIT: 'Too many requests. Please try again later.',
  SERVER_ERROR: 'Internal server error',
};

export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 4,
  BASE_DELAY_MS: 1000,
};
