// Firebase Configuration
import auth from '@react-native-firebase/auth';
import { isDevelopment, DEV_STATIC_OTP, DEV_STATIC_PHONE_FORMATTED } from '../utils/Environment';

/**
 * Send OTP to phone number using Firebase Authentication
 * In development mode, uses actual phone number but accepts static OTP "123456"
 * In production mode, uses normal Firebase OTP flow
 * @param {string} phoneNumber - Phone number in E.164 format (e.g., +919876543210)
 * @returns {Promise<Object>} Confirmation result
 */
export const sendFirebaseOTP = async (phoneNumber) => {
  try {
    if (isDevelopment()) {
      // Dev mode: Skip Firebase OTP sending, create mock confirmation
      const mockConfirmation = {
        _isDevMode: true,
        _staticPhone: DEV_STATIC_PHONE_FORMATTED,
        _originalPhone: phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`,
        confirm: async () => null,
      };
      return {
        success: true,
        confirmation: mockConfirmation,
        message: `OTP sent successfully. In development mode, use static OTP "${DEV_STATIC_OTP}" to verify.`,
      };
    }
    
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+91${phoneNumber}`;
    const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
    
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
 * Verify OTP code with Firebase
 * In development mode, accepts static OTP "123456" and uses actual phone number for token
 * In production mode, uses normal Firebase verification
 * @param {Object} confirmation - Confirmation object from sendFirebaseOTP
 * @param {string} code - OTP code entered by user
 * @param {string} originalPhoneNumber - Original phone number (for dev mode)
 * @returns {Promise<Object>} User credential with ID token
 */
export const verifyFirebaseOTPCode = async (confirmation, code, originalPhoneNumber = null) => {
  try {
    if (isDevelopment() && code === DEV_STATIC_OTP) {
      // Dev mode: Use Firebase test number to get valid token without sending OTP
      const testPhone = '+918469084711';
      const testConfirmation = await auth().signInWithPhoneNumber(testPhone);
      const testCredential = await testConfirmation.confirm(code);
      const testIdToken = await testCredential.user.getIdToken();
      
      return {
        success: true,
        idToken: testIdToken,
        user: testCredential.user,
        message: 'OTP verified successfully (Dev Mode)',
        isDevMode: true,
      };
    }
    
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
    
    if (isDevelopment() && code === DEV_STATIC_OTP) {
      return {
        success: false,
        error: error.message,
        message: `In development mode, please use the static OTP "${DEV_STATIC_OTP}".`,
      };
    }
    
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

