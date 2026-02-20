// Data Store - Now using SQLite for persistent storage
// Data persists across server restarts in education_assistant.db file

import sqliteStore from './sqliteStore.js';

// Export the SQLite store directly
export default sqliteStore;
