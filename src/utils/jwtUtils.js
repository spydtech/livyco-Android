/**
 * Base64 decode for React Native
 * @param {string} str - Base64 string
 * @returns {string} Decoded string
 */
const base64Decode = (str) => {
  try {
    // React Native compatible base64 decode
    // Convert base64 to bytes
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    
    str = str.replace(/[^A-Za-z0-9\+\/\=]/g, '');
    
    for (let i = 0; i < str.length; i += 4) {
      const enc1 = chars.indexOf(str.charAt(i));
      const enc2 = chars.indexOf(str.charAt(i + 1));
      const enc3 = chars.indexOf(str.charAt(i + 2));
      const enc4 = chars.indexOf(str.charAt(i + 3));
      
      const chr1 = (enc1 << 2) | (enc2 >> 4);
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      const chr3 = ((enc3 & 3) << 6) | enc4;
      
      output += String.fromCharCode(chr1);
      
      if (enc3 !== 64) {
        output += String.fromCharCode(chr2);
      }
      if (enc4 !== 64) {
        output += String.fromCharCode(chr3);
      }
    }
    
    return decodeURIComponent(escape(output));
  } catch (error) {
    console.error('Base64 decode error:', error);
    return '';
  }
};

/**
 * Decode JWT token without external dependencies
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload or null
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;
    
    // JWT has 3 parts: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    
    // Decode base64 using React Native compatible method
    const decoded = base64Decode(padded);
    
    // Parse JSON
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Get user ID from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} User ID or null
 */
export const getUserIdFromToken = (token) => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded) return null;
    
    // The token has 'id' field (from jwtUtils.js in backend)
    // Also check for 'clientId' as fallback (some tokens might use it)
    const userId = decoded.id || decoded.userId || decoded._id;
    
    // Convert to string if it's an ObjectId
    return userId ? String(userId) : null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
};

