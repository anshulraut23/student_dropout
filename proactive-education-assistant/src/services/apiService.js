// API Service - Handles all backend API calls with offline support

import offlineQueue from './offlineQueue';
import storageAdapter from './storageAdapter';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Get auth token from storage
  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  // Set auth token in headers
  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Generic request handler with offline support
  async request(endpoint, options = {}) {
    const { method = 'GET', data, auth = false, offlineSupport = false } = options;

    // ============================================================================
    // OFFLINE HANDLING
    // ============================================================================
    
    // Check if offline
    if (!navigator.onLine) {
      // For write operations (POST, PUT, DELETE) with offline support, queue them
      if (offlineSupport && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
        console.log('📴 Offline mode: Queuing request', endpoint);
        
        // Queue the request
        const queueItem = await offlineQueue.add('API_CALL', {
          endpoint,
          method,
          data
        });
        
        // Return mock success response
        return {
          success: true,
          offline: true,
          queueId: queueItem.id,
          message: 'Saved locally. Will sync when online.'
        };
      }
      
      // For GET requests, try to return cached data
      if (method === 'GET') {
        console.log('📴 Offline mode: Checking cache for', endpoint);
        const cached = await storageAdapter.get(`cache:${endpoint}`);
        
        if (cached) {
          console.log('✓ Returning cached data for', endpoint);
          return {
            ...cached,
            fromCache: true,
            message: 'Showing cached data (offline)'
          };
        }
        
        // No cache available
        console.warn('📴 Offline: No cached data for', endpoint);
        throw new Error('This feature requires an internet connection. Please connect to WiFi and try again.');
      }
      
      // For operations without offline support
      console.warn('📴 Offline: Operation not supported offline', endpoint);
      throw new Error('This feature requires an internet connection. Please connect to WiFi and try again.');
    }

    // ============================================================================
    // ONLINE REQUEST
    // ============================================================================
    
    try {
      const headers = this.getHeaders(auth);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method,
        body: data ? JSON.stringify(data) : undefined,
        headers: {
          ...headers,
          ...(options.headers || {})
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        console.error('Status:', response.status);
        console.error('Endpoint:', endpoint);
        
        // Check if it's a connection error
        if (text.includes('Cannot GET') || text.includes('Cannot POST')) {
          throw new Error('Backend server endpoint not found. Make sure the backend server is running on port 5000.');
        }
        
        throw new Error('Backend server error. Please check if the server is running and try again.');
      }

      const responseData = await response.json();

      // ============================================================================
      // ERROR HANDLING WITH OFFLINE FALLBACK
      // ============================================================================
      
      if (!response.ok) {
        console.error('❌ API Error Response:', {
          endpoint,
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        
        // Check for 5xx server errors - fallback to offline queue
        if (response.status >= 500 && response.status < 600) {
          if (offlineSupport && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
            console.log('🔴 Server error (5xx): Queuing request', endpoint);
            
            const queueItem = await offlineQueue.add('API_CALL', {
              endpoint,
              method,
              data
            });
            
            return {
              success: true,
              offline: true,
              queueId: queueItem.id,
              message: 'Server temporarily unavailable. Saved locally and will sync later.'
            };
          }
        }
        
        // Check if backend error is due to database connection
        const errorMsg = responseData.error || responseData.message || '';
        if (errorMsg.includes('ENOTFOUND') || errorMsg.includes('getaddrinfo') || errorMsg.includes('supabase')) {
          if (offlineSupport && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
            console.log('📴 Backend offline: Queuing request', endpoint);
            
            const queueItem = await offlineQueue.add('API_CALL', {
              endpoint,
              method,
              data
            });
            
            return {
              success: true,
              offline: true,
              queueId: queueItem.id,
              message: 'Saved locally. Will sync when online.'
            };
          }
        }
        
        throw new Error(errorMsg || `Request failed with status ${response.status}`);
      }

      // ============================================================================
      // SUCCESS - CACHE GET RESPONSES
      // ============================================================================
      
      // Cache successful GET responses for offline use
      if (method === 'GET' && responseData) {
        try {
          await storageAdapter.set(`cache:${endpoint}`, responseData);
          console.log('💾 Cached response for', endpoint);
        } catch (cacheError) {
          console.warn('Failed to cache response:', cacheError);
        }
      }

      return responseData;
      
    } catch (error) {
      // ============================================================================
      // NETWORK ERROR HANDLING
      // ============================================================================
      
      // Handle fetch failures (network errors, timeouts)
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') ||
          error.message.includes('timeout')) {
        
        // For write operations with offline support, queue them
        if (offlineSupport && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
          console.log('📴 Network error: Queuing request', endpoint);
          
          const queueItem = await offlineQueue.add('API_CALL', {
            endpoint,
            method,
            data
          });
          
          return {
            success: true,
            offline: true,
            queueId: queueItem.id,
            message: 'Saved locally. Will sync when online.'
          };
        }
        
        // For GET requests, try cache
        if (method === 'GET') {
          const cached = await storageAdapter.get(`cache:${endpoint}`);
          if (cached) {
            console.log('✓ Returning cached data after network error', endpoint);
            return {
              ...cached,
              fromCache: true,
              message: 'Showing cached data (network error)'
            };
          }
        }
        
        if (!navigator.onLine) {
          throw new Error('No internet connection. Please connect to WiFi to load data.');
        }
        throw new Error('Cannot connect to backend server. Please make sure the backend is running.');
      }
      
      throw error;
    }
  }

  // Auth endpoints
  async registerAdmin(formData) {
    return this.request('/auth/register/admin', {
      method: 'POST',
      data: formData,
    });
  }

  async registerTeacher(formData) {
    return this.request('/auth/register/teacher', {
      method: 'POST',
      data: formData,
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      data: { email, password },
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me', {
      method: 'GET',
      auth: true,
    });
  }

  // School endpoints
  async getSchools() {
    return this.request('/schools', {
      method: 'GET',
    });
  }

  async getSchoolById(schoolId) {
    return this.request(`/schools/${schoolId}`, {
      method: 'GET',
    });
  }

  // Approval endpoints (admin only)
  async getPendingRequests() {
    return this.request('/approvals/pending', {
      method: 'GET',
      auth: true,
    });
  }

  async getAllTeachers() {
    return this.request('/teachers', {
      method: 'GET',
      auth: true,
    });
  }

  async getMyClasses() {
    return this.request('/teachers/my-classes', {
      method: 'GET',
      auth: true,
    });
  }

  async approveTeacher(teacherId, classIds = []) {
    return this.request(`/approvals/approve/${teacherId}`, {
      method: 'POST',
      data: { classIds },
      auth: true,
    });
  }

  async rejectTeacher(teacherId) {
    return this.request(`/approvals/reject/${teacherId}`, {
      method: 'POST',
      auth: true,
    });
  }

  // Class endpoints (admin only)
  async getClasses() {
    return this.request('/classes', {
      method: 'GET',
      auth: true,
    });
  }

  async getClassById(classId) {
    return this.request(`/classes/${classId}`, {
      method: 'GET',
      auth: true,
    });
  }

  async createClass(classData) {
    return this.request('/classes', {
      method: 'POST',
      data: classData,
      auth: true,
    });
  }

  async updateClass(classId, classData) {
    return this.request(`/classes/${classId}`, {
      method: 'PUT',
      data: classData,
      auth: true,
    });
  }

  async deleteClass(classId) {
    return this.request(`/classes/${classId}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  // Subject endpoints (admin only)
  async getSubjects() {
    return this.request('/subjects', {
      method: 'GET',
      auth: true,
    });
  }

  async getSubjectsByClass(classId) {
    return this.request(`/subjects/class/${classId}`, {
      method: 'GET',
      auth: true,
    });
  }

  async createSubject(subjectData) {
    return this.request('/subjects', {
      method: 'POST',
      data: subjectData,
      auth: true,
    });
  }

  async updateSubject(subjectId, subjectData) {
    return this.request(`/subjects/${subjectId}`, {
      method: 'PUT',
      data: subjectData,
      auth: true,
    });
  }

  async deleteSubject(subjectId) {
    return this.request(`/subjects/${subjectId}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  // Student endpoints
  async getStudents(classId = null) {
    const query = classId ? `?classId=${classId}` : '';
    return this.request(`/students${query}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getStudentById(studentId) {
    return this.request(`/students/${studentId}`, {
      method: 'GET',
      auth: true,
    });
  }

  async createStudent(studentData) {
    return this.request('/students', {
      method: 'POST',
      data: studentData,
      auth: true,
    });
  }

  async createStudentsBulk(classId, students) {
    return this.request('/students/bulk', {
      method: 'POST',
      data: { classId, students },
      auth: true,
    });
  }

  async updateStudent(studentId, studentData) {
    return this.request(`/students/${studentId}`, {
      method: 'PUT',
      data: studentData,
      auth: true,
    });
  }

  async deleteStudent(studentId) {
    return this.request(`/students/${studentId}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  // Exam endpoints
  async getExams(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/exams${query ? '?' + query : ''}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getExamById(examId) {
    return this.request(`/exams/${examId}`, {
      method: 'GET',
      auth: true,
    });
  }

  async createExam(examData) {
    return this.request('/exams', {
      method: 'POST',
      data: examData,
      auth: true,
    });
  }

  async updateExam(examId, examData) {
    return this.request(`/exams/${examId}`, {
      method: 'PUT',
      data: examData,
      auth: true,
    });
  }

  async deleteExam(examId) {
    return this.request(`/exams/${examId}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  async changeExamStatus(examId, status) {
    return this.request(`/exams/${examId}/status`, {
      method: 'POST',
      data: { status },
      auth: true,
    });
  }

  // Exam Templates endpoints (Admin only)
  async getExamTemplates(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/exam-templates${query ? '?' + query : ''}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getExamTemplateById(templateId) {
    return this.request(`/exam-templates/${templateId}`, {
      method: 'GET',
      auth: true,
    });
  }

  async createExamTemplate(templateData) {
    return this.request('/exam-templates', {
      method: 'POST',
      data: templateData,
      auth: true,
    });
  }

  async updateExamTemplate(templateId, templateData) {
    return this.request(`/exam-templates/${templateId}`, {
      method: 'PUT',
      data: templateData,
      auth: true,
    });
  }

  async deleteExamTemplate(templateId) {
    return this.request(`/exam-templates/${templateId}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  async toggleExamTemplateStatus(templateId) {
    return this.request(`/exam-templates/${templateId}/toggle`, {
      method: 'POST',
      auth: true,
    });
  }

  // Exam Periods endpoints (Admin only)
  async getExamPeriods(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/exam-periods${query ? '?' + query : ''}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getExamPeriodById(periodId) {
    return this.request(`/exam-periods/${periodId}`, {
      method: 'GET',
      auth: true,
    });
  }

  async createExamPeriod(periodData) {
    return this.request('/exam-periods', {
      method: 'POST',
      data: periodData,
      auth: true,
    });
  }

  async updateExamPeriod(periodId, periodData) {
    return this.request(`/exam-periods/${periodId}`, {
      method: 'PUT',
      data: periodData,
      auth: true,
    });
  }

  async deleteExamPeriod(periodId) {
    return this.request(`/exam-periods/${periodId}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  async generateExamsForPeriod(periodId) {
    return this.request(`/exam-periods/${periodId}/generate-exams`, {
      method: 'POST',
      auth: true,
    });
  }

  async getExamsByPeriod(periodId) {
    return this.request(`/exam-periods/${periodId}/exams`, {
      method: 'GET',
      auth: true,
    });
  }

  // Marks endpoints
  async enterSingleMarks(marksData) {
    return this.request('/marks', {
      method: 'POST',
      data: marksData,
      auth: true,
      offlineSupport: true // Enable offline support
    });
  }

  async enterBulkMarks(bulkData) {
    return this.request('/marks/bulk', {
      method: 'POST',
      data: bulkData,
      auth: true,
      offlineSupport: true // Enable offline support
    });
  }

  async getMarksByExam(examId) {
    return this.request(`/marks/exam/${examId}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getMarksByStudent(studentId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/marks/student/${studentId}${query ? '?' + query : ''}`, {
      method: 'GET',
      auth: true,
    });
  }

  async updateMarks(marksId, updates) {
    return this.request(`/marks/${marksId}`, {
      method: 'PUT',
      data: updates,
      auth: true,
    });
  }

  async deleteMarks(marksId) {
    return this.request(`/marks/${marksId}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  async verifyMarks(marksId) {
    return this.request(`/marks/${marksId}/verify`, {
      method: 'POST',
      auth: true,
    });
  }

  // Attendance endpoints
  
  /**
   * Mark attendance for a single student
   */
  async markAttendance(attendanceData) {
    return this.request('/attendance/mark', {
      method: 'POST',
      data: attendanceData,
      auth: true,
      offlineSupport: true // Enable offline support
    });
  }

  /**
   * Mark bulk attendance for multiple students
   */
  async markBulkAttendance(bulkData) {
    return this.request('/attendance/mark-bulk', {
      method: 'POST',
      data: bulkData,
      auth: true,
      offlineSupport: true // Enable offline support
    });
  }

  /**
   * Get attendance for a class
   * @param {string} classId - Class ID
   * @param {object} params - Query parameters (date, startDate, endDate, subjectId)
   */
  async getClassAttendance(classId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/attendance/class/${classId}${query ? '?' + query : ''}`, {
      method: 'GET',
      auth: true,
    });
  }

  /**
   * Get attendance for a student
   * @param {string} studentId - Student ID
   * @param {object} params - Query parameters (startDate, endDate, subjectId)
   */
  async getStudentAttendance(studentId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/attendance/student/${studentId}${query ? '?' + query : ''}`, {
      method: 'GET',
      auth: true,
    });
  }

  /**
   * Update attendance record
   */
  async updateAttendance(attendanceId, updates) {
    return this.request(`/attendance/${attendanceId}`, {
      method: 'PUT',
      data: updates,
      auth: true,
    });
  }

  /**
   * Delete attendance record (admin only)
   */
  async deleteAttendance(attendanceId) {
    return this.request(`/attendance/${attendanceId}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  /**
   * Get attendance statistics for a class
   * @param {string} classId - Class ID
   * @param {object} params - Query parameters (startDate, endDate, subjectId)
   */
  async getAttendanceStatistics(classId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/attendance/statistics/class/${classId}${query ? '?' + query : ''}`, {
      method: 'GET',
      auth: true,
    });
  }

  /**
   * Get attendance report
   * @param {object} params - Query parameters (classId, studentId, startDate, endDate, subjectId, format)
   */
  async getAttendanceReport(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/attendance/report${query ? '?' + query : ''}`, {
      method: 'GET',
      auth: true,
    });
  }

  // Performance/Scores endpoints
  async createPerformanceRecord(performanceData) {
    return this.request('/performance', {
      method: 'POST',
      data: performanceData,
      auth: true,
    });
  }

  async createPerformanceBulk(performanceRecords) {
    // Map performance records to marks format
    const marks = performanceRecords.map(record => ({
      studentId: record.studentId,
      marksObtained: record.obtainedMarks,
      remarks: record.remarks
    }));

    return this.request('/marks/bulk', {
      method: 'POST',
      data: { 
        examId: performanceRecords[0]?.examId,
        marks 
      },
      auth: true,
    });
  }

  async getPerformanceRecords(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/performance${query ? '?' + query : ''}`, {
      method: 'GET',
      auth: true,
    });
  }

  // Behavior endpoints
  async createBehaviorRecord(behaviorData) {
    return this.request('/behavior', {
      method: 'POST',
      data: behaviorData,
      auth: true,
      offlineSupport: true // Enable offline support
    });
  }

  async getBehaviorRecords(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/behavior${query ? '?' + query : ''}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getBehaviorById(behaviorId) {
    return this.request(`/behavior/${behaviorId}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getBehaviorsByStudent(studentId, filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/behavior/student/${studentId}${query ? '?' + query : ''}`, {
      method: 'GET',
      auth: true,
    });
  }

  async updateBehaviorRecord(behaviorId, updates) {
    return this.request(`/behavior/${behaviorId}`, {
      method: 'PUT',
      data: updates,
      auth: true,
    });
  }

  async deleteBehaviorRecord(behaviorId) {
    return this.request(`/behavior/${behaviorId}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  // Behaviour endpoints
  async createBehaviourRecord(behaviourData) {
    return this.request('/behavior', {
      method: 'POST',
      data: behaviourData,
      auth: true,
      offlineSupport: true // Enable offline support
    });
  }

  async getBehaviourRecords(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/behavior${query ? '?' + query : ''}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getBehavioursByStudent(studentId) {
    return this.request(`/behavior/student/${studentId}`, {
      method: 'GET',
      auth: true,
    });
  }

  async updateBehaviourRecord(behaviorId, updates) {
    return this.request(`/behavior/${behaviorId}`, {
      method: 'PUT',
      data: updates,
      auth: true,
    });
  }

  async deleteBehaviourRecord(behaviorId) {
    return this.request(`/behavior/${behaviorId}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  // Intervention endpoints
  async createIntervention(interventionData) {
    return this.request('/interventions', {
      method: 'POST',
      data: interventionData,
      auth: true,
      offlineSupport: true // Enable offline support
    });
  }

  async getInterventions(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/interventions${query ? '?' + query : ''}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getInterventionsByStudent(studentId) {
    return this.request(`/interventions/student/${studentId}`, {
      method: 'GET',
      auth: true,
    });
  }

  async updateIntervention(interventionId, updates) {
    return this.request(`/interventions/${interventionId}`, {
      method: 'PUT',
      data: updates,
      auth: true,
    });
  }

  async deleteIntervention(interventionId) {
    return this.request(`/interventions/${interventionId}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  // Profile endpoints
  async getProfile() {
    return this.request('/profile', {
      method: 'GET',
      auth: true,
    });
  }

  async updateProfile(updates) {
    return this.request('/profile', {
      method: 'PUT',
      data: updates,
      auth: true,
    });
  }

  async getProfileById(userId) {
    return this.request(`/profile/${userId}`, {
      method: 'GET',
      auth: true,
    });
  }

  // Faculty endpoints
  async getSchoolTeachers() {
    return this.request('/faculty/teachers', {
      method: 'GET',
      auth: true,
    });
  }

  async sendFacultyInvite(recipientId) {
    return this.request('/faculty/invites/send', {
      method: 'POST',
      data: { recipientId },
      auth: true,
    });
  }

  async getMyFacultyInvites() {
    return this.request('/faculty/invites', {
      method: 'GET',
      auth: true,
    });
  }

  async acceptFacultyInvite(inviteId) {
    return this.request('/faculty/invites/accept', {
      method: 'POST',
      data: { inviteId },
      auth: true,
    });
  }

  async rejectFacultyInvite(inviteId) {
    return this.request('/faculty/invites/reject', {
      method: 'POST',
      data: { inviteId },
      auth: true,
    });
  }

  async getAcceptedConnections() {
    return this.request('/faculty/connections', {
      method: 'GET',
      auth: true,
    });
  }

  async sendMessage(recipientId, text, attachmentName = null, attachmentType = null, attachmentData = null) {
    return this.request('/faculty/messages/send', {
      method: 'POST',
      data: { recipientId, text, attachmentName, attachmentType, attachmentData },
      auth: true,
    });
  }

  async getConversation(facultyId, limit = 50) {
    return this.request(`/faculty/messages/conversation/${facultyId}?limit=${limit}`, {
      method: 'GET',
      auth: true,
    });
  }

  // ML Risk Prediction endpoints
  async getStudentRiskPrediction(studentId) {
    return this.request(`/ml/risk/student/${studentId}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getClassRiskPredictions(classId) {
    return this.request(`/ml/risk/class/${classId}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getSchoolRiskStatistics() {
    return this.request('/ml/risk/statistics', {
      method: 'GET',
      auth: true,
    });
  }

  async retrainMLModel() {
    return this.request('/ml/retrain', {
      method: 'POST',
      auth: true,
    });
  }
}

export default new ApiService();

