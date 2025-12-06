import {apiGet, apiPost} from '../utils/apiCall';

/**
 * Chat Service - Handles all chat-related API calls
 */

/**
 * Get all conversations for the current user
 * @returns {Promise<Object>} Conversations response
 */
export const getConversations = async () => {
  try {
    const response = await apiGet('chat/conversations');
    return {
      success: response.success || false,
      data: response.data?.conversations || [],
      message: response.message || '',
    };
  } catch (error) {
    console.error('Get conversations error:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch conversations',
    };
  }
};

/**
 * Get messages between current user and recipient for a specific property
 * @param {string} recipientId - Recipient user ID
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>} Messages response
 */
export const getMessages = async (recipientId, propertyId) => {
  try {
    if (!recipientId || !propertyId) {
      return {
        success: false,
        data: [],
        message: 'Recipient ID and Property ID are required',
      };
    }

    const response = await apiGet(`chat/messages/${recipientId}/${propertyId}`);
    return {
      success: response.success || false,
      data: response.data?.messages || [],
      message: response.message || '',
    };
  } catch (error) {
    console.error('Get messages error:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch messages',
    };
  }
};

/**
 * Send a message
 * @param {string} recipientId - Recipient user ID
 * @param {string} propertyId - Property ID
 * @param {string} content - Message content
 * @returns {Promise<Object>} Send message response
 */
export const sendMessage = async (recipientId, propertyId, content) => {
  try {
    if (!recipientId || !propertyId || !content?.trim()) {
      return {
        success: false,
        data: null,
        message: 'Recipient ID, Property ID, and content are required',
      };
    }

    const response = await apiPost('chat/messages', {
      recipientId,
      propertyId,
      content: content.trim(),
    });

    return {
      success: response.success || false,
      data: response.data?.message || null,
      message: response.message || '',
    };
  } catch (error) {
    console.error('Send message error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to send message',
    };
  }
};

/**
 * Get unread message count
 * @returns {Promise<Object>} Unread count response
 */
export const getUnreadCount = async () => {
  try {
    const response = await apiGet('chat/messages/unread');
    return {
      success: response.success || false,
      data: response.data?.count || 0,
      message: response.message || '',
    };
  } catch (error) {
    console.error('Get unread count error:', error);
    return {
      success: false,
      data: 0,
      message: error.message || 'Failed to get unread count',
    };
  }
};

