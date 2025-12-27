import {apiGet, apiPost} from '../utils/apiCall';

/**
 * Chatbot Service - Handles all chatbot-related API calls
 */

/**
 * Process a chatbot message
 * @param {string} message - User message
 * @param {string} sessionId - Optional session ID for conversation continuity
 * @returns {Promise<Object>} Chatbot response
 */
export const processChatbotMessage = async (message, sessionId = null) => {
  try {
    if (!message || !message.trim()) {
      return {
        success: false,
        data: null,
        message: 'Message is required',
      };
    }

    const response = await apiPost(
      'chatbot/chat',
      {
        message: message.trim(),
        sessionId: sessionId,
      },
      {
        requireAuth: false, // Chatbot endpoint is public
      }
    );

    return {
      success: response.success !== false,
      data: response.data || response,
      message: response.message || '',
      sessionId: response.data?.sessionId || response.sessionId || sessionId,
      response: response.data?.response || response.response || '',
      quickReplies: response.data?.quickReplies || response.quickReplies || [],
      actions: response.data?.actions || response.actions || [],
      intent: response.data?.intent || response.intent || 'other',
      properties: response.data?.properties || response.properties || [],
    };
  } catch (error) {
    console.error('Process chatbot message error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to process message',
    };
  }
};

/**
 * Get chatbot conversation history
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Conversation history
 */
export const getChatbotHistory = async (sessionId) => {
  try {
    if (!sessionId) {
      return {
        success: false,
        data: [],
        message: 'Session ID is required',
      };
    }

    // History endpoint requires authentication (verifyToken)
    const response = await apiGet(`chatbot/history/${sessionId}`, {
      requireAuth: true, // This endpoint requires authentication
    });

    return {
      success: response.success !== false,
      data: response.data?.history || response.history || [],
      message: response.message || '',
    };
  } catch (error) {
    console.error('Get chatbot history error:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch history',
    };
  }
};

/**
 * Get FAQs
 * @returns {Promise<Object>} FAQs response
 */
export const getFAQs = async () => {
  try {
    const response = await apiGet('chatbot/faqs', {
      requireAuth: false, // FAQs endpoint is public
    });

    return {
      success: response.success !== false,
      data: response.data?.faqs || response.faqs || {},
      allFAQs: response.data?.allFAQs || response.allFAQs || [],
      message: response.message || '',
    };
  } catch (error) {
    console.error('Get FAQs error:', error);
    return {
      success: false,
      data: {},
      allFAQs: [],
      message: error.message || 'Failed to fetch FAQs',
    };
  }
};

/**
 * Get session info
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Session info
 */
export const getChatbotSessionInfo = async (sessionId) => {
  try {
    if (!sessionId) {
      return {
        success: false,
        data: null,
        message: 'Session ID is required',
      };
    }

    const response = await apiGet(`chatbot/session/${sessionId}`, {
      requireAuth: false, // Session info endpoint is public
    });

    return {
      success: response.success !== false,
      data: response.data?.session || response.session || null,
      message: response.message || '',
    };
  } catch (error) {
    console.error('Get chatbot session info error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to fetch session info',
    };
  }
};

/**
 * Clear conversation
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Clear conversation response
 */
export const clearChatbotConversation = async (sessionId) => {
  try {
    if (!sessionId) {
      return {
        success: false,
        message: 'Session ID is required',
      };
    }

    const response = await apiPost('chatbot/clear', {
      sessionId: sessionId,
    });

    return {
      success: response.success !== false,
      message: response.message || 'Conversation cleared',
    };
  } catch (error) {
    console.error('Clear chatbot conversation error:', error);
    return {
      success: false,
      message: error.message || 'Failed to clear conversation',
    };
  }
};

