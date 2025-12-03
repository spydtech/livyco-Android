import {apiGet, apiPost, apiDelete} from '../utils/apiCall';
import {getUserToken} from '../utils/Api';
import {getUserIdFromToken} from '../utils/jwtUtils';

/**
 * Get user's wishlist
 * @returns {Promise<Object>} Wishlist response
 */
export const getUserWishlist = async () => {
  try {
    const token = await getUserToken();
    if (!token) {
      return {
        success: false,
        data: [],
        message: 'User not authenticated',
      };
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return {
        success: false,
        data: [],
        message: 'Unable to get user ID from token',
      };
    }

    const response = await apiGet(`wishlist/user/${userId}`);
    
    return {
      success: response.success || false,
      data: response.data?.wishlistItems || [],
      message: response.message || '',
      count: response.data?.count || 0,
    };
  } catch (error) {
    console.error('Get wishlist error:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch wishlist',
    };
  }
};

/**
 * Add property to wishlist
 * @param {string} propertyId - Property ID to add
 * @returns {Promise<Object>} Add response
 */
export const addToWishlist = async (propertyId) => {
  try {
    const token = await getUserToken();
    if (!token) {
      return {
        success: false,
        message: 'User not authenticated',
      };
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return {
        success: false,
        message: 'Unable to get user ID from token',
      };
    }

    const response = await apiPost('wishlist/add', {
      userId,
      propertyId,
    });
    
    return {
      success: response.success || false,
      message: response.message || '',
      data: response.data?.wishlistItem || null,
    };
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return {
      success: false,
      message: error.message || 'Failed to add to wishlist',
    };
  }
};

/**
 * Check if property is in user's wishlist
 * @param {string} propertyId - Property ID to check
 * @returns {Promise<Object>} Status response
 */
export const checkWishlistStatus = async (propertyId) => {
  try {
    const token = await getUserToken();
    if (!token) {
      return {
        success: false,
        isInWishlist: false,
        message: 'User not authenticated',
      };
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return {
        success: false,
        isInWishlist: false,
        message: 'Unable to get user ID from token',
      };
    }

    const response = await apiGet(`wishlist/check/${userId}/${propertyId}`);
    
    return {
      success: response.success || false,
      isInWishlist: response.data?.isInWishlist || false,
      message: response.message || '',
    };
  } catch (error) {
    console.error('Check wishlist status error:', error);
    return {
      success: false,
      isInWishlist: false,
      message: error.message || 'Failed to check wishlist status',
    };
  }
};

/**
 * Remove property from wishlist
 * @param {string} propertyId - Property ID to remove
 * @returns {Promise<Object>} Remove response
 */
export const removeFromWishlist = async (propertyId) => {
  try {
    const token = await getUserToken();
    if (!token) {
      return {
        success: false,
        message: 'User not authenticated',
      };
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return {
        success: false,
        message: 'Unable to get user ID from token',
      };
    }

    const response = await apiDelete(`wishlist/remove/${userId}/${propertyId}`);
    
    return {
      success: response.success || false,
      message: response.message || '',
    };
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return {
      success: false,
      message: error.message || 'Failed to remove from wishlist',
    };
  }
};

export default {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
};

