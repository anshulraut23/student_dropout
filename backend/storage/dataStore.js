// Data Store - Supports multiple storage backends
// Now using SQLite for persistent storage

import sqliteStore from './sqliteStore.js';
// import memoryStore from './memoryStore.js'; // Uncomment to switch back to in-memory storage

// Export SQLite store for persistent data storage
// Data will persist across server restarts until the database file is deleted
export default sqliteStore;
