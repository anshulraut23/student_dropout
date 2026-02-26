// Network Listener - Detects network connectivity changes
import { Network } from '@capacitor/network';

class NetworkListener {
  constructor() {
    this.isOnline = true;
    this.listeners = [];
    this.networkListener = null;
  }

  /**
   * Initialize network listener
   */
  async initialize() {
    try {
      // Get initial network status
      const status = await Network.getStatus();
      this.isOnline = status.connected;

      console.log('📡 Network status:', this.isOnline ? 'Online' : 'Offline');

      // Listen for network changes
      this.networkListener = await Network.addListener('networkStatusChange', (status) => {
        const wasOnline = this.isOnline;
        this.isOnline = status.connected;

        console.log('📡 Network changed:', this.isOnline ? 'Online' : 'Offline');

        // Notify listeners if status changed
        if (wasOnline !== this.isOnline) {
          this.notifyListeners(this.isOnline);
        }
      });

      console.log('✅ Network listener initialized');
    } catch (error) {
      console.error('❌ Failed to initialize network listener:', error);
      // Fallback to online mode if network plugin fails
      this.isOnline = true;
    }
  }

  /**
   * Check if device is online
   */
  async checkStatus() {
    try {
      const status = await Network.getStatus();
      this.isOnline = status.connected;
      return this.isOnline;
    } catch (error) {
      console.error('❌ Failed to check network status:', error);
      return this.isOnline;
    }
  }

  /**
   * Get current network status
   */
  getStatus() {
    return this.isOnline;
  }

  /**
   * Add a listener for network changes
   */
  addListener(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners of network change
   */
  notifyListeners(isOnline) {
    this.listeners.forEach(callback => {
      try {
        callback(isOnline);
      } catch (error) {
        console.error('❌ Listener callback failed:', error);
      }
    });
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    this.listeners = [];
    if (this.networkListener) {
      this.networkListener.remove();
      this.networkListener = null;
    }
  }

  /**
   * Wait for online status
   */
  async waitForOnline(timeout = 30000) {
    if (this.isOnline) {
      return true;
    }

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        unsubscribe();
        resolve(false);
      }, timeout);

      const unsubscribe = this.addListener((isOnline) => {
        if (isOnline) {
          clearTimeout(timeoutId);
          unsubscribe();
          resolve(true);
        }
      });
    });
  }
}

// Export singleton instance
const networkListener = new NetworkListener();
export default networkListener;
