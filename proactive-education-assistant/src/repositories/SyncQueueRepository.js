// Sync Queue Repository
import BaseRepository from './BaseRepository';

class SyncQueueRepository extends BaseRepository {
  constructor() {
    super('sync_queue');
  }

  /**
   * Add item to sync queue
   */
  async addToQueue(entity, action, payload) {
    return await this.create({
      entity,
      action,
      payload: JSON.stringify(payload),
      synced: 0,
      retry_count: 0,
      error: null,
    });
  }

  /**
   * Get unsynced items
   */
  async getUnsynced(limit = 50) {
    const sql = `
      SELECT * FROM sync_queue 
      WHERE synced = 0 
      ORDER BY created_at ASC 
      LIMIT ?
    `;
    return await this.db.getAll(sql, [limit]);
  }

  /**
   * Get unsynced count
   */
  async getUnsyncedCount() {
    return await this.count('synced = 0');
  }

  /**
   * Mark item as synced
   */
  async markAsSynced(id) {
    return await this.update(id, {
      synced: 1,
      synced_at: this.now(),
      error: null,
    });
  }

  /**
   * Mark multiple items as synced
   */
  async markMultipleAsSynced(ids) {
    const statements = ids.map(id => ({
      sql: `UPDATE sync_queue SET synced = 1, synced_at = ?, error = NULL WHERE id = ?`,
      params: [this.now(), id],
    }));

    await this.db.transaction(statements);
    return { success: true, count: ids.length };
  }

  /**
   * Increment retry count
   */
  async incrementRetry(id, error) {
    const item = await this.findById(id);
    return await this.update(id, {
      retry_count: (item.retry_count || 0) + 1,
      error: error,
    });
  }

  /**
   * Get failed items (retry count > 3)
   */
  async getFailedItems() {
    return await this.findAll('synced = 0 AND retry_count > 3');
  }

  /**
   * Clear synced items older than specified days
   */
  async clearOldSyncedItems(days = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const sql = `
      DELETE FROM sync_queue 
      WHERE synced = 1 AND synced_at < ?
    `;

    return await this.db.execute(sql, [cutoffDate.toISOString()]);
  }

  /**
   * Get sync queue statistics
   */
  async getStatistics() {
    const sql = `
      SELECT 
        COUNT(*) as total_items,
        SUM(CASE WHEN synced = 0 THEN 1 ELSE 0 END) as unsynced_count,
        SUM(CASE WHEN synced = 1 THEN 1 ELSE 0 END) as synced_count,
        SUM(CASE WHEN retry_count > 3 THEN 1 ELSE 0 END) as failed_count,
        entity,
        action
      FROM sync_queue
      GROUP BY entity, action
    `;

    return await this.db.getAll(sql);
  }

  /**
   * Get pending changes by entity
   */
  async getPendingByEntity(entity) {
    return await this.findAll('entity = ? AND synced = 0 ORDER BY created_at ASC', [entity]);
  }

  /**
   * Parse payload from JSON string
   */
  parsePayload(item) {
    try {
      return {
        ...item,
        payload: JSON.parse(item.payload),
      };
    } catch (error) {
      console.error('Failed to parse payload:', error);
      return item;
    }
  }

  /**
   * Get unsynced items with parsed payloads
   */
  async getUnsyncedParsed(limit = 50) {
    const items = await this.getUnsynced(limit);
    return items.map(item => this.parsePayload(item));
  }
}

export default new SyncQueueRepository();
