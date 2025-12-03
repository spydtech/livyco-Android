import {apiGet, apiPost} from '../utils/apiCall';

/**
 * Get available rooms and beds for a property
 * @param {string} propertyId - Property ID
 * @param {string} date - Date in YYYY-MM-DD format (optional)
 * @returns {Promise<Object>} Availability response
 */
export const getAvailableRoomsAndBeds = async (propertyId, date = null) => {
  try {
    let endpoint = `bookings/availability/property/${propertyId}`;
    if (date) {
      endpoint += `?date=${date}`;
    }

    const response = await apiGet(endpoint);
    return {
      success: response.success || false,
      data: response.data?.data || response.data || null,
      message: response.message || '',
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
    const finalEndDate = endDate || startDate;
    const endpoint = `bookings/availability/property/${propertyId}/all-beds?startDate=${startDate}&endDate=${finalEndDate}`;

    const response = await apiGet(endpoint);
    
    if (response.success) {
      return {
        success: true,
        bedsByFloor: response.data?.bedsByFloor || {},
        statistics: response.data?.statistics || null,
        message: response.message || '',
      };
    }
    
    return {
      success: false,
      data: null,
      message: response.message || 'Failed to fetch bed availability',
    };
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

    const response = await apiPost('bookings/check-availability', {
      startDate,
      endDate: endDate || startDate,
      propertyId,
    });

    if (response.success) {
      return {
        success: true,
        unavailableRooms: response.data?.unavailableRooms || [],
        message: response.message || '',
      };
    }
    
    return {
      success: false,
      unavailableRooms: [],
      message: response.message || 'Failed to check room availability',
    };
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
    const response = await apiPost('bookings', bookingData);
    return {
      success: response.success || false,
      data: response.data?.booking || response.data || null,
      message: response.message || '',
      error: response.error || null,
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
    const response = await apiPost(`bookings/${bookingId}/cancel`, {});
    return {
      success: response.success || false,
      data: response.data?.booking || response.data || null,
      message: response.message || '',
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

