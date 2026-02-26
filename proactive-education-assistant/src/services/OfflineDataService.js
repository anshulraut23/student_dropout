// Offline Data Service - Manages online/offline data flow
import apiService from './apiService';
import StudentRepository from '../repositories/StudentRepository';
import AttendanceRepository from '../repositories/AttendanceRepository';
import MarksRepository from '../repositories/MarksRepository';
import BehaviorRepository from '../repositories/BehaviorRepository';
import InterventionRepository from '../repositories/InterventionRepository';
import SyncQueueRepository from '../repositories/SyncQueueRepository';
import dbService from '../database/db';
import networkListener from '../sync/NetworkListener';

class OfflineDataService {
  constructor() {
    this.isInitialized = false;
    this.isSyncing = false;
  }

  /**
   * Initialize the offline data service
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🔄 Initializing Offline Data Service...');
      
      // Initialize database
      await dbService.initialize();
      
      // Initialize network listener
      await networkListener.initialize();
      
      this.isInitialized = true;
      console.log('✅ Offline Data Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Offline Data Service:', error);
      throw error;
    }
  }

  /**
   * Check if we're online
   */
  isOnline() {
    return networkListener.getStatus();
  }

  /**
   * Get students - online first, fallback to offline
   */
  async getStudents(classId = null) {
    try {
      if (this.isOnline()) {
        // Online: Fetch from API and update local DB
        console.log('📡 Fetching students from API...');
        const students = await apiService.getStudents(classId);
        
        // Update local database
        await this.updateLocalStudents(students);
        
        return students;
      } else {
        // Offline: Get from local DB
        console.log('📵 Offline: Loading students from local DB...');
        if (classId) {
          return await StudentRepository.findByClass(classId);
        } else {
          return await StudentRepository.findAll();
        }
      }
    } catch (error) {
      console.error('❌ Error fetching students:', error);
      
      // Fallback to local DB on error
      console.log('⚠️ Falling back to local DB...');
      if (classId) {
        return await StudentRepository.findByClass(classId);
      } else {
        return await StudentRepository.findAll();
      }
    }
  }

  /**
   * Add student - works offline
   */
  async addStudent(studentData) {
    try {
      // Always save to local DB first
      const student = await StudentRepository.create(studentData);
      
      if (this.isOnline()) {
        // Online: Send to API immediately
        console.log('📡 Sending student to API...');
        await apiService.createStudent(studentData);
        console.log('✅ Student synced to server');
      } else {
        // Offline: Add to sync queue
        console.log('📵 Offline: Adding student to sync queue...');
        await SyncQueueRepository.addToQueue('students', 'CREATE', studentData);
        console.log('✅ Student queued for sync');
      }
      
      return { success: true, offline: !this.isOnline(), student };
    } catch (error) {
      console.error('❌ Error adding student:', error);
      throw error;
    }
  }

  /**
   * Update local students database
   */
  async updateLocalStudents(students) {
    try {
      console.log(`💾 Updating ${students.length} students in local DB...`);
      
      for (const student of students) {
        const exists = await StudentRepository.findById(student.id);
        
        if (exists) {
          await StudentRepository.update(student.id, student);
        } else {
          await StudentRepository.create({
            id: student.id,
            name: student.name,
            roll_number: student.roll_number,
            class_id: student.class_id,
            school_id: student.school_id,
            date_of_birth: student.date_of_birth,
            gender: student.gender,
            parent_name: student.parent_name,
            parent_phone: student.parent_phone,
            parent_email: student.parent_email,
            address: student.address,
          });
        }
      }
      
      console.log('✅ Local students updated');
    } catch (error) {
      console.error('❌ Error updating local students:', error);
    }
  }

  /**
   * Mark attendance - works offline
   */
  async markAttendance(attendanceData) {
    try {
      // Always save to local DB first
      await AttendanceRepository.markAttendance(attendanceData);
      
      if (this.isOnline()) {
        // Online: Send to API immediately
        console.log('📡 Sending attendance to API...');
        await apiService.markAttendance(attendanceData);
        console.log('✅ Attendance synced to server');
      } else {
        // Offline: Add to sync queue
        console.log('📵 Offline: Adding attendance to sync queue...');
        await SyncQueueRepository.addToQueue('attendance', 'CREATE', attendanceData);
        console.log('✅ Attendance queued for sync');
      }
      
      return { success: true, offline: !this.isOnline() };
    } catch (error) {
      console.error('❌ Error marking attendance:', error);
      throw error;
    }
  }

