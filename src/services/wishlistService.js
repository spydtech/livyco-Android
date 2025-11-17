import {API_BASE_URL} from '../config/BaseUrl';
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

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}wishlist/user/${userId}`, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();
    
    return {
      success: data?.success || false,
      data: data?.wishlistItems || [],
      message: data?.message || '',
      count: data?.count || 0,
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

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}wishlist/add`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        userId,
        propertyId,
      }),
    });

    const data = await response.json();
    
    return {
      success: data?.success || false,
      message: data?.message || '',
      data: data?.wishlistItem || null,
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

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}wishlist/check/${userId}/${propertyId}`, {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();
    
    return {
      success: data?.success || false,
      isInWishlist: data?.isInWishlist || false,
      message: data?.message || '',
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

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}wishlist/remove/${userId}/${propertyId}`, {
      method: 'DELETE',
      headers: headers,
    });

    const data = await response.json();
    
    return {
      success: data?.success || false,
      message: data?.message || '',
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

