import { getUserToken } from './Api';
import { getUser } from '../services/authService';

/**
 * Check if the current user is a guest (not fully registered)
 * A user is considered a guest if:
 * - They don't have a token, OR
 * - They have a token but haven't completed registration (missing name, phone, or location)
 * 
 * @returns {Promise<boolean>} True if user is a guest, false if fully registered
 */
export const isGuestUser = async () => {
  try {
    const token = await getUserToken();
    
    // No token means guest
    if (!token) {
      return true;
    }

    // Check if user has completed registration
    const userResponse = await getUser(token);
    
    if (!userResponse.success || !userResponse.data?.user) {
      return true;
    }

    const user = userResponse.data.user;
    
    // Check if user has completed registration (has name, phone, and location)
    const hasName = user.name && user.name.trim() !== '';
    const hasPhone = user.phone && user.phone.trim() !== '';
    const hasLocation = user.location && user.location.trim() !== '';
    
    // If any required field is missing, user is a guest
    if (!hasName || !hasPhone || !hasLocation) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking guest status:', error);
    // On error, assume guest
    return true;
  }
};

/**
 * Show alert for guest users and navigate to Register screen
 * @param {Object} navigation - Navigation object from React Navigation
 */
export const showGuestRestrictionAlert = (navigation) => {
  const { Alert } = require('react-native');
  
  Alert.alert(
    'Registration Required',
    'You need to register first to access this feature. Please complete your registration to continue.',
    [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('Login');
        },
      },
    ],
    { cancelable: false }
  );
};

