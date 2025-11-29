import {API_BASE_URL} from '../config/BaseUrl';
import {getUserToken} from '../utils/Api';

/**
 * Get food items for a specific booking and day
 * @param {string} bookingId - Booking ID
 * @param {string} day - Day of the week (Monday, Tuesday, etc.)
 * @returns {Promise<Object>} Food items response
 */
export const getFoodItemsByBookingAndDay = async (bookingId, day) => {
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

    const response = await fetch(
      `${API_BASE_URL}menu/booking/${bookingId}/day/${day}`,
      {
        method: 'GET',
        headers,
      },
    );

    const data = await response.json();

    return {
      success: response.ok && (data?.success ?? true),
      data: data?.data || [],
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Get food items error:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch food items',
    };
  }
};

/**
 * Get all food items for a specific booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Food items response
 */
export const getFoodItemsByBooking = async (bookingId) => {
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

    const response = await fetch(`${API_BASE_URL}menu/booking/${bookingId}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    return {
      success: response.ok && (data?.success ?? true),
      data: data?.data || [],
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Get food items error:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch food items',
    };
  }
};

/**
 * Get food items with query parameters
 * @param {Object} params - Query parameters (day, category, propertyId, bookingId)
 * @returns {Promise<Object>} Food items response
 */
export const getFoodItems = async params => {
  try {
    const token = await getUserToken();
    if (!token) {
      return {
        success: false,
        data: [],
        message: 'User not authenticated',
      };
    }

    const queryParams = new URLSearchParams();
    if (params?.day) queryParams.append('day', params.day);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.propertyId) queryParams.append('propertyId', params.propertyId);
    if (params?.bookingId) queryParams.append('bookingId', params.bookingId);

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const url = `${API_BASE_URL}menu/?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    return {
      success: response.ok && (data?.success ?? true),
      data: data?.data || [],
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Get food items error:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch food items',
    };
  }
};

/**
 * Get weekly menu for a booking
 * @param {string} bookingId - Booking ID
 * @param {string} propertyId - Property ID (optional)
 * @returns {Promise<Object>} Weekly menu response
 */
export const getWeeklyMenu = async (bookingId, propertyId = null) => {
  try {
    const token = await getUserToken();
    if (!token) {
      return {
        success: false,
        data: {},
        message: 'User not authenticated',
      };
    }

    const queryParams = new URLSearchParams();
    queryParams.append('bookingId', bookingId);
    if (propertyId) queryParams.append('propertyId', propertyId);

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const url = `${API_BASE_URL}menu/weekly?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    return {
      success: response.ok && (data?.success ?? true),
      data: data?.data || {},
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Get weekly menu error:', error);
    return {
      success: false,
      data: {},
      message: error.message || 'Failed to fetch weekly menu',
    };
  }
};

