import {API_BASE_URL} from '../config/BaseUrl';
import {getUserToken} from '../utils/Api';

/**
 * Get user's stays/bookings using /api/bookings/user endpoint
 * @returns {Promise<Object>} Raw booking data from backend
 */
export const getMyStays = async () => {
  try {
    const token = await getUserToken();
    if (!token) {
      return {
        success: false,
        data: [],
        message: 'User not authenticated',
      };
    }

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}bookings/user`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    const bookings = data?.bookings || data?.data || [];

    return {
      success: response.ok && (data?.success ?? true),
      data: bookings,
      message: data?.message || '',
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

