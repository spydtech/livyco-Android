import Api from '../utils/Api';
import {API_BASE_URL} from '../config/BaseUrl';

/**
 * Get all properties for home page (trending/recently viewed)
 * @returns {Promise<Object>} Properties response
 */
export const getAllProperties = async () => {
  try {
    const response = await Api.get('auth/properties/client-all');
    return {
      success: response.data?.success || false,
      data: response.data?.data || [],
      message: response.data?.message || '',
    };
  } catch (error) {
    console.error('Get all properties error:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch properties',
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

export default {
  getAllProperties,
  getApprovedReviews,
};

