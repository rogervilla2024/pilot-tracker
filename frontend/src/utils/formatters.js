/**
 * Utility functions for formatting data in Pilot Tracker
 */

/**
 * Format a multiplier value with 'x' suffix
 * @param {number} value - The multiplier value
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted multiplier string
 */
export function formatMultiplier(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00x';
  }

  const num = parseFloat(value);

  // For very large numbers, use compact notation
  if (num >= 10000) {
    return `${(num / 1000).toFixed(1)}Kx`;
  }

  // For numbers >= 100, use 1 decimal
  if (num >= 100) {
    return `${num.toFixed(1)}x`;
  }

  return `${num.toFixed(decimals)}x`;
}

/**
 * Format a number with thousand separators
 * @param {number} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a percentage value
 * @param {number} value - The percentage value (0-100)
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }

  return `${parseFloat(value).toFixed(decimals)}%`;
}

/**
 * Format a timestamp to time string
 * @param {number|string|Date} timestamp - The timestamp to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted time string
 */
export function formatTime(timestamp, options = {}) {
  if (!timestamp) return '--:--';

  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '--:--';

    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      ...options,
    };

    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
  } catch {
    return '--:--';
  }
}

/**
 * Format a timestamp to date string
 * @param {number|string|Date} timestamp - The timestamp to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(timestamp, options = {}) {
  if (!timestamp) return '--/--/----';

  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '--/--/----';

    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    };

    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
  } catch {
    return '--/--/----';
  }
}

/**
 * Format a timestamp to datetime string
 * @param {number|string|Date} timestamp - The timestamp to format
 * @returns {string} Formatted datetime string
 */
export function formatDateTime(timestamp) {
  if (!timestamp) return '--/--/---- --:--';

  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '--/--/---- --:--';

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    return '--/--/---- --:--';
  }
}

/**
 * Get relative time ago string
 * @param {number|string|Date} timestamp - The timestamp
 * @returns {string} Relative time string
 */
export function getTimeAgo(timestamp) {
  if (!timestamp) return 'Unknown';

  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Unknown';

    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 5) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;

    return formatDate(timestamp);
  } catch {
    return 'Unknown';
  }
}

/**
 * Format duration in milliseconds to human readable string
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration string
 */
export function formatDuration(ms) {
  if (!ms || ms < 0) return '0s';

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Format currency value
 * @param {number} value - The value to format
 * @param {string} currency - Currency code (default: USD)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = 'USD', decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Truncate text with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text || '';
  return `${text.substring(0, maxLength - 3)}...`;
}

/**
 * Format a game ID to display format
 * @param {string} gameId - The game ID
 * @returns {string} Formatted game ID
 */
export function formatGameId(gameId) {
  if (!gameId) return 'FLIGHT-00000';

  // If already has FLIGHT prefix, return as is
  if (gameId.toString().startsWith('FLIGHT-')) {
    return gameId;
  }

  // Format as FLIGHT-XXXXX
  const numericPart = gameId.toString().replace(/\D/g, '');
  return `FLIGHT-${numericPart.padStart(5, '0')}`;
}

/**
 * Get flight status based on multiplier
 * @param {number} multiplier - The multiplier value
 * @returns {string} Flight status
 */
export function getFlightStatus(multiplier) {
  if (multiplier >= 100) return 'LEGENDARY';
  if (multiplier >= 50) return 'EPIC';
  if (multiplier >= 10) return 'EXCELLENT';
  if (multiplier >= 5) return 'GREAT';
  if (multiplier >= 2) return 'COMPLETED';
  if (multiplier >= 1.5) return 'SHORT';
  return 'CRASHED';
}

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export function calculateChange(current, previous) {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Format change with arrow indicator
 * @param {number} change - Change percentage
 * @returns {Object} Formatted change with direction
 */
export function formatChange(change) {
  if (change > 0) {
    return {
      text: `+${change.toFixed(1)}%`,
      direction: 'up',
      color: 'text-green-600',
    };
  }
  if (change < 0) {
    return {
      text: `${change.toFixed(1)}%`,
      direction: 'down',
      color: 'text-red-600',
    };
  }
  return {
    text: '0%',
    direction: 'neutral',
    color: 'text-gray-600',
  };
}

export default {
  formatMultiplier,
  formatNumber,
  formatPercentage,
  formatTime,
  formatDate,
  formatDateTime,
  getTimeAgo,
  formatDuration,
  formatCurrency,
  truncateText,
  formatGameId,
  getFlightStatus,
  calculateChange,
  formatChange,
};
