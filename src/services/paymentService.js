import {apiGet, apiPost} from '../utils/apiCall';

/**
 * Get booking details with payment information
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Booking details with pricing
 */
export const getBookingWithPaymentDetails = async (bookingId) => {
  try {
    const response = await apiGet(`bookings/${bookingId}`);
    return {
      success: response.success || false,
      data: response.data?.booking || response.data || null,
      message: response.message || '',
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
    const response = await apiPost('payments/create-order', orderData);
    return {
      success: response.success || false,
      data: response.data?.order || response.data || null,
      message: response.message || '',
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
    const response = await apiPost('payments/validate-payment', paymentData);
    return {
      success: response.success || false,
      data: response.data?.payment || response.data || null,
      booking: response.data?.booking || null,
      message: response.message || '',
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

/**
 * Get user payment history
 * @returns {Promise<Object>} User payments response
 */
export const getUserPayments = async () => {
  try {
    const response = await apiGet('bookings/user');
    
    if (!response.success) {
      return {
        success: false,
        data: [],
        message: response.message || 'Failed to fetch payments',
      };
    }

    const bookings = response.data?.bookings || response.data?.data || Array.isArray(response.data) ? response.data : [];

    // Map bookings into a flat payments-style array for the History UI
    const payments = bookings.bookings.map((booking) => {
      const property = booking.property || {};
      const paymentInfo = booking.paymentInfo || {};
      const paymentsHistory = booking.payments || [];

      // Prefer the most recent payment entry if available
      const latestPayment =
        paymentsHistory.length > 0
          ? paymentsHistory[paymentsHistory.length - 1]
          : null;

      const amount =
        latestPayment?.amount ??
        paymentInfo.paidAmount ??
        booking.paymentSummary?.totalPaid ??
        0;

      const date =
        latestPayment?.date ??
        paymentInfo.paymentDate ??
        booking.updatedAt ??
        booking.createdAt ??
        null;

      return {
        // What HistoryScreen expects / uses
        propertyName: property.name || 'N/A',
        amount,
        date,

        // Helpful identifiers
        bookingId: booking._id || booking.id,
        transactionId:
          latestPayment?.transactionId ?? paymentInfo.transactionId ?? null,

        // Extra context if needed by detail screen later
        paymentStatus: paymentInfo.paymentStatus || latestPayment?.status,
        paymentMethod: paymentInfo.paymentMethod || latestPayment?.method,
        razorpayOrderId:
          latestPayment?.razorpayOrderId ?? paymentInfo.razorpayOrderId ?? null,
        razorpayPaymentId:
          latestPayment?.razorpayPaymentId ??
          paymentInfo.razorpayPaymentId ??
          null,
        rawBooking: booking,
      };
    });

    return {
      success: true,
      data: payments,
      message: response.message || '',
    };
  } catch (error) {
    console.error('Get user payments error:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch payments',
    };
  }
};

export default {
  getBookingWithPaymentDetails,
  createPaymentOrder,
  verifyPayment,
  validatePayment,
  getUserPayments,
};

