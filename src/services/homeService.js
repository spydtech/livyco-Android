import {API_BASE_URL} from '../config/BaseUrl';
import {getUserToken} from '../utils/Api';
import Api from '../utils/Api';

/**
 * Get all properties for home page (trending/recently viewed)
 * @returns {Promise<Object>} Properties response
 */
export const getAllProperties = async () => {
  try {
    const token = await getUserToken();
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}auth/properties/client-all`, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();
    
    return {
      success: data?.success || false,
      data: data?.data || [],
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Get all properties error:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch properties',
    };
  }
};

/**
 * Get approved custom reviews for feedback section
 * @returns {Promise<Object>} Reviews response
 */
export const getApprovedReviews = async () => {
  try {
    const response = await Api.get('custom-reviews/admin/approved');
    return {
      success: response.data?.success || false,
      data: response.data?.data || [],
      message: response.data?.message || '',
    };
  } catch (error) {
    console.error('Get approved reviews error:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch reviews',
    };
  }
};

/**
 * Get reviews by property ID
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>} Reviews response
 */
export const getReviewsByProperty = async (propertyId) => {
  try {
    const token = await getUserToken();
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}custom-reviews/property/${propertyId}`, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();
    
    return {
      success: data?.success || false,
      data: data?.data || [],
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Get reviews by property error:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch reviews',
    };
  }
};

/**
 * Get neighborhood/location data by property ID
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>} Location response
 */
export const getLocationByProperty = async (propertyId) => {
  try {
    const token = await getUserToken();
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}map/${propertyId}`, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();
    
    return {
      success: data?.success || false,
      data: data?.location || null,
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Get location by property error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to fetch location data',
    };
  }
};

/**
 * Get map data by property ID
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>} Map response
 */
export const getMapByProperty = async (propertyId) => {
  try {
    const response = await Api.get(`map/${propertyId}`);
    console.log("");
    
    return {
      success: response.data?.success || false,
      data: response.data?.location || null,
      message: response.data?.message || '',
    };
  } catch (error) {
    console.error('Get map by property error:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to fetch map data',
    };
  }
};

/**
 * Get nearby properties (same city)
 * @param {string} city - City name
 * @param {string} excludePropertyId - Property ID to exclude
 * @returns {Promise<Object>} Properties response
 */
export const getNearbyProperties = async (city, excludePropertyId) => {
  try {
    const token = await getUserToken();
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}auth/properties/client-all`, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();
    
    if (data?.success && data?.data) {
      // Filter properties in same city, exclude current property, and limit to 3
      const nearbyProperties = data.data
        .filter(item => 
          item.property?.city === city && 
          item.property?._id !== excludePropertyId &&
          item.property?.status === 'approved'
        )
        .slice(0, 3);
      
      return {
        success: true,
        data: nearbyProperties,
        message: '',
      };
    }
    
    return {
      success: false,
      data: [],
      message: data?.message || '',
    };
  } catch (error) {
    console.error('Get nearby properties error:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch nearby properties',
    };
  }
};

export default {
  getAllProperties,
  getApprovedReviews,
  getReviewsByProperty,
  getLocationByProperty,
  getMapByProperty,
  getNearbyProperties,
};

