// Base Repository - Common database operations
import dbService from '../database/db';
import { v4 as uuidv4 } from 'uuid';

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = dbService;
  }

  /**
   * Generate a new UUID
   */
  generateId() {
    return uuidv4();
  }

  /**
   * Get current timestamp
   */
  now() {
    return new Date().toISOString();
  }

  /**
   * Find all records
   */
  async findAll(where = '', params = []) {
    const sql = where 
      ? `SELECT * FROM ${this.tableName} WHERE ${where}`
      : `SELECT * FROM ${this.tableName}`;
    return await this.db.getAll(sql, params);
  }

  /**
   * Find a single record by ID
   */
  async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return await this.db.getOne(sql, [id]);
  }

  /**
   * Find a single record by condition
   */
  async findOne(where, params = []) {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${where} LIMIT 1`;
    return await this.db.getOne(sql, params);
  }

  /**
   * Create a new record
   */
  async create(data) {
    const record = {
      id: this.generateId(),
      ...data,
      created_at: this.now(),
    };

    await this.db.insert(this.tableName, record);
    return record;
  }

  /**
   * Update a record by ID
   */
  async update(id, data) {
    const updates = {
      ...data,
      updated_at: this.now(),
    };

    await this.db.update(this.tableName, updates, 'id = ?', [id]);
    return await this.findById(id);
  }

  /**
   * Delete a record by ID
   */
  async delete(id) {
    await this.db.delete(this.tableName, 'id = ?', [id]);
    return { success: true, id };
  }

  /**
   * Count records
   */
  async count(where = '', params = []) {
    const sql = where
      ? `SELECT COUNT(*) as count FROM ${this.tableName} WHERE ${where}`
      : `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const result = await this.db.getOne(sql, params);
    return result?.count || 0;
  }

  /**
   * Check if record exists
   */
  async exists(where, params = []) {
    const count = await this.count(where, params);
    return count > 0;
  }

  /**
   * Bulk insert records
   */
  async bulkCreate(records) {
    const statements = records.map(data => {
      const record = {
        id: this.generateId(),
        ...data,
        created_at: this.now(),
      };

      const keys = Object.keys(record);
      const values = Object.values(record);
      const placeholders = keys.map(() => '?').join(', ');
      
      return {
        sql: `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
        params: values,
      };
    });

    await this.db.transaction(statements);
    return { success: true, count: records.length };
  }

  /**
   * Clear all records from table
   */
  async clear() {
    await this.db.clearTable(this.tableName);
    return { success: true };
  }
}

export default BaseRepository;
