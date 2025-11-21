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

/**
 * Create a new booking
 * @param {Object} bookingData - Booking data
 * @param {string} bookingData.propertyId - Property ID
 * @param {string} bookingData.roomType - Room type (e.g., 'single', 'double')
 * @param {Array} bookingData.selectedRooms - Array of room identifiers
 * @param {string} bookingData.moveInDate - Move-in date (YYYY-MM-DD)
 * @param {string} [bookingData.endDate] - End date (YYYY-MM-DD)
 * @param {string} [bookingData.durationType] - Duration type ('monthly', 'daily', 'custom')
 * @param {number} [bookingData.durationDays] - Duration in days
 * @param {number} [bookingData.durationMonths] - Duration in months
 * @param {number} bookingData.personCount - Number of persons
 * @param {Object} bookingData.customerDetails - Customer details
 * @param {Object} [bookingData.pricing] - Pricing information
 * @returns {Promise<Object>} Booking creation response
 */
export const createBooking = async (bookingData) => {
  try {
    const token = await getUserToken();
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}bookings`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();
    
    return {
      success: data?.success || false,
      data: data?.booking || data?.data || null,
      message: data?.message || '',
      error: data?.error || null,
    };
  } catch (error) {
    console.error('Create booking error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to create booking',
      error: error.message,
    };
  }
};

export default {
  getAvailableRoomsAndBeds,
  checkRoomAvailability,
  createBooking,
};

