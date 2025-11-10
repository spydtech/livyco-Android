import axios from 'axios';
import { API_BASE_URL } from '../config/BaseUrl';

// Create axios instance for auth endpoints
const authApi = axios.create({
  baseURL: API_BASE_URL + 'auth/',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Get authentication headers
 * @param {string} token - JWT token (optional)
 * @returns {Object} Headers object
 */
const getAuthHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Handle API response
 * @param {Object} response - Axios response
 * @returns {Object} Formatted response
 */
const handleResponse = (response) => {
  if (response.data) {
    return {
      success: response.data.success || false,
      data: response.data,
      message: response.data.message || '',
      error: response.data.error || null,
    };
  }
  return {
    success: false,
    data: null,
    message: 'Invalid response format',
    error: 'Invalid response format',
  };
};

/**
 * Handle API error
 * @param {Error} error - Axios error
 * @returns {Object} Formatted error response
 */
const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      success: false,
      data: null,
      message: error.response.data?.message || 'An error occurred',
      error: error.response.data?.error || error.message,
      status: error.response.status,
    };
  } else if (error.request) {
    // Request was made but no response received
    const errorMessage = error.code === 'ECONNREFUSED' 
      ? 'Connection refused. Please check if the server is running and the IP address is correct.'
      : error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN'
      ? 'Server not found. Please check the API URL configuration.'
      : error.code === 'ETIMEDOUT'
      ? 'Request timeout. Please check your network connection.'
      : 'Network error. Please check your internet connection and server URL.';
    
    return {
      success: false,
      data: null,
      message: errorMessage,
      error: error.code || 'Network error',
      details: error.message,
    };
  }
  // Something else happened
  return {
    success: false,
    data: null,
    message: error.message || 'An unexpected error occurred',
    error: error.message,
  };
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.phone - User's phone number (10 digits)
 * @param {string} userData.email - User's email address
 * @param {string} [userData.role='user'] - User role ('user' or 'client')
 * @returns {Promise<Object>} Registration response
 */
export const register = async (userData) => {
  try {
    const response = await authApi.post('register', userData, {
      headers: getAuthHeaders(),
    });
    console.log("responsee register", response);
    
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Check if user exists
 * @param {Object} data - Check user data
 * @param {string} data.phone - User's phone number
 * @param {string} [data.role] - User role (optional)
 * @returns {Promise<Object>} Check user response
 */
export const checkUserExists = async (data) => {
  try {
    const response = await authApi.post('check-user', data, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Verify Firebase OTP and login
 * @param {Object} data - Login data
 * @param {string} data.idToken - Firebase ID token
 * @param {string} [data.role] - User role (optional)
 * @returns {Promise<Object>} Login response
 */
export const verifyFirebaseOTP = async (data) => {
  try {
    const response = await authApi.post('verify-firebase-otp', data, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Send OTP (for non-Firebase OTP flow)
 * @param {Object} data - OTP data
 * @param {string} data.phone - Phone number
 * @returns {Promise<Object>} OTP send response
 */
export const sendOTP = async (data) => {
  try {
    const response = await authApi.post('send-otp', data, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Verify OTP (for non-Firebase OTP flow)
 * @param {Object} data - OTP verification data
 * @param {string} data.phone - Phone number
 * @param {string} data.otp - OTP code
 * @returns {Promise<Object>} OTP verification response
 */
export const verifyOTP = async (data) => {
  try {
    const response = await authApi.post('verify-otp', data, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get current user profile
 * @param {string} token - JWT token
 * @returns {Promise<Object>} User profile response
 */
export const getUser = async (token) => {
  try {
    const response = await authApi.get('user', {
      headers: getAuthHeaders(token),
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Health check endpoint
 * @returns {Promise<Object>} Health check response
 */
export const healthCheck = async () => {
  try {
    const response = await authApi.get('health');
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export default {
  register,
  checkUserExists,
  verifyFirebaseOTP,
  sendOTP,
  verifyOTP,
  getUser,
  healthCheck,
};

