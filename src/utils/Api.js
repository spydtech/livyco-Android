import axios from 'axios';
import {BASE_URL} from '../config/BaseUrl';

const Api = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
  timeout: 30000, // Increased timeout for better reliability
});

// Get user token from global storage
const getUserToken = () => {
  return global.userToken || null;
};

// Set user token globally
export const setUserToken = (token) => {
  global.userToken = token;
  // Optionally store in AsyncStorage for persistence
  // AsyncStorage.setItem('userToken', token);
};

// Clear user token
export const clearUserToken = () => {
  global.userToken = null;
  // Optionally clear from AsyncStorage
  // AsyncStorage.removeItem('userToken');
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
const getPostHeader = () => {
  const token = getUserToken();
  const userHeader = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return userHeader;
};

// With token for form data header method call
const getPostFormDataHeader = () => {
  const token = getUserToken();
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
const getHeader = () => {
  const token = getUserToken();
  const userHeader = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return userHeader;
};

// Request interceptor for API calls

Api.interceptors.request.use(
  request => {
    if (request.method === 'get') {
      // Calling get method here
      if (request.url === '') {
        // For without token called Auth
        request.headers = getAuthHeader();
      } else {
        request.headers = getHeader();
      }
    } else if (request.method === 'post') {
      if (request.url === 'categories') {
        // For without token called Auth
        request.headers = getAuthPostHeader();
      } else {
        request.headers = getPostHeader();
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
    if (error.response.status === 403) {
      return error.response;
    } else if (error.response.status === 404) {
      return error.response.data;
    } else if (error.response.status === 500) {
      return error;
    }
    return error.response;
  },
);

export default Api;
