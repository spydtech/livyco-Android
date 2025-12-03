import {apiPost, apiGet} from '../utils/apiCall';

/**
 * Submit a concern/change request
 * @param {Object} concernData - Concern data
 * @param {string} concernData.type - Type of concern: 'bed-change', 'room-change', or 'other-services'
 * @param {string} concernData.requestedRoom - Requested room number (required for bed-change and room-change)
 * @param {string} concernData.requestedBed - Requested bed identifier (required for bed-change and room-change)
 * @param {string} concernData.requestedSharingType - Requested sharing type (required for room-change)
 * @param {number} concernData.requestedFloor - Requested floor number (required for room-change)
 * @param {string} concernData.comment - Comment/reason for the request
 * @param {string} concernData.priority - Priority level: 'low', 'medium', 'high', 'urgent' (optional, defaults to 'medium')
 * @returns {Promise<Object>} Response with success status and concern data
 */
export const submitConcern = async (concernData) => {
  try {
    const response = await apiPost('concerns/submit', concernData);
    
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Request submitted successfully',
        concern: response.data?.concern || response.data || null,
      };
    }
    
    return {
      success: false,
      message: response.message || 'Failed to submit request. Please try again.',
      error: response.error || null,
    };
  } catch (error) {
    console.error('Submit concern error:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred. Please try again.',
    };
  }
};

/**
 * Get concern details by ID
 * @param {string} concernId - Concern ID
 * @returns {Promise<Object>} Response with success status and concern data
 */
export const getConcernById = async (concernId) => {
  try {
    const response = await apiGet(`concerns/${concernId}`);
    
    if (response.success) {
      return {
        success: true,
        concern: response.data?.concern || response.data || null,
        message: response.message || '',
      };
    }
    
    return {
      success: false,
      concern: null,
      message: response.message || 'Failed to fetch concern details',
      error: response.error || null,
    };
  } catch (error) {
    console.error('Get concern by ID error:', error);
    return {
      success: false,
      concern: null,
      message: error.message || 'An unexpected error occurred. Please try again.',
    };
  }
};

