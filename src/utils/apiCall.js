import {API_BASE_URL} from '../config/BaseUrl';
import {getUserToken, clearUserToken} from './Api';
import {showMessage} from 'react-native-flash-message';
import {CommonActions} from '@react-navigation/native';
import {navigationRef} from './navigationRef';

/**
 * Reusable API calling function using fetch
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Fetch options
 * @param {string} options.method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {Object} options.body - Request body (will be JSON stringified if not FormData)
 * @param {Object} options.headers - Additional headers
 * @param {boolean} options.requireAuth - Whether authentication token is required (default: true)
 * @param {boolean} options.isFormData - Whether body is FormData (default: false)
 * @returns {Promise<Object>} API response with success, data, message, and error fields
 */
export const apiCall = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    requireAuth = true,
    isFormData = false,
  } = options;

  try {
    // Get token if authentication is required
    let token = null;
    if (requireAuth) {
      token = await getUserToken();
      if (!token) {
        return {
          success: false,
          data: null,
          message: 'User not authenticated',
          error: 'No token found',
        };
      }
    }

    // Prepare headers
    const requestHeaders = {
      'Accept': 'application/json',
      ...headers,
    };

    // Prepare request body
    let requestBody = null;
    if (body) {
      if (isFormData || body instanceof FormData) {
        requestBody = body;
        // Don't set Content-Type for FormData - let fetch set it automatically with boundary
        // React Native fetch will automatically set multipart/form-data with boundary
      } else {
        requestBody = JSON.stringify(body);
        // Set Content-Type for JSON body
        requestHeaders['Content-Type'] = 'application/json';
      }
    } else {
      // For DELETE and GET requests without body, don't set Content-Type
      // Some servers reject requests with Content-Type header but no body
      if (method.toUpperCase() !== 'DELETE' && method.toUpperCase() !== 'GET') {
        requestHeaders['Content-Type'] = 'application/json';
      }
    }

    // Add authorization header if token exists
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Make API call
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: method.toUpperCase(),
      headers: requestHeaders,
      body: requestBody,
    });

    // Parse response
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = {message: text || 'Unknown error'};
      }
    }

    // Handle token expiration errors (401, 403)
    if (response.status === 401 || response.status === 403) {
      const errorMessage = responseData?.message || 'Session expired. Please login again.';
      
      // Clear token
      await clearUserToken();
      
      // Show error message
      showMessage({
        message: 'Session Expired',
        description: errorMessage,
        type: 'danger',
        floating: true,
        statusBarHeight: 40,
        icon: 'auto',
        autoHide: true,
        duration: 3000,
      });

      // Navigate to login screen
      if (navigationRef.isReady()) {
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
      }

      return {
        success: false,
        data: null,
        message: errorMessage,
        error: 'Token expired',
        status: response.status,
      };
    }

    // Handle other error status codes
    if (!response.ok) {
      return {
        success: false,
        data: responseData?.data || null,
        message: responseData?.message || `Request failed with status ${response.status}`,
        error: responseData?.error || response.statusText,
        status: response.status,
      };
    }

    // Success response
    return {
      success: responseData?.success !== undefined ? responseData.success : true,
      data: responseData?.data !== undefined ? responseData.data : responseData,
      message: responseData?.message || '',
      error: null,
      status: response.status,
    };
  } catch (error) {
    console.error('API call error:', error);
    
    // Handle network errors
    let errorMessage = 'Network error. Please check your internet connection.';
    if (error.message) {
      if (error.message.includes('Network request failed')) {
        errorMessage = 'Network request failed. Please check your internet connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout. Please try again.';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      data: null,
      message: errorMessage,
      error: error.message || 'Network error',
    };
  }
};

/**
 * Convenience methods for common HTTP methods
 */
export const apiGet = (endpoint, options = {}) => {
  return apiCall(endpoint, {...options, method: 'GET'});
};

export const apiPost = (endpoint, body, options = {}) => {
  return apiCall(endpoint, {...options, method: 'POST', body});
};

export const apiPut = (endpoint, body, options = {}) => {
  return apiCall(endpoint, {...options, method: 'PUT', body});
};

export const apiPatch = (endpoint, body, options = {}) => {
  return apiCall(endpoint, {...options, method: 'PATCH', body});
};

export const apiDelete = (endpoint, options = {}) => {
  return apiCall(endpoint, {...options, method: 'DELETE'});
};

export default apiCall;

