import {apiGet} from '../utils/apiCall';

/**
 * Get user's stays/bookings using /api/bookings/user endpoint
 * @returns {Promise<Object>} Raw booking data from backend
 */
export const getMyStays = async () => {
  try {
    const response = await apiGet('bookings/user');
    const bookings = response.data?.bookings || response.data?.data || (Array.isArray(response.data) ? response.data : []);

    return {
      success: response.success || false,
      data: bookings,
      message: response.message || '',
    };
  } catch (error) {
    console.error('Get my stays error:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch stays',
    };
  }
};

