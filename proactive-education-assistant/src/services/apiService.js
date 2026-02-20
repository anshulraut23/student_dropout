// API Service - Handles all backend API calls

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

  // Generic request handler
  async request(endpoint, options = {}) {
    try {
      const headers = this.getHeaders(options.auth);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
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
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
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
}

export default new ApiService();
