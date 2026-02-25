/**
 * Storage Adapter
 * Provides unified storage interface that adapts based on environment
 * - WEB: In-memory storage (no persistence)
 * - PWA: LocalForage (IndexedDB with fallback)
 * - APK: SQLite (to be implemented later)
 */

import localforage from 'localforage';
import { detectEnvironment } from '../utils/environmentDetector';

// ============================================================================
// WEB Storage (In-Memory)
// ============================================================================
class WebStorage {
  constructor() {
    this.store = new Map();
  }

  async get(key) {
    return this.store.get(key) || null;
  }

  async set(key, value) {
    this.store.set(key, value);
    return value;
  }

  async remove(key) {
    this.store.delete(key);
  }

  async clear() {
    this.store.clear();
  }

  async keys() {
    return Array.from(this.store.keys());
  }
}

// ============================================================================
// PWA Storage (LocalForage - IndexedDB)
// ============================================================================
class PWAStorage {
  constructor() {
    // Configure localforage for better capacity
    this.store = localforage.createInstance({
      name: 'EducationAssistant',
      storeName: 'app_data',
      description: 'Offline data storage for Education Assistant'
    });
  }

  async get(key) {
    try {
      return await this.store.getItem(key);
    } catch (error) {
      console.error('PWAStorage get error:', error);
      return null;
    }
  }

  async set(key, value) {
    try {
      await this.store.setItem(key, value);
      return value;
    } catch (error) {
      console.error('PWAStorage set error:', error);
      throw error;
    }
  }

  async remove(key) {
    try {
      await this.store.removeItem(key);
    } catch (error) {
      console.error('PWAStorage remove error:', error);
    }
  }

  async clear() {
    try {
      await this.store.clear();
    } catch (error) {
      console.error('PWAStorage clear error:', error);
    }
  }

  async keys() {
    try {
      return await this.store.keys();
    } catch (error) {
      console.error('PWAStorage keys error:', error);
      return [];
    }
  }

  async length() {
    try {
      return await this.store.length();
    } catch (error) {
      console.error('PWAStorage length error:', error);
      return 0;
    }
  }
}

// ============================================================================
// APK Storage (SQLite - Placeholder)
// ============================================================================
class APKStorage {
  constructor() {
    console.warn('APKStorage not yet implemented. Using PWAStorage as fallback.');
    this.fallback = new PWAStorage();
  }

  async get(key) {
    // TODO: Implement SQLite storage
    return this.fallback.get(key);
  }

  async set(key, value) {
    // TODO: Implement SQLite storage
    return this.fallback.set(key, value);
  }

  async remove(key) {
    // TODO: Implement SQLite storage
    return this.fallback.remove(key);
  }

  async clear() {
    // TODO: Implement SQLite storage
    return this.fallback.clear();
  }

  async keys() {
    // TODO: Implement SQLite storage
    return this.fallback.keys();
  }
}

// ============================================================================
// Storage Adapter (Main Class)
// ============================================================================
class StorageAdapter {
  constructor() {
    this.env = detectEnvironment();
    this.storage = this.initStorage();
    console.log(`📦 Storage initialized for ${this.env} mode`);
  }

  initStorage() {
    switch (this.env) {
      case 'APK':
        return new APKStorage();
      case 'PWA':
        return new PWAStorage();
      case 'WEB':
        return new WebStorage();
      default:
        console.warn('Unknown environment, using WebStorage');
        return new WebStorage();
    }
  }

  async get(key) {
    return this.storage.get(key);
  }

  async set(key, value) {
    return this.storage.set(key, value);
  }

  async remove(key) {
    return this.storage.remove(key);
  }

  async clear() {
    return this.storage.clear();
  }

  async keys() {
    return this.storage.keys();
  }

  getEnvironment() {
    return this.env;
  }

  isOfflineCapable() {
    return this.env === 'APK' || this.env === 'PWA';
  }
}

// Export singleton instance
export default new StorageAdapter();
