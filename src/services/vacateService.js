import {API_BASE_URL} from '../config/BaseUrl';
import {getUserToken} from '../utils/Api';

const buildAuthHeaders = async () => {
  const token = await getUserToken();

  if (!token) {
    return {
      success: false,
      error: 'User not authenticated',
    };
  }

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  return {success: true, headers};
};

export const getBookingPaymentHistory = async bookingId => {
  try {
    const auth = await buildAuthHeaders();
    if (!auth.success) {
      return {
        success: false,
        data: null,
        message: auth.error,
      };
    }

    const response = await fetch(
      `${API_BASE_URL}payments/history/${bookingId}`,
      {
        method: 'GET',
        headers: auth.headers,
      },
    );

    const data = await response.json();

    return {
      success: response.ok && (data?.success ?? true),
      data,
      message: data?.message || '',
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
    const auth = await buildAuthHeaders();
    if (!auth.success) {
      return {
        success: false,
        data: null,
        message: auth.error,
      };
    }

    const response = await fetch(
      `${API_BASE_URL}auth/vacate/${bookingId}/request`,
      {
        method: 'POST',
        headers: auth.headers,
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    return {
      success: response.ok && (data?.success ?? true),
      data,
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Request vacate room error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to submit vacate request',
    };
  }
};


