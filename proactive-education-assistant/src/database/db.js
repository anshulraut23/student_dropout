// Database Service - SQLite initialization and connection management
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { SCHEMA, SEEDS, DATABASE_NAME, DATABASE_VERSION } from './schema';

class DatabaseService {
  constructor() {
    this.db = null;
    this.sqlite = null;
    this.isInitialized = false;
    this.platform = Capacitor.getPlatform();
  }

  /**
   * Initialize the database connection
   */
  async initialize() {
    if (this.isInitialized) {
      console.log('✅ Database already initialized');
      return this.db;
    }

    try {
      console.log('🔄 Initializing database...');
      
      // Initialize SQLite connection
      this.sqlite = new SQLiteConnection(CapacitorSQLite);
      
      // Check if database exists
      const dbExists = await this.sqlite.isDatabase(DATABASE_NAME);
      
      if (!dbExists.result) {
        console.log('📦 Creating new database...');
        await this.createDatabase();
      } else {
        console.log('📂 Opening existing database...');
        this.db = await this.sqlite.createConnection(
          DATABASE_NAME,
          false,
          'no-encryption',
          DATABASE_VERSION,
          false
        );
        await this.db.open();
      }

      this.isInitialized = true;
      console.log('✅ Database initialized successfully');
      return this.db;
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Create database and tables
   */
  async createDatabase() {
    try {
      // Create connection
      this.db = await this.sqlite.createConnection(
        DATABASE_NAME,
        false,
        'no-encryption',
        DATABASE_VERSION,
        false
      );
      
      await this.db.open();

      // Create all tables
      console.log('📋 Creating tables...');
      for (const [tableName, sql] of Object.entries(SCHEMA)) {
        console.log(`  Creating table: ${tableName}`);
        await this.db.execute(sql);
      }

      // Insert seed data
      console.log('🌱 Inserting seed data...');
      for (const [seedName, sql] of Object.entries(SEEDS)) {
        console.log(`  Seeding: ${seedName}`);
        await this.db.execute(sql);
      }

      console.log('✅ Database created successfully');
    } catch (error) {
      console.error('❌ Database creation failed:', error);
      throw error;
    }
  }

  /**
   * Execute a SQL query
   */
  async query(sql, params = []) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const result = await this.db.query(sql, params);
      return result.values || [];
    } catch (error) {
      console.error('❌ Query failed:', error, { sql, params });
      throw error;
    }
  }

  /**
   * Execute a SQL statement (INSERT, UPDATE, DELETE)
   */
  async execute(sql, params = []) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const result = await this.db.run(sql, params);
      return result.changes || { changes: 0 };
    } catch (error) {
      console.error('❌ Execute failed:', error, { sql, params });
      throw error;
    }
  }

  /**
   * Execute multiple SQL statements in a transaction
   */
  async transaction(statements) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      await this.db.execute('BEGIN TRANSACTION;');
      
      for (const { sql, params } of statements) {
        await this.db.run(sql, params || []);
      }
      
      await this.db.execute('COMMIT;');
      return { success: true };
    } catch (error) {
      await this.db.execute('ROLLBACK;');
      console.error('❌ Transaction failed:', error);
      throw error;
    }
  }

  /**
   * Get a single row
   */
  async getOne(sql, params = []) {
    const results = await this.query(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Get all rows
   */
  async getAll(sql, params = []) {
    return await this.query(sql, params);
  }

  /**
   * Insert a record
   */
  async insert(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    return await this.execute(sql, values);
  }

  /**
   * Update a record
   */
  async update(table, data, where, whereParams = []) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
    return await this.execute(sql, [...values, ...whereParams]);
  }

  /**
   * Delete a record
   */
  async delete(table, where, whereParams = []) {
    const sql = `DELETE FROM ${table} WHERE ${where}`;
    return await this.execute(sql, whereParams);
  }

  /**
   * Clear all data from a table
   */
  async clearTable(table) {
    const sql = `DELETE FROM ${table}`;
    return await this.execute(sql);
  }

  /**
   * Drop and recreate database (for development/testing)
   */
  async reset() {
    try {
      console.log('🔄 Resetting database...');
      
      if (this.db) {
        await this.db.close();
      }
      
      await this.sqlite.deleteDatabase(DATABASE_NAME);
      this.isInitialized = false;
      this.db = null;
      
      await this.initialize();
      console.log('✅ Database reset complete');
    } catch (error) {
      console.error('❌ Database reset failed:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async close() {
    if (this.db) {
      await this.db.close();
      this.isInitialized = false;
      this.db = null;
      console.log('✅ Database closed');
    }
  }

  /**
   * Get database statistics
   */
  async getStats() {
    const tables = Object.keys(SCHEMA);
    const stats = {};

    for (const table of tables) {
      const result = await this.query(`SELECT COUNT(*) as count FROM ${table}`);
      stats[table] = result[0]?.count || 0;
    }

    return stats;
  }
}

// Export singleton instance
const dbService = new DatabaseService();
export default dbService;
