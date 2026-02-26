// Data Download Service - Downloads all necessary data after login
import apiService from './apiService';
import StudentRepository from '../repositories/StudentRepository';
import AttendanceRepository from '../repositories/AttendanceRepository';
import MarksRepository from '../repositories/MarksRepository';
import BehaviorRepository from '../repositories/BehaviorRepository';
import InterventionRepository from '../repositories/InterventionRepository';
import dbService from '../database/db';

class DataDownloadService {
  constructor() {
    this.isDownloading = false;
    this.downloadListeners = [];
  }

  /**
   * Download all data after login
   */
  async downloadAllData(userId, userRole) {
    if (this.isDownloading) {
      console.log('⏳ Download already in progress');
      return { success: false, message: 'Download already in progress' };
    }

    this.isDownloading = true;
    this.notifyListeners({ status: 'started', progress: 0 });

    try {
      console.log('📥 Starting data download...');

      const steps = [
        { name: 'profile', fn: () => this.downloadProfile(userId) },
        { name: 'classes', fn: () => this.downloadClasses() },
        { name: 'students', fn: () => this.downloadStudents() },
        { name: 'subjects', fn: () => this.downloadSubjects() },
        { name: 'attendance', fn: () => this.downloadAttendance() },
        { name: 'marks', fn: () => this.downloadMarks() },
        { name: 'behavior', fn: () => this.downloadBehavior() },
        { name: 'interventions', fn: () => this.downloadInterventions() },
        { name: 'risk_predictions', fn: () => this.downloadRiskPredictions() },
        { name: 'leaderboard', fn: () => this.downloadLeaderboard() },
      ];

      let completed = 0;

      for (const step of steps) {
        try {
          console.log(`📥 Downloading ${step.name}...`);
          await step.fn();
          completed++;
          
          const progress = Math.round((completed / steps.length) * 100);
          this.notifyListeners({
            status: 'downloading',
            progress,
            step: step.name,
            completed,
            total: steps.length,
          });
        } catch (error) {
          console.error(`❌ Failed to download ${step.name}:`, error);
          // Continue with other downloads even if one fails
        }
      }

      console.log('✅ Data download completed');

      this.isDownloading = false;
      this.notifyListeners({ status: 'completed', progress: 100 });

      return { success: true };
    } catch (error) {
      console.error('❌ Data download failed:', error);
      this.isDownloading = false;
      this.notifyListeners({ status: 'failed', error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Download user profile
   */
  async downloadProfile(userId) {
    const profile = await apiService.getProfile();
    
    // Store in users table
    await dbService.execute(
      `INSERT OR REPLACE INTO users (id, email, name, role, school_id, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        profile.id,
        profile.email,
        profile.name,
        profile.role,
        profile.school_id,
        profile.status,
        profile.created_at || new Date().toISOString(),
      ]
    );

    return profile;
  }

  /**
   * Download classes
   */
  async downloadClasses() {
    const classes = await apiService.getClasses();
    
    if (!classes || classes.length === 0) return;

    const statements = classes.map(cls => ({
      sql: `INSERT OR REPLACE INTO classes (id, name, school_id, grade, section, attendance_mode, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      params: [
        cls.id,
        cls.name,
        cls.school_id,
        cls.grade,
        cls.section,
        cls.attendance_mode || 'daily',
        cls.created_at || new Date().toISOString(),
      ],
    }));

    await dbService.transaction(statements);
    return classes;
  }

  /**
   * Download students
   */
  async downloadStudents() {
    const students = await apiService.getStudents();
    
    if (!students || students.length === 0) return;

    const statements = students.map(student => ({
      sql: `INSERT OR REPLACE INTO students (id, name, roll_number, class_id, school_id, date_of_birth, gender, parent_name, parent_phone, parent_email, address, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [
        student.id,
        student.name,
        student.roll_number,
        student.class_id,
        student.school_id,
        student.date_of_birth,
        student.gender,
        student.parent_name,
        student.parent_phone,
        student.parent_email,
        student.address,
        student.created_at || new Date().toISOString(),
      ],
    }));

    await dbService.transaction(statements);
    return students;
  }

  /**
   * Download subjects
   */
  async downloadSubjects() {
    const subjects = await apiService.getSubjects();
    
    if (!subjects || subjects.length === 0) return;

    const statements = subjects.map(subject => ({
      sql: `INSERT OR REPLACE INTO subjects (id, name, class_id, school_id, teacher_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      params: [
        subject.id,
        subject.name,
        subject.class_id,
        subject.school_id,
        subject.teacher_id,
        subject.created_at || new Date().toISOString(),
      ],
    }));

    await dbService.transaction(statements);
    return subjects;
  }

  /**
   * Download attendance (last 30 days)
   */
  async downloadAttendance() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const classes = await dbService.getAll('SELECT id FROM classes');
    
    for (const cls of classes) {
      try {
        const attendance = await apiService.getClassAttendance(cls.id, {
          startDate: startDate.toISOString().split('T')[0],
        });

        if (attendance && attendance.length > 0) {
          const statements = attendance.map(record => ({
            sql: `INSERT OR REPLACE INTO attendance (id, student_id, class_id, subject_id, teacher_id, date, status, remarks, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
              record.id,
              record.student_id,
              record.class_id,
              record.subject_id,
              record.teacher_id,
              record.date,
              record.status,
              record.remarks,
              record.created_at || new Date().toISOString(),
            ],
          }));

          await dbService.transaction(statements);
        }
      } catch (error) {
        console.error(`Failed to download attendance for class ${cls.id}:`, error);
      }
    }
  }

  /**
   * Download marks
   */
  async downloadMarks() {
    const students = await dbService.getAll('SELECT id FROM students');
    
    for (const student of students) {
      try {
        const marks = await apiService.getMarksByStudent(student.id);

        if (marks && marks.length > 0) {
          const statements = marks.map(record => ({
            sql: `INSERT OR REPLACE INTO marks (id, student_id, exam_id, marks_obtained, remarks, teacher_id, verified, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
              record.id,
              record.student_id,
              record.exam_id,
              record.marks_obtained,
              record.remarks,
              record.teacher_id,
              record.verified ? 1 : 0,
              record.created_at || new Date().toISOString(),
            ],
          }));

          await dbService.transaction(statements);
        }
      } catch (error) {
        console.error(`Failed to download marks for student ${student.id}:`, error);
      }
    }
  }

  /**
   * Download behavior records (last 90 days)
   */
  async downloadBehavior() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);

    const students = await dbService.getAll('SELECT id FROM students');
    
    for (const student of students) {
      try {
        const behaviors = await apiService.getBehaviorsByStudent(student.id, {
          startDate: startDate.toISOString().split('T')[0],
        });

        if (behaviors && behaviors.length > 0) {
          const statements = behaviors.map(record => ({
            sql: `INSERT OR REPLACE INTO behavior (id, student_id, teacher_id, type, category, description, severity, date, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
              record.id,
              record.student_id,
              record.teacher_id,
              record.type,
              record.category,
              record.description,
              record.severity,
              record.date,
              record.created_at || new Date().toISOString(),
            ],
          }));

          await dbService.transaction(statements);
        }
      } catch (error) {
        console.error(`Failed to download behavior for student ${student.id}:`, error);
      }
    }
  }

  /**
   * Download interventions
   */
  async downloadInterventions() {
    const students = await dbService.getAll('SELECT id FROM students');
    
    for (const student of students) {
      try {
        const interventions = await apiService.getInterventionsByStudent(student.id);

        if (interventions && interventions.length > 0) {
          const statements = interventions.map(record => ({
            sql: `INSERT OR REPLACE INTO interventions (id, student_id, teacher_id, type, description, action_taken, status, date, follow_up_date, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
              record.id,
              record.student_id,
              record.teacher_id,
              record.type,
              record.description,
              record.action_taken,
              record.status,
              record.date,
              record.follow_up_date,
              record.created_at || new Date().toISOString(),
            ],
          }));

          await dbService.transaction(statements);
        }
      } catch (error) {
        console.error(`Failed to download interventions for student ${student.id}:`, error);
      }
    }
  }

  /**
   * Download risk predictions
   */
  async downloadRiskPredictions() {
    try {
      const predictions = await apiService.getSchoolRiskStatistics();
      
      if (predictions && predictions.students) {
        const statements = predictions.students.map(record => ({
          sql: `INSERT OR REPLACE INTO risk_predictions (id, student_id, risk_level, risk_score, factors, last_updated)
                VALUES (?, ?, ?, ?, ?, ?)`,
          params: [
            record.id || record.student_id,
            record.student_id,
            record.risk_level,
            record.risk_score,
            JSON.stringify(record.factors || {}),
            new Date().toISOString(),
          ],
        }));

        await dbService.transaction(statements);
      }
    } catch (error) {
      console.error('Failed to download risk predictions:', error);
    }
  }

  /**
   * Download leaderboard
   */
  async downloadLeaderboard() {
    // This will be implemented when gamification service is integrated
    console.log('📥 Leaderboard download - to be implemented');
  }

  /**
   * Add download listener
   */
  addDownloadListener(callback) {
    this.downloadListeners.push(callback);
    
    return () => {
      this.downloadListeners = this.downloadListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify download listeners
   */
  notifyListeners(data) {
    this.downloadListeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Download listener callback failed:', error);
      }
    });
  }
}

// Export singleton instance
const dataDownloadService = new DataDownloadService();
export default dataDownloadService;
