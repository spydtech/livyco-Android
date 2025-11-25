import {API_BASE_URL} from '../config/BaseUrl';
import {getUserToken} from '../utils/Api';

/**
 * Get booking details with payment information
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Booking details with pricing
 */
export const getBookingWithPaymentDetails = async (bookingId) => {
  try {
    const token = await getUserToken();
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Use existing getBookingById API which already returns pricing
    const response = await fetch(`${API_BASE_URL}bookings/${bookingId}`, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();
    
    return {
      success: data?.success || false,
      data: data?.booking || data?.data || null,
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Get booking payment details error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to fetch booking details',
    };
  }
};

/**
 * Create payment order
 * @param {Object} orderData - Order data
 * @param {number} orderData.amount - Amount in INR
 * @param {string} orderData.currency - Currency (default: INR)
 * @param {string} orderData.receipt - Receipt ID
 * @param {Object} orderData.bookingData - Booking data
 * @returns {Promise<Object>} Order creation response
 */
export const createPaymentOrder = async (orderData) => {
  try {
    const token = await getUserToken();
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}payments/create-order`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    
    return {
      success: data?.success || false,
      data: data?.order || data?.data || null,
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Create payment order error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to create payment order',
    };
  }
};

/**
 * Verify payment (legacy - kept for backward compatibility)
 * @param {Object} paymentData - Payment verification data
 * @param {string} paymentData.razorpayOrderId - Razorpay order ID
 * @param {string} paymentData.razorpayPaymentId - Razorpay payment ID
 * @param {string} paymentData.razorpaySignature - Razorpay signature
 * @param {string} paymentData.bookingId - Booking ID
 * @returns {Promise<Object>} Payment verification response
 */
export const verifyPayment = async (paymentData) => {
  return validatePayment(paymentData);
};

/**
 * Validate payment (new endpoint)
 * @param {Object} paymentData - Payment verification data
 * @param {string} paymentData.razorpay_order_id - Razorpay order ID
 * @param {string} paymentData.razorpay_payment_id - Razorpay payment ID
 * @param {string} paymentData.razorpay_signature - Razorpay signature
 * @param {Object} paymentData.bookingData - Booking data
 * @returns {Promise<Object>} Payment validation response
 */
export const validatePayment = async (paymentData) => {
  try {
    const token = await getUserToken();
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}payments/validate-payment`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    
    return {
      success: data?.success || false,
      data: data?.payment || data?.data || data || null,
      booking: data?.booking || null,
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Validate payment error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to validate payment',
    };
  }
};

export default {
  getBookingWithPaymentDetails,
  createPaymentOrder,
  verifyPayment,
  validatePayment,
};

