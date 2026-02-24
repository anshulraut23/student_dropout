// Database Connection Configuration
// Supports both PostgreSQL and MongoDB

import pg from 'pg';
import mongoose from 'mongoose';

const { Pool } = pg;

// Database type from environment variable
const DB_TYPE = process.env.DB_TYPE || 'memory'; // 'postgres', 'mongodb', or 'memory'

// PostgreSQL Connection
let pgPool = null;

export const connectPostgres = async () => {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pgPool = new Pool({
      connectionString: connectionString,
      ssl: false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test connection
    const client = await pgPool.connect();
    console.log('✅ PostgreSQL connected successfully');
    client.release();
    
    return pgPool;
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    throw error;
  }
};

export const getPostgresPool = () => {
  if (!pgPool) {
    throw new Error('PostgreSQL pool not initialized. Call connectPostgres() first.');
  }
  return pgPool;
};

export const closePostgres = async () => {
  if (pgPool) {
    await pgPool.end();
    console.log('PostgreSQL connection closed');
  }
};

// MongoDB Connection
export const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/education_assistant';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

export const closeMongoDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
};

// Generic database connection based on DB_TYPE
export const connectDatabase = async () => {
  switch (DB_TYPE) {
    case 'postgres':
      return await connectPostgres();
    case 'mongodb':
      return await connectMongoDB();
    case 'memory':
      console.log('⚠️  Using in-memory storage (no database connection)');
      return null;
    default:
      throw new Error(`Unsupported database type: ${DB_TYPE}`);
  }
};

export const closeDatabase = async () => {
  switch (DB_TYPE) {
    case 'postgres':
      await closePostgres();
      break;
    case 'mongodb':
      await closeMongoDB();
      break;
    case 'memory':
      console.log('In-memory storage - no connection to close');
      break;
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabase();
  process.exit(0);
});

export default {
  connectDatabase,
  closeDatabase,
  connectPostgres,
  connectMongoDB,
  getPostgresPool,
  closePostgres,
  closeMongoDB
};