  /**
   * Get attendance - online first, fallback to offline
   */
  async getAttendance(classId, params = {}) {
    try {
      if (this.isOnline()) {
        // Online: Fetch from API and update local DB
        console.log('📡 Fetching attendance from API...');
        const attendance = await apiService.getClassAttendance(classId, params);
        
        // Update local database
        await this.updateLocalAttendance(attendance);
        
        return attendance;
      } else {
        // Offline: Get from local DB
        console.log('📵 Offline: Loading attendance from local DB...');
        return await AttendanceRepository.findByClass(classId, params.date);
      }
    } catch (error) {
      console.error('❌ Error fetching attendance:', error);
      
      // Fallback to local DB
      console.log('⚠️ Falling back to local DB...');
      return await AttendanceRepository.findByClass(classId, params.date);
    }
  }

  /**
   * Update local attendance database
   */
  async updateLocalAttendance(attendanceRecords) {
    try {
      console.log(`💾 Updating ${attendanceRecords.length} attendance records in local DB...`);
      
      for (const record of attendanceRecords) {
        const exists = await AttendanceRepository.findById(record.id);
        
        if (exists) {
          await AttendanceRepository.update(record.id, record);
        } else {
          await AttendanceRepository.create({
            id: record.id,
            student_id: record.student_id,
            class_id: record.class_id,
            subject_id: record.subject_id,
            teacher_id: record.teacher_id,
            date: record.date,
            status: record.status,
            remarks: record.remarks,
          });
        }
      }
      
      console.log('✅ Local attendance updated');
    } catch (error) {
      console.error('❌ Error updating local attendance:', error);
    }
  }

  /**
   * Add marks - works offline
   */
  async addMarks(marksData) {
    try {
      // Always save to local DB first
      await MarksRepository.enterMarks(marksData);
      
      if (this.isOnline()) {
        // Online: Send to API immediately
        console.log('📡 Sending marks to API...');
        await apiService.enterSingleMarks(marksData);
        console.log('✅ Marks synced to server');
      } else {
        // Offline: Add to sync queue
        console.log('📵 Offline: Adding marks to sync queue...');
        await SyncQueueRepository.addToQueue('marks', 'CREATE', marksData);
        console.log('✅ Marks queued for sync');
      }
      
      return { success: true, offline: !this.isOnline() };
    } catch (error) {
      console.error('❌ Error adding marks:', error);
      throw error;
    }
  }

  /**
   * Get marks - online first, fallback to offline
   */
  async getMarks(studentId) {
    try {
      if (this.isOnline()) {
        // Online: Fetch from API and update local DB
        console.log('📡 Fetching marks from API...');
        const marks = await apiService.getMarksByStudent(studentId);
        
        // Update local database
        await this.updateLocalMarks(marks);
        
        return marks;
      } else {
        // Offline: Get from local DB
        console.log('📵 Offline: Loading marks from local DB...');
        return await MarksRepository.findByStudent(studentId);
      }
    } catch (error) {
      console.error('❌ Error fetching marks:', error);
      
      // Fallback to local DB
      console.log('⚠️ Falling back to local DB...');
      return await MarksRepository.findByStudent(studentId);
    }
  }

  /**
   * Update local marks database
   */
  async updateLocalMarks(marksRecords) {
    try {
      console.log(`💾 Updating ${marksRecords.length} marks records in local DB...`);
      
      for (const record of marksRecords) {
        const exists = await MarksRepository.findById(record.id);
        
        if (exists) {
          await MarksRepository.update(record.id, record);
        } else {
          await MarksRepository.create({
            id: record.id,
            student_id: record.student_id,
            exam_id: record.exam_id,
            marks_obtained: record.marks_obtained,
            remarks: record.remarks,
            teacher_id: record.teacher_id,
            verified: record.verified ? 1 : 0,
          });
        }
      }
      
      console.log('✅ Local marks updated');
    } catch (error) {
      console.error('❌ Error updating local marks:', error);
    }
  }

  /**
   * Add behavior - works offline
   */
  async addBehavior(behaviorData) {
    try {
      // Always save to local DB first
      await BehaviorRepository.create(behaviorData);
      
      if (this.isOnline()) {
        // Online: Send to API immediately
        console.log('📡 Sending behavior to API...');
        await apiService.createBehaviorRecord(behaviorData);
        console.log('✅ Behavior synced to server');
      } else {
        // Offline: Add to sync queue
        console.log('📵 Offline: Adding behavior to sync queue...');
        await SyncQueueRepository.addToQueue('behavior', 'CREATE', behaviorData);
        console.log('✅ Behavior queued for sync');
      }
      
      return { success: true, offline: !this.isOnline() };
    } catch (error) {
      console.error('❌ Error adding behavior:', error);
      throw error;
    }
  }

