import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../config/BaseUrl';

const Api = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
  timeout: 30000, // Increased timeout for better reliability
});

const TOKEN_KEY = 'userToken';

// Get user token from AsyncStorage
export const getUserToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token || null;
  } catch (error) {
    console.error('Error getting token from AsyncStorage:', error);
    return null;
  }
};

// Set user token in AsyncStorage
export const setUserToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    // Also set in global for backward compatibility during transition
    global.userToken = token;
  } catch (error) {
    console.error('Error storing token in AsyncStorage:', error);
  }
};

// Clear user token from AsyncStorage
export const clearUserToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    global.userToken = null;
  } catch (error) {
    console.error('Error removing token from AsyncStorage:', error);
  }
};

// Get token synchronously (for backward compatibility with existing code)
// Note: This will return null initially, but will be populated after async load
export const getUserTokenSync = () => {
  return global.userToken || null;
};

// Initialize token from AsyncStorage on app start
// Call this function in App.js or SplashScreen to load token into memory
export const initializeToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      global.userToken = token;
    }
    return token;
  } catch (error) {
    console.error('Error initializing token:', error);
    return null;
  }
};

// Without token post method call
const getAuthPostHeader = () => {
  const authHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return authHeaders;
};

// With token post method call
const getPostHeader = async () => {
  const token = await getUserToken();
  const userHeader = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return userHeader;
};

// With token for form data header method call
const getPostFormDataHeader = async () => {
  const token = await getUserToken();
  const userHeader = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  };
  return userHeader;
};

// Without token get method call
const getAuthHeader = () => {
  const authHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return authHeaders;
};

// With token get method call
const getHeader = async () => {
  const token = await getUserToken();
  const userHeader = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return userHeader;
};

// Request interceptor for API calls
Api.interceptors.request.use(
  async request => {
    // Check if request data is FormData
    const isFormData = request.data instanceof FormData;
    
    if (request.method === 'get') {
      // Calling get method here
      if (request.url === '') {
        // For without token called Auth
        request.headers = getAuthHeader();
      } else {
        request.headers = await getHeader();
      }
    } else if (request.method === 'post' || request.method === 'put') {
      if (isFormData) {
        // For FormData requests, use form data header
        request.headers = await getPostFormDataHeader();
        // Don't set Content-Type - let axios set it with boundary
        delete request.headers['Content-Type'];
      } else if (request.url === 'categories') {
        // For without token called Auth
        request.headers = getAuthPostHeader();
      } else {
        request.headers = await getPostHeader();
      }
    }

    return request;
  },
  error => {
    Promise.reject(error);
  },
);
// Response interceptor for API calls
Api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.log('i am res in error===>', JSON.stringify(error));
    console.log('i am in print error.response.status=>', error.response);
    if (error.response) {
      if (error.response.status === 403) {
        return error.response;
      } else if (error.response.status === 404) {
        return error.response.data;
      } else if (error.response.status === 500) {
        return error;
      }
      return error.response;
    }
    // If no response, return the error as is
    return Promise.reject(error);
  },
);

export default Api;
