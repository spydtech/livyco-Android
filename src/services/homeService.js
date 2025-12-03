import {apiGet} from '../utils/apiCall';
import Api from '../utils/Api';

/**
 * Get all properties for home page (trending/recently viewed)
 * @returns {Promise<Object>} Properties response
 */
export const getAllProperties = async () => {
  try {
    const response = await apiGet('auth/properties/client-all', {requireAuth: false});
    return {
      success: response.success || false,
      data: response.data?.data || response.data || [],
      message: response.message || '',
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
    const response = await apiGet(`custom-reviews/property/${propertyId}`, {requireAuth: false});
    return {
      success: response.success || false,
      data: response.data?.data || response.data || [],
      message: response.message || '',
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
    const response = await apiGet(`map/${propertyId}`, {requireAuth: false});
    return {
      success: response.success || false,
      data: response.data?.location || response.data || null,
      message: response.message || '',
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
    const response = await apiGet('auth/properties/client-all', {requireAuth: false});
    
    if (response.success && response.data) {
      const properties = Array.isArray(response.data) ? response.data : response.data.data || [];
      // Filter properties in same city, exclude current property, and limit to 3
      const nearbyProperties = properties
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
      message: response.message || '',
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

