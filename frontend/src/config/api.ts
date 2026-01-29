/**
 * API Configuration
 * 
 * Determines the API base URL based on environment:
 * - Development: Direct backend connection (localhost:3000)
 * - Production (Docker): Through nginx proxy (/api)
 */

// Check if running in production (built and served by nginx)
const isProduction = import.meta.env.PROD;

// API base URL configuration
export const API_BASE_URL = isProduction 
  ? '/api'  // In Docker, nginx proxies /api/* to backend service
  : 'http://localhost:3000';  // Development: direct backend connection

/**
 * Helper function to construct full API URLs
 * @param endpoint - API endpoint path (e.g., '/login', '/orders')
 * @returns Full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};
