// API Configuration
// Set to 'development' for local development or 'production' for live server
const ENVIRONMENT = !__DEV__ ? 'development' : 'production';

// API URLs
const API_URLS = {
  development: 'http://192.168.0.8:5000/api/', // Local development server - UPDATE THIS IP!
  production: 'https://api.livyco.com/api/', // Production server (update if different)
  // Alternative production URL: 'http://82.29.161.78:5000/api/'
};

// Fallback URL if environment URL is not available
const FALLBACK_URL = 'http://82.29.161.78:5000/api/';

export const API_BASE_URL = API_URLS[ENVIRONMENT] || FALLBACK_URL;
export const URL = API_BASE_URL;
export const IMAGE_URL = 'https://google.com/'; // Main URL + Add Image folder name
export const BASE_URL = API_BASE_URL; // Main API URL

export const RAZORPAY_KEY_ID = 'rzp_live_RWWvXeMcmTohhi';
// export const RAZORPAY_KEY_ID = __DEV__ ? 'rzp_test_RAk2W9hoDqrojA' : 'rzp_live_RWWvXeMcmTohhi';
