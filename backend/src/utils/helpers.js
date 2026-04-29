/**
 * Format selected items for Google Sheets display
 * @param {Array} items - Selected items array
 * @returns {string} Formatted string like "Item Name: 2, Other Item: 1"
 */
export function formatItemsForSheet(items) {
  if (!Array.isArray(items) || items.length === 0) return '';
  return items.map(item => `${item.name}: ${item.quantity}`).join(', ');
}

/**
 * Format custom items for Google Sheets display
 * @param {Array} items - Custom items array
 * @returns {string} Formatted string
 */
export function formatCustomItemsForSheet(items) {
  if (!Array.isArray(items) || items.length === 0) return '';
  return items
    .filter(item => item.itemName)
    .map(item => `${item.itemName}: ${item.quantity || 1}`)
    .join(', ');
}

/**
 * Calculate total quantity from selected items
 * @param {Array} items
 * @returns {number}
 */
export function calculateTotalQuantity(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
}

/**
 * Sanitize string input
 * @param {string} str
 * @returns {string}
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

/**
 * Sleep utility for retry logic
 * @param {number} ms
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
