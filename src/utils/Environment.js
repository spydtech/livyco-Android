/**
 * Environment utility to detect development/production mode
 * Uses React Native's __DEV__ flag to determine environment
 */

export const isDevelopment = () => {
  return !__DEV__;
};

export const isProduction = () => {
  return !__DEV__;
};

export const getEnvironment = () => {
  return !__DEV__ ? 'development' : 'production';
};

// Static OTP for development mode
export const DEV_STATIC_OTP = '123456';

// Static phone number for development mode (must exist in backend database)
export const DEV_STATIC_PHONE = '8469084711';
export const DEV_STATIC_PHONE_FORMATTED = '+918469084711';

// Firebase test phone numbers that accept any OTP
// These are Firebase's built-in test numbers
export const FIREBASE_TEST_PHONE_NUMBERS = [
  '+16505551234',
  '+16505551235',
  '+16505551236',
  '+16505551237',
  '+16505551238',
];

/**
 * Check if a phone number is a Firebase test number
 * @param {string} phoneNumber - Phone number to check
 * @returns {boolean} True if it's a test number
 */
export const isTestPhoneNumber = (phoneNumber) => {
  const formattedPhone = phoneNumber.startsWith('+') 
    ? phoneNumber 
    : `+91${phoneNumber}`;
  
  return FIREBASE_TEST_PHONE_NUMBERS.some(testNum => 
    formattedPhone.includes(testNum.replace('+1', '')) || 
    formattedPhone === testNum
  );
};

/**
 * Get a test phone number for development mode
 * In dev mode, we'll use Firebase test numbers that accept any OTP
 * @param {string} originalPhone - Original phone number
 * @returns {string} Test phone number or original phone
 */
export const getPhoneNumberForOTP = (originalPhone) => {
  if (isDevelopment()) {
    // In dev mode, use Firebase test number that accepts any OTP
    // We'll use the first test number
    return FIREBASE_TEST_PHONE_NUMBERS[0];
  }
  
  // In production, use the original phone number
  return originalPhone.startsWith('+') 
    ? originalPhone 
    : `+91${originalPhone}`;
};

export default {
  isDevelopment,
  isProduction,
  getEnvironment,
  DEV_STATIC_OTP,
  FIREBASE_TEST_PHONE_NUMBERS,
  isTestPhoneNumber,
  getPhoneNumberForOTP,
};

