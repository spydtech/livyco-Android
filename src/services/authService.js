import {apiGet, apiPost, apiPut, apiDelete} from '../utils/apiCall';

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
    const response = await apiPost('auth/register', userData, {requireAuth: false});
    console.log("responsee register", response);
    return response;
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Registration failed',
      error: error.message,
    };
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
    return await apiPost('auth/check-user', data, {requireAuth: false});
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to check user',
      error: error.message,
    };
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
    return await apiPost('auth/verify-firebase-otp', data, {requireAuth: false});
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'OTP verification failed',
      error: error.message,
    };
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
    return await apiPost('auth/send-otp', data, {requireAuth: false});
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to send OTP',
      error: error.message,
    };
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
    return await apiPost('auth/verify-otp', data, {requireAuth: false});
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'OTP verification failed',
      error: error.message,
    };
  }
};

/**
 * Get current user profile
 * @param {string} token - JWT token (optional, will be fetched automatically if not provided)
 * @returns {Promise<Object>} User profile response
 */
export const getUser = async (token) => {
  try {
    // If token is provided, we'll still use the apiCall which handles auth automatically
    // But we can pass it as a custom header if needed
    const options = token ? {headers: {Authorization: `Bearer ${token}`}} : {};
    return await apiGet('auth/user', options);
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to get user profile',
      error: error.message,
    };
  }
};

/**
 * Upload profile image
 * @param {FormData} formData - FormData containing profileImage file
 * @returns {Promise<Object>} Upload profile image response
 */
export const uploadProfileImage = async (formData) => {
  try {
    return await apiPost('auth/user/upload-profile-image', formData, {
      isFormData: true,
      requireAuth: true,
    });
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to upload profile image',
      error: error.message,
    };
  }
};

/**
 * Update user profile (without profile image)
 * @param {Object} profileData - User profile fields (JSON object, not FormData)
 * @returns {Promise<Object>} Update profile response
 */
export const updateUserProfile = async (profileData) => {
  try {
    return await apiPut('auth/user/profile', profileData, {
      isFormData: false,
      requireAuth: true,
    });
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to update profile',
      error: error.message,
    };
  }
};

/**
 * Health check endpoint
 * @returns {Promise<Object>} Health check response
 */
export const healthCheck = async () => {
  try {
    return await apiGet('auth/health', {requireAuth: false});
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Health check failed',
      error: error.message,
    };
  }
};

/**
 * Delete user account/profile
 * @returns {Promise<Object>} Delete account response
 */
export const deleteUserAccount = async () => {
  try {
    const response = await apiDelete('auth/profile', {
      requireAuth: true,
    });
    
    // Log response for debugging
    console.log('Delete account response:', response);
    
    return response;
  } catch (error) {
    console.error('Delete account error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to delete account',
      error: error.message,
      status: error.status,
    };
  }
};

/**
 * Sign in with Google
 * @param {Object} data - Google sign-in data
 * @param {string} data.token - Firebase ID token from Google Sign-In
 * @param {string} [data.role='user'] - User role (optional)
 * @param {string} [data.email] - User email (optional, from Google)
 * @param {string} [data.name] - User name (optional, from Google)
 * @param {string} [data.photo] - User photo URL (optional, from Google)
 * @returns {Promise<Object>} Google sign-in response
 */
export const googleSignIn = async (data) => {
  try {
    return await apiPost('auth/google-signin', data, {requireAuth: false});
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Google sign-in failed',
      error: error.message,
    };
  }
};

export default {
  register,
  checkUserExists,
  verifyFirebaseOTP,
  sendOTP,
  verifyOTP,
  getUser,
  uploadProfileImage,
  updateUserProfile,
  healthCheck,
  deleteUserAccount,
  googleSignIn,
};

