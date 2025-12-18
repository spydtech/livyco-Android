import {apiPost, apiGet} from '../utils/apiCall';
import {getUserToken} from '../utils/Api';
import {getUserIdFromToken} from '../utils/jwtUtils';
import {getUser} from './authService';

/**
 * Create a new support ticket
 * @param {Object} ticketData - Ticket data
 * @param {string} ticketData.name - User name
 * @param {string} ticketData.email - User email
 * @param {string} ticketData.phone - User phone number
 * @param {string} ticketData.category - Issue category
 * @param {string} ticketData.comment - Description/comment
 * @returns {Promise<Object>} Response with success status and ticket data
 */
export const createTicket = async (ticketData) => {
  try {
    // Get user info to extract clientId and livycoId
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

    // Get user details to get clientId and livycoId
    const userResponse = await getUser();
    if (!userResponse.success || !userResponse.data?.user) {
      return {
        success: false,
        message: 'Unable to fetch user details',
      };
    }

    const user = userResponse.data.user;
    const clientId = user.id || userId;
    const livycoId = user.clientId || '';

    // Prepare ticket payload
    const payload = {
      clientId,
      livycoId,
      name: ticketData.name,
      email: ticketData.email,
      phone: ticketData.phone,
      category: ticketData.category,
      comment: ticketData.comment || '',
      role: 'user', // As per requirement
    };

    const response = await apiPost('tickets', payload);
    console.log("create ticket response---->",response);
    
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Ticket created successfully',
        ticket: response.data?.ticket || response.data || null,
      };
    }
    
    return {
      success: false,
      message: response.message || 'Failed to create ticket. Please try again.',
      error: response.error || null,
    };
  } catch (error) {
    console.error('Create ticket error:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred. Please try again.',
    };
  }
};

/**
 * Get all tickets for the current user
 * @returns {Promise<Object>} Response with success status and tickets list
 */
export const getUserTickets = async () => {
  try {
    const token = await getUserToken();
    if (!token) {
      return {
        success: false,
        tickets: [],
        message: 'User not authenticated',
      };
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return {
        success: false,
        tickets: [],
        message: 'Unable to get user ID from token',
      };
    }

    const response = await apiGet(`tickets/client/${userId}`);
    
    if (response.success) {
      return {
        success: true,
        tickets: response.data?.tickets || response.data || [],
        count: response.data?.count || 0,
        message: response.message || '',
      };
    }
    
    return {
      success: false,
      tickets: [],
      message: response.message || 'Failed to fetch tickets',
      error: response.error || null,
    };
  } catch (error) {
    console.error('Get user tickets error:', error);
    return {
      success: false,
      tickets: [],
      message: error.message || 'An unexpected error occurred. Please try again.',
    };
  }
};

