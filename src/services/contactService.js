import {apiGet, apiPost, apiDelete} from '../utils/apiCall';
import {getUserToken} from '../utils/Api';
import {getUserIdFromToken} from '../utils/jwtUtils';

/**
 * Create a contact record when user contacts a client
 * @param {Object} contactData - Contact data
 * @param {string} contactData.propertyId - Property ID
 * @param {string} contactData.propertyName - Property name
 * @param {string} contactData.clientId - Client/Owner ID
 * @param {string} contactData.clientName - Client/Owner name
 * @param {string} contactData.clientPhone - Client/Owner phone
 * @param {string} contactData.contactMethod - Contact method ('call' or 'chat')
 * @param {string} contactData.contactType - Contact type (default: 'inquiry')
 * @param {string} contactData.message - Optional message
 * @returns {Promise<Object>} Contact creation response
 */
export const createContact = async (contactData) => {
  try {
    const token = await getUserToken();
    if (!token) {
      return {
        success: false,
        message: 'User not authenticated',
      };
    }

    const response = await apiPost('contacts/contact', {
      propertyId: contactData.propertyId,
      propertyName: contactData.propertyName,
      clientId: contactData.clientId,
      clientName: contactData.clientName,
      clientPhone: contactData.clientPhone,
      contactMethod: contactData.contactMethod || 'call',
      contactType: contactData.contactType || 'inquiry',
      message: contactData.message || '',
    });
    
    return {
      success: response.success || false,
      message: response.message || '',
      data: response.data || null,
      isUpdated: response.isUpdated || false,
    };
  } catch (error) {
    console.error('Create contact error:', error);
    return {
      success: false,
      message: error.message || 'Failed to create contact',
    };
  }
};

/**
 * Get user's contacts
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 50)
 * @returns {Promise<Object>} Contacts response
 */
export const getUserContacts = async (options = {}) => {
  try {
    const token = await getUserToken();
    if (!token) {
      return {
        success: false,
        data: [],
        message: 'User not authenticated',
      };
    }

    const {page = 1, limit = 50} = options;
    const response = await apiGet(`contacts/user/contacts?page=${page}&limit=${limit}`);
    
    return {
      success: response.success || false,
      data: response.data || [],
      count: response.count || 0,
      total: response.total || 0,
      page: response.page || page,
      totalPages: response.totalPages || 1,
      message: response.message || '',
    };
  } catch (error) {
    console.error('Get user contacts error:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch contacts',
    };
  }
};

/**
 * Delete a contact
 * @param {string} contactId - Contact ID to delete
 * @returns {Promise<Object>} Delete response
 */
export const deleteContact = async (contactId) => {
  try {
    const token = await getUserToken();
    if (!token) {
      return {
        success: false,
        message: 'User not authenticated',
      };
    }

    const response = await apiDelete(`contacts/contact/${contactId}`);
    
    return {
      success: response.success || false,
      message: response.message || '',
    };
  } catch (error) {
    console.error('Delete contact error:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete contact',
    };
  }
};

export default {
  createContact,
  getUserContacts,
  deleteContact,
};

