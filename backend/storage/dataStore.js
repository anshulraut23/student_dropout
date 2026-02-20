// Data Store - Supports multiple storage backends
// Uses memory store by default (recommended for development)

import memoryStore from './memoryStore.js';
// Uncomment below if you have Visual Studio C++ tools installed for SQLite support:
// import sqliteStore from './sqliteStore.js';

// Export the appropriate store based on DB_TYPE
// For development, we use the memory store which doesn't require native dependencies
export default memoryStore;
