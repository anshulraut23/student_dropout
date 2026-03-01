// API Service - Handles all backend API calls

const LOCAL_BACKEND_URL = 'http://localhost:5000/api';
const LOCAL_ML_URL = 'http://localhost:5001';
const PRODUCTION_BACKEND_URL = import.meta.env.VITE_API_URL || 'https://student-dropout-backend-032b.onrender.com/api';
const PRODUCTION_ML_URL = import.meta.env.VITE_ML_URL || 'https://student-dropout-1-dzck.onrender.com';

class ApiService {
  constructor() {
    this.backendUrl = LOCAL_BACKEND_URL;
    this.mlUrl = LOCAL_ML_URL;
    this.fallbackBackendUrl = PRODUCTION_BACKEND_URL;
    this.fallbackMlUrl = PRODUCTION_ML_URL;
    this.useLocalBackend = true;
    this.useLocalMl = true;
    this.serversChecked = false;
  }

  // Check if local servers are available
  async checkLocalServers() {
    if (this.serversChecked) return;
    
    // Check backend
    try {
      const response = await fetch(`${LOCAL_BACKEND_URL.replace('/api', '')}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      this.useLocalBackend = response.ok;
      console.log('🔌 Local backend:', this.useLocalBackend ? 'Available ✓' : 'Not available ✗');
    } catch (error) {
      this.useLocalBackend = false;
      console.log('🌐 Using production backend (local not available)');
    }
    
    // Check ML service
    try {
      const response = await fetch(`${LOCAL_ML_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      this.useLocalMl = response.ok;
      console.log('🤖 Local ML service:', this.useLocalMl ? 'Available ✓' : 'Not available ✗');
    } catch (error) {
      this.useLocalMl = false;
      console.log('🌐 Using production ML service (local not available)');
    }
    
    this.serversChecked = true;
    this.backendUrl = this.useLocalBackend ? LOCAL_BACKEND_URL : this.fallbackBackendUrl;
    this.mlUrl = this.useLocalMl ? LOCAL_ML_URL : this.fallbackMlUrl;
    
    console.log('📊 Backend URL:', this.backendUrl);
    console.log('🤖 ML Service URL:', this.mlUrl);
  }

  // Get current backend URL
  async getBackendUrl() {
    await this.checkLocalServers();
    return this.backendUrl;
  }

  // Get current ML service URL
  async getMlUrl() {
    await this.checkLocalServers();
    return this.mlUrl;
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

  // Generic request handler
  async request(endpoint, options = {}) {
    try {
      const headers = this.getHeaders(options.auth);
      const baseUrl = await this.getBackendUrl();
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
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
          throw new Error('Backend server endpoint not found. Make sure the backend server is running.');
        }
        
        throw new Error('Backend server error. Please check if the server is running and try again.');
      }

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ API Error Response:', {
          endpoint,
          status: response.status,
          statusText: response.statusText,
          data
        });

        const errorText = (data?.error || data?.message || '').toLowerCase();
        const isSchoolDeactivatedError = response.status === 403 && errorText.includes('deactivated');

        if (isSchoolDeactivatedError) {
          const activeRole = localStorage.getItem('role') || sessionStorage.getItem('role');
          const redirectPath = activeRole === 'admin' ? '/admin/login' : '/teacher/login';

          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('school_id');
          localStorage.removeItem('school_name');

          sessionStorage.removeItem('token');
          sessionStorage.removeItem('role');
          sessionStorage.removeItem('school_id');
          sessionStorage.removeItem('school_name');

          sessionStorage.setItem('forcedLogoutMessage', data.error || data.message || 'Your school is currently deactivated. Contact the super admin.');
          window.dispatchEvent(new Event('localStorageUpdate'));

          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.assign(redirectPath);
          }
        }

