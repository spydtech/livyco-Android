import {apiGet, apiPatch} from '../utils/apiCall';

/**
 * Get user notifications
 * @param {Object} params - Query parameters (page, limit, unreadOnly, type)
 * @returns {Promise<Object>} Notifications response
 */
export const getUserNotifications = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `notifications?${queryString}` : 'notifications';
    
    const response = await apiGet(endpoint);
    
    if (!response.success) {
      return {
        success: false,
        data: {
          notifications: [],
          unreadCount: 0,
          total: 0,
          currentPage: params.page || 1,
          totalPages: 1,
        },
        message: response.message || 'Failed to fetch notifications',
      };
    }

    return {
      success: true,
      data: {
        notifications: response.data?.notifications || response.data?.data?.notifications || [],
        unreadCount: response.data?.unreadCount || response.data?.data?.unreadCount || 0,
        total: response.data?.total || response.data?.data?.total || 0,
        currentPage: response.data?.currentPage || response.data?.data?.currentPage || params.page || 1,
        totalPages: response.data?.totalPages || response.data?.data?.totalPages || 1,
      },
      message: response.message || '',
    };
  } catch (error) {
    console.error('Get notifications error:', error);
    return {
      success: false,
      data: {
        notifications: [],
        unreadCount: 0,
        total: 0,
      },
      message: error.message || 'Failed to fetch notifications',
    };
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID to mark as read
 * @returns {Promise<Object>} Update response
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiPatch(`notifications/${notificationId}/read`, {});
    return {
      success: response.success || false,
      message: response.message || '',
    };
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return {
      success: false,
      message: error.message || 'Failed to mark notification as read',
    };
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Update response
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await apiPatch('notifications/read-all', {});
    return {
      success: response.success || false,
      message: response.message || '',
    };
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return {
      success: false,
      message: error.message || 'Failed to mark all notifications as read',
    };
  }
};

/**
 * Get unread notification count
 * @returns {Promise<Object>} Unread count response
 */
export const getUnreadCount = async () => {
  try {
    const response = await apiGet('notifications/unread-count');
    return {
      success: response.success || false,
      unreadCount: response.data?.unreadCount || 0,
      message: response.message || '',
    };
  } catch (error) {
    console.error('Get unread count error:', error);
    return {
      success: false,
      unreadCount: 0,
      message: error.message || 'Failed to fetch unread count',
    };
  }
};

export default {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
};

