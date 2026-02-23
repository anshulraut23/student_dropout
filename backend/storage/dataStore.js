// Data Store - Supports multiple storage backends
// Using PostgreSQL (Supabase) for production

import postgresStore from './postgresStore.js';
import memoryStore from './memoryStore.js';

// Export PostgreSQL store for production
export default postgresStore;
