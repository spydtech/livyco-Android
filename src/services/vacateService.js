import {apiGet, apiPost} from '../utils/apiCall';

export const getBookingPaymentHistory = async bookingId => {
  try {
    const response = await apiGet(`payments/history/${bookingId}`);
    return {
      success: response.success || false,
      data: response.data || null,
      message: response.message || '',
    };
  } catch (error) {
    console.error('Get booking payment history error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to fetch payment history',
    };
  }
};

export const requestVacateRoom = async (bookingId, payload) => {
  try {
    const response = await apiPost(`auth/vacate/${bookingId}/request`, payload);
    return {
      success: response.success || false,
      data: response.data || null,
      message: response.message || '',
      requestId: response.data?.requestId || response.data?._id || null,
    };
  } catch (error) {
    console.error('Request vacate room error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to submit vacate request',
      requestId: null,
    };
  }
};

export const getVacateStatus = async (bookingId) => {
  try {
    const response = await apiGet(`auth/vacate/${bookingId}/status`);
    return {
      success: response.success || false,
      exists: response.data?.exists || false,
      request: response.data?.request || null,
      message: response.message || '',
    };
  } catch (error) {
    console.error('Get vacate status error:', error);
    return {
      success: false,
      exists: false,
      request: null,
      message: error.message || 'Failed to fetch vacate status',
    };
  }
};


