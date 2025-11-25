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
 * Get all available beds with status for a property (matching website API)
 * @param {string} propertyId - Property ID
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format (optional, defaults to startDate)
 * @returns {Promise<Object>} Availability response with bedsByFloor and statistics
 */
export const getAllAvailableBeds = async (propertyId, startDate, endDate = null) => {
  try {
    const token = await getUserToken();
    
    if (!token) {
      console.error("No authentication token found");
      return {
        success: false,
        data: null,
        message: "Please log in to check room availability",
      };
    }

    const finalEndDate = endDate || startDate;
    const url = `${API_BASE_URL}bookings/availability/property/${propertyId}/all-beds?startDate=${startDate}&endDate=${finalEndDate}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: result?.success || false,
        bedsByFloor: result?.bedsByFloor || {},
        statistics: result?.statistics || null,
        message: result?.message || '',
      };
    } else if (response.status === 401) {
      console.error("Authentication failed - token may be invalid or expired");
      return {
        success: false,
        data: null,
        message: "Your session has expired. Please log in again.",
      };
    } else if (response.status === 400) {
      console.error("Bad request - missing parameters");
      return {
        success: false,
        data: null,
        message: "Bad request - missing parameters",
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        data: null,
        message: errorData?.message || 'Failed to fetch bed availability',
      };
    }
  } catch (error) {
    console.error('Get all available beds error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to fetch bed availability',
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
    
    const token = await getUserToken();
    
    if (!token) {
      console.error("No authentication token found");
      return {
        success: false,
        data: null,
        message: "Please log in to check room availability",
      };
    }

    const response = await fetch(`${API_BASE_URL}bookings/check-availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        startDate,
        endDate: endDate || startDate,
        propertyId,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: result?.success || false,
        unavailableRooms: result?.unavailableRooms || [],
        message: result?.message || '',
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        unavailableRooms: [],
        message: errorData?.message || 'Failed to check room availability',
      };
    }
  } catch (error) {
    console.error('Check room availability error:', error);
    return {
      success: false,
      unavailableRooms: [],
      message: error.message || 'Failed to check room availability',
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

/**
 * Cancel a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Cancellation response
 */
export const cancelBooking = async (bookingId) => {
  try {
    const token = await getUserToken();
    
    if (!token) {
      return {
        success: false,
        data: null,
        message: 'Please log in to cancel booking',
      };
    }

    const response = await fetch(`${API_BASE_URL}bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    return {
      success: data?.success || false,
      data: data?.booking || data?.data || null,
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Cancel booking error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to cancel booking',
    };
  }
};

export default {
  getAvailableRoomsAndBeds,
  getAllAvailableBeds,
  checkRoomAvailability,
  createBooking,
  cancelBooking,
};