        const error = new Error(data.error || data.message || `Request failed with status ${response.status}`);
        error.response = { data, status: response.status }; // Preserve response data
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      
      // Provide more helpful error messages
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Cannot connect to backend server. Please check your connection.');
      }
      
      throw error;
    }
  }

  // Auth endpoints
  async registerAdmin(formData) {
    return this.request('/auth/register/admin', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async registerTeacher(formData) {
    return this.request('/auth/register/teacher', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
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

  // Super Admin endpoints
  async getPlatformStats() {
    return this.request('/super-admin/platform-stats', {
      method: 'GET',
      auth: true,
    });
  }

  async getAllSchoolsSummary() {
    return this.request('/super-admin/schools', {
      method: 'GET',
      auth: true,
    });
  }

  async getAllSchoolAdmins() {
    return this.request('/super-admin/admins', {
      method: 'GET',
      auth: true,
    });
  }

  async getPendingAdminRequests() {
    return this.request('/super-admin/admin-requests/pending', {
      method: 'GET',
      auth: true,
    });
  }

  async approveAdminRequest(adminId) {
    return this.request(`/super-admin/admin-requests/${adminId}/approve`, {
      method: 'POST',
      auth: true,
    });
  }

  async rejectAdminRequest(adminId) {
    return this.request(`/super-admin/admin-requests/${adminId}/reject`, {
      method: 'POST',
      auth: true,
    });
  }

  async updateSchoolStatus(schoolId, isActive) {
    return this.request(`/super-admin/schools/${schoolId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
      auth: true,
    });
  }

  async getSchoolSummary(schoolId) {
    return this.request(`/super-admin/schools/${schoolId}/summary`, {
      method: 'GET',
      auth: true,
    });
  }

  async getSchoolUpdates(schoolId) {
    return this.request(`/super-admin/schools/${schoolId}/updates`, {
      method: 'GET',
      auth: true,
    });
  }

  async getSchoolHighRiskStudents(schoolId) {
    return this.request(`/super-admin/schools/${schoolId}/high-risk-students`, {
      method: 'GET',
      auth: true,
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
      body: JSON.stringify({ classIds }),
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
      body: JSON.stringify(classData),
      auth: true,
    });
  }

  async updateClass(classId, classData) {
    return this.request(`/classes/${classId}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
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
      body: JSON.stringify(subjectData),
      auth: true,
    });
  }

  async updateSubject(subjectId, subjectData) {
    return this.request(`/subjects/${subjectId}`, {
      method: 'PUT',
      body: JSON.stringify(subjectData),
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
      body: JSON.stringify(studentData),
      auth: true,
    });
  }

  async createStudentsBulk(classId, students) {
    return this.request('/students/bulk', {
      method: 'POST',
      body: JSON.stringify({ classId, students }),
      auth: true,
    });
  }

  async updateStudent(studentId, studentData) {
    return this.request(`/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
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
      body: JSON.stringify(examData),
      auth: true,
    });
  }

  async updateExam(examId, examData) {
    return this.request(`/exams/${examId}`, {
      method: 'PUT',
      body: JSON.stringify(examData),
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
      body: JSON.stringify({ status }),
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
      body: JSON.stringify(templateData),
      auth: true,
    });
  }

  async updateExamTemplate(templateId, templateData) {
    return this.request(`/exam-templates/${templateId}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
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
      body: JSON.stringify(periodData),
      auth: true,
    });
  }

  async updateExamPeriod(periodId, periodData) {
    return this.request(`/exam-periods/${periodId}`, {
      method: 'PUT',
      body: JSON.stringify(periodData),
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
      body: JSON.stringify(marksData),
      auth: true,
    });
  }

  async enterBulkMarks(bulkData) {
    return this.request('/marks/bulk', {
      method: 'POST',
      body: JSON.stringify(bulkData),
      auth: true,
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
      body: JSON.stringify(updates),
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
      body: JSON.stringify(attendanceData),
      auth: true,
    });
  }

  /**
   * Mark bulk attendance for multiple students
   */
  async markBulkAttendance(bulkData) {
    return this.request('/attendance/mark-bulk', {
      method: 'POST',
      body: JSON.stringify(bulkData),
      auth: true,
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
      body: JSON.stringify(updates),
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
      body: JSON.stringify(performanceData),
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
      body: JSON.stringify({ 
        examId: performanceRecords[0]?.examId,
        marks 
      }),
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
      body: JSON.stringify(behaviorData),
      auth: true,
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
      body: JSON.stringify(updates),
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
      body: JSON.stringify(behaviourData),
      auth: true,
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
      body: JSON.stringify(updates),
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
      body: JSON.stringify(interventionData),
      auth: true,
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
      body: JSON.stringify(updates),
      auth: true,
    });
  }

  async deleteIntervention(interventionId) {
    return this.request(`/interventions/${interventionId}`, {
      method: 'DELETE',
      auth: true,
    });
  }

  async triggerInterventionEmail(studentId, emailData) {
    return this.request(`/interventions/trigger/${studentId}`, {
      method: 'POST',
      body: JSON.stringify(emailData),
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
      body: JSON.stringify(updates),
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
      body: JSON.stringify({ recipientId }),
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
      body: JSON.stringify({ inviteId }),
      auth: true,
    });
  }

  async rejectFacultyInvite(inviteId) {
    return this.request('/faculty/invites/reject', {
      method: 'POST',
      body: JSON.stringify({ inviteId }),
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
      body: JSON.stringify({ recipientId, text, attachmentName, attachmentType, attachmentData }),
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

  // AI Assistant endpoints
  async queryAIAssistant(query, confirmAction = null, confirmData = null) {
    const body = { query };
    if (confirmAction) body.confirmAction = confirmAction;
    if (confirmData) body.confirmData = confirmData;
    
    return this.request('/ai-assistant/query', {
      method: 'POST',
      body: JSON.stringify(body),
      auth: true,
    });
  }

  async queryGeneralAssistant(query) {
    return this.request('/ai-assistant/general', {
      method: 'POST',
      body: JSON.stringify({ query }),
      auth: true,
    });
  }

  async getAISuggestions() {
    return this.request('/ai-assistant/suggestions', {
      method: 'GET',
      auth: true,
    });
  }

  // Dropout Tracking endpoints
  async updateDropoutStatus(data) {
    return this.request('/dropout/update-status', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: true,
    });
  }

  async getDropoutStatistics() {
    return this.request('/dropout/statistics', {
      method: 'GET',
      auth: true,
    });
  }

  async getStudentDropoutHistory(studentId) {
    return this.request(`/dropout/history/${studentId}`, {
      method: 'GET',
      auth: true,
    });
  }

  async getTrainingData() {
    return this.request('/dropout/training-data', {
      method: 'GET',
      auth: true,
    });
  }

  async saveModelPerformance(data) {
    return this.request('/dropout/model-performance', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: true,
    });
  }

  async getModelPerformance() {
    return this.request('/dropout/model-performance', {
      method: 'GET',
      auth: true,
    });
  }
}

export default new ApiService();