  /**
   * Get behavior - online first, fallback to offline
   */
  async getBehavior(studentId) {
    try {
      if (this.isOnline()) {
        // Online: Fetch from API and update local DB
        console.log('📡 Fetching behavior from API...');
        const behavior = await apiService.getBehaviorsByStudent(studentId);
        
        // Update local database
        await this.updateLocalBehavior(behavior);
        
        return behavior;
      } else {
        // Offline: Get from local DB
        console.log('📵 Offline: Loading behavior from local DB...');
        return await BehaviorRepository.findByStudent(studentId);
      }
    } catch (error) {
      console.error('❌ Error fetching behavior:', error);
      
      // Fallback to local DB
      console.log('⚠️ Falling back to local DB...');
      return await BehaviorRepository.findByStudent(studentId);
    }
  }

  /**
   * Update local behavior database
   */
  async updateLocalBehavior(behaviorRecords) {
    try {
      console.log(`💾 Updating ${behaviorRecords.length} behavior records in local DB...`);
      
      for (const record of behaviorRecords) {
        const exists = await BehaviorRepository.findById(record.id);
        
        if (exists) {
          await BehaviorRepository.update(record.id, record);
        } else {
          await BehaviorRepository.create({
            id: record.id,
            student_id: record.student_id,
            teacher_id: record.teacher_id,
            type: record.type,
            category: record.category,
            description: record.description,
            severity: record.severity,
            date: record.date,
          });
        }
      }
      
      console.log('✅ Local behavior updated');
    } catch (error) {
      console.error('❌ Error updating local behavior:', error);
    }
  }

  /**
   * Add intervention - works offline
   */
  async addIntervention(interventionData) {
    try {
      // Always save to local DB first
      await InterventionRepository.create(interventionData);
      
      if (this.isOnline()) {
        // Online: Send to API immediately
        console.log('📡 Sending intervention to API...');
        await apiService.createIntervention(interventionData);
        console.log('✅ Intervention synced to server');
      } else {
        // Offline: Add to sync queue
        console.log('📵 Offline: Adding intervention to sync queue...');
        await SyncQueueRepository.addToQueue('interventions', 'CREATE', interventionData);
        console.log('✅ Intervention queued for sync');
      }
      
      return { success: true, offline: !this.isOnline() };
    } catch (error) {
      console.error('❌ Error adding intervention:', error);
      throw error;
    }
  }

  /**
   * Get interventions - online first, fallback to offline
   */
  async getInterventions(studentId) {
    try {
      if (this.isOnline()) {
        // Online: Fetch from API and update local DB
        console.log('📡 Fetching interventions from API...');
        const interventions = await apiService.getInterventionsByStudent(studentId);
        
        // Update local database
        await this.updateLocalInterventions(interventions);
        
        return interventions;
      } else {
        // Offline: Get from local DB
        console.log('📵 Offline: Loading interventions from local DB...');
        return await InterventionRepository.findByStudent(studentId);
      }
    } catch (error) {
      console.error('❌ Error fetching interventions:', error);
      
      // Fallback to local DB
      console.log('⚠️ Falling back to local DB...');
      return await InterventionRepository.findByStudent(studentId);
    }
  }

  /**
   * Update local interventions database
   */
  async updateLocalInterventions(interventionRecords) {
    try {
      console.log(`💾 Updating ${interventionRecords.length} intervention records in local DB...`);
      
      for (const record of interventionRecords) {
        const exists = await InterventionRepository.findById(record.id);
        
        if (exists) {
          await InterventionRepository.update(record.id, record);
        } else {
          await InterventionRepository.create({
            id: record.id,
            student_id: record.student_id,
            teacher_id: record.teacher_id,
            type: record.type,
            description: record.description,
            action_taken: record.action_taken,
            status: record.status,
            date: record.date,
            follow_up_date: record.follow_up_date,
          });
        }
      }
      
      console.log('✅ Local interventions updated');
    } catch (error) {
      console.error('❌ Error updating local interventions:', error);
    }
  }

  /**
   * Get pending sync count
   */
  async getPendingSyncCount() {
    return await SyncQueueRepository.getUnsyncedCount();
  }
}

// Export singleton instance
const offlineDataService = new OfflineDataService();
export default offlineDataService;
