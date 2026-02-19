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
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: this.getHeaders(options.auth),
      });

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
}

export default new ApiService();
