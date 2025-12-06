import io from 'socket.io-client';
import {API_BASE_URL} from '../config/BaseUrl';
import {getUserToken} from '../utils/Api';
import {getUserIdFromToken} from '../utils/jwtUtils';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  /**
   * Get socket URL from API base URL
   * Converts https://api.livyco.com/api/ to https://api.livyco.com
   */
  getSocketUrl() {
    const apiUrl = API_BASE_URL.replace(/\/api\/?$/, '');
    return apiUrl;
  }

  /**
   * Connect to socket server
   * @param {string} userId - User ID for authentication
   */
  async connect(userId = null) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    try {
      // Get userId from token if not provided
      if (!userId) {
        const token = await getUserToken();
        if (!token) {
          console.error('No token found, cannot connect socket');
          return;
        }
        userId = getUserIdFromToken(token);
        if (!userId) {
          console.error('Could not extract userId from token');
          return;
        }
      }

      const socketUrl = this.getSocketUrl();
      console.log('Connecting to socket:', socketUrl);

      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      // Connection event handlers
      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
        this.isConnected = true;
        this.authenticate(userId);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('Socket reconnected after', attemptNumber, 'attempts');
        this.isConnected = true;
        this.authenticate(userId);
      });

      this.socket.on('reconnect_error', (error) => {
        console.error('Socket reconnection error:', error);
      });

      this.socket.on('reconnect_failed', () => {
        console.error('Socket reconnection failed');
      });
    } catch (error) {
      console.error('Error connecting socket:', error);
    }
  }

  /**
   * Authenticate user with socket server
   * @param {string} userId - User ID
   */
  authenticate(userId) {
    if (this.socket?.connected && userId) {
      console.log('Authenticating socket with userId:', userId);
      this.socket.emit('authenticate', userId);
    }
  }

  /**
   * Disconnect from socket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
      console.log('Socket disconnected');
    }
  }

  /**
   * Listen to socket events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.socket) {
      console.warn('Socket not initialized. Call connect() first.');
      return () => {};
    }

    this.socket.on(event, callback);
    
    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function (optional)
   */
  off(event, callback) {
    if (!this.socket) return;

    if (callback) {
      this.socket.off(event, callback);
      const listeners = this.listeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    } else {
      this.socket.off(event);
      this.listeners.delete(event);
    }
  }

  /**
   * Emit event to socket server
   * @param {string} event - Event name
   * @param {*} data - Data to send
   */
  emit(event, data) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected. Cannot emit:', event);
      return;
    }
    this.socket.emit(event, data);
  }

  /**
   * Get socket connection status
   * @returns {boolean}
   */
  getConnectionStatus() {
    return this.isConnected && this.socket?.connected;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;

