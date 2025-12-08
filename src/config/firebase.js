// Firebase Configuration
import auth from '@react-native-firebase/auth';
import {sendOTP} from '../services/authService';
import {isDevelopment} from '../utils/Environment';

/**
 * Send OTP to phone number
 * In development mode, uses backend API (/send-otp) to reduce Firebase costs
 * In production mode, uses Firebase Authentication
 * @param {string} phoneNumber - Phone number (10 digits or E.164 format)
 * @returns {Promise<Object>} Confirmation result
 */
export const sendFirebaseOTP = async (phoneNumber) => {
  // In development, use backend API instead of Firebase
  if (isDevelopment()) {
    try {
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber.replace('+91', '') 
        : phoneNumber;
      
      const response = await sendOTP({ phone: formattedPhone });
      
      if (response.success) {
        // Return a mock confirmation object for development
        // The actual OTP verification will be done via backend
        return {
          success: true,
          confirmation: {
            phoneNumber: formattedPhone,
            isDevelopment: true,
          },
          message: response.message || 'OTP sent successfully',
        };
      } else {
        return {
          success: false,
          error: response.error,
          message: response.message || 'Failed to send OTP',
        };
      }
    } catch (error) {
      console.error('Backend OTP send error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send OTP. Please try again.',
      };
    }
  }
  
  // In production, use Firebase
  try {
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+91${phoneNumber}`;
    const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
    console.log("confirmation", confirmation);
    
    return {
      success: true,
      confirmation,
      message: 'OTP sent successfully',
    };
  } catch (error) {
    console.error('Firebase OTP send error:', error);
    return {
      success: false,
      error: error.message,
      message: getFirebaseErrorMessage(error.code),
    };
  }
};

/**
 * Verify OTP code
 * In development mode, uses backend API (/verify-otp) to reduce Firebase costs
 * In production mode, uses Firebase Authentication
 * @param {Object} confirmation - Confirmation object from sendFirebaseOTP
 * @param {string} code - OTP code entered by user
 * @param {string} originalPhoneNumber - Original phone number
 * @returns {Promise<Object>} User credential with ID token (or token from backend in dev)
 */
export const verifyFirebaseOTPCode = async (confirmation, code, originalPhoneNumber = null) => {
  // In development, use backend API instead of Firebase
  if (isDevelopment() && confirmation?.isDevelopment) {
    try {
      const phone = confirmation.phoneNumber || originalPhoneNumber;
      const formattedPhone = phone?.startsWith('+') 
        ? phone.replace('+91', '') 
        : phone;
      
      // Import verifyOTP from authService
      const {verifyOTP} = require('../services/authService');
      const response = await verifyOTP({ 
        phone: formattedPhone, 
        otp: code 
      });
      
      if (response.success && response.data?.token) {
        // Return a format similar to Firebase for compatibility
        return {
          success: true,
          idToken: response.data.token, // In dev, we return the JWT token directly
          token: response.data.token, // Also include token for direct use
          user: response.data.user,
          message: response.message || 'OTP verified successfully',
        };
      } else {
        return {
          success: false,
          error: response.error,
          message: response.message || 'Invalid OTP. Please try again.',
        };
      }
    } catch (error) {
      console.error('Backend OTP verification error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to verify OTP. Please try again.',
      };
    }
  }
  
  // In production, use Firebase
  try {
    const userCredential = await confirmation.confirm(code);
    const idToken = await userCredential.user.getIdToken();
    
    return {
      success: true,
      idToken,
      user: userCredential.user,
      message: 'OTP verified successfully',
    };
  } catch (error) {
    console.error('Firebase OTP verification error:', error);
    
    return {
      success: false,
      error: error.message,
      message: getFirebaseErrorMessage(error.code),
    };
  }
};

/**
 * Get user-friendly error messages from Firebase error codes
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
 */
const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/invalid-phone-number': 'Invalid phone number. Please check and try again.',
    'auth/too-many-requests': 'Too many requests. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/invalid-verification-code': 'Invalid OTP code. Please try again.',
    'auth/session-expired': 'OTP session expired. Please request a new OTP.',
    'auth/code-expired': 'OTP code has expired. Please request a new OTP.',
    'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
  };
  
  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};

export default {
  sendFirebaseOTP,
  verifyFirebaseOTPCode,
};

