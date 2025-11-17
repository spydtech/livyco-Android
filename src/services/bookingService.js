import {API_BASE_URL} from '../config/BaseUrl';
import {getUserToken} from '../utils/Api';
import Api from '../utils/Api';

/**
 * Get available rooms and beds for a property
 * @param {string} propertyId - Property ID
 * @param {string} date - Date in YYYY-MM-DD format (optional)
 * @returns {Promise<Object>} Availability response
 */
export const getAvailableRoomsAndBeds = async (propertyId, date = null) => {
  try {
    const token = await getUserToken();
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let url = `${API_BASE_URL}bookings/availability/property/${propertyId}`;
    if (date) {
      url += `?date=${date}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();
    
    return {
      success: data?.success || false,
      data: data?.data || null,
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Get available rooms and beds error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to fetch room availability',
    };
  }
};

/**
 * Check room availability for a date range
 * @param {Object} params - { propertyId, startDate, endDate }
 * @returns {Promise<Object>} Availability response
 */
export const checkRoomAvailability = async (params) => {
  try {
    const { propertyId, startDate, endDate } = params;
    
    const response = await Api.post('bookings/check-availability', {
      propertyId,
      startDate,
      endDate,
    });

    return {
      success: response.data?.success || false,
      data: response.data || null,
      message: response.data?.message || '',
    };
  } catch (error) {
    console.error('Check room availability error:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to check room availability',
    };
  }
};

export default {
  getAvailableRoomsAndBeds,
  checkRoomAvailability,
};

