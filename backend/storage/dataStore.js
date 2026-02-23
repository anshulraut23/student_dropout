// Data Store - Supports multiple storage backends
// Using in-memory storage for compatibility during development

// import sqliteStore from './sqliteStore.js';
import memoryStore from './memoryStore.js';

// Export in-memory store (non-persistent)
export default memoryStore;
