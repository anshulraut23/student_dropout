// Data Store selector based on DB_TYPE

//import sqliteStore from './sqliteStore.js';
import postgresStore from './postgresStore.js';
import memoryStore from './memoryStore.js';

const dbType = (process.env.DB_TYPE ).toLowerCase();

let store ;
if (dbType === 'postgres') {
	store = postgresStore;
} else if (dbType === 'memory') {
	store = memoryStore;
}

export default store;
