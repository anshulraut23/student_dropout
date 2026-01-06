// Mock Admin Service - Replace with real API calls

// Mock Teachers Data
const mockTeachers = [
  {
    id: 1,
    name: 'Dr. Anjali Sharma',
    email: 'anjali.sharma@school.edu',
    status: 'pending',
    assignedClasses: [],
    joinedDate: '2026-01-02',
    subject: 'Mathematics'
  },
  {
    id: 2,
    name: 'Mr. Rakesh Kumar',
    email: 'rakesh.kumar@school.edu',
    status: 'approved',
    assignedClasses: ['Grade 7A', 'Grade 7B'],
    joinedDate: '2025-12-15',
    subject: 'Science'
  },
  {
    id: 3,
    name: 'Ms. Priya Patel',
    email: 'priya.patel@school.edu',
    status: 'approved',
    assignedClasses: ['Grade 6A'],
    joinedDate: '2025-11-20',
    subject: 'English'
  },
  {
    id: 4,
    name: 'Mr. Vikram Singh',
    email: 'vikram.singh@school.edu',
    status: 'pending',
    assignedClasses: [],
    joinedDate: '2026-01-05',
    subject: 'Social Studies'
  },
];

// Mock Classes Data
const mockClasses = [
  {
    id: 1,
    name: 'Grade 7A',
    description: 'Grade 7 Section A - Morning Batch',
    studentCount: 35,
    assignedTeachers: ['Mr. Rakesh Kumar'],
    status: 'active',
    grade: 7
  },
  {
    id: 2,
    name: 'Grade 7B',
    description: 'Grade 7 Section B - Afternoon Batch',
    studentCount: 32,
    assignedTeachers: ['Mr. Rakesh Kumar'],
    status: 'active',
    grade: 7
  },
  {
    id: 3,
    name: 'Grade 6A',
    description: 'Grade 6 Section A - Morning Batch',
    studentCount: 30,
    assignedTeachers: ['Ms. Priya Patel'],
    status: 'active',
    grade: 6
  },
  {
    id: 4,
    name: 'Grade 8A',
    description: 'Grade 8 Section A',
    studentCount: 0,
    assignedTeachers: [],
    status: 'inactive',
    grade: 8
  },
];

// Mock Analytics Data
const mockAnalytics = {
  totalTeachers: 4,
  pendingApprovals: 2,
  totalClasses: 4,
  activeClasses: 3,
  totalStudents: 97,
  highRiskStudents: 15,
  mediumRiskStudents: 28,
  lowRiskStudents: 54,
  riskDistribution: {
    high: 15,
    medium: 28,
    low: 54
  },
  attendanceTrend: [78, 80, 79, 82, 81, 83, 82],
  improvementRate: 12.5
};

// Simulated delay for realistic API behavior
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
  // Fetch all teachers
  async getTeachers() {
    await delay();
    return { success: true, data: mockTeachers };
  },

  // Fetch all classes
  async getClasses() {
    await delay();
    return { success: true, data: mockClasses };
  },

  // Fetch all students (from existing data)
  async getStudents() {
    await delay();
    // This would typically fetch from the same students data
    return { success: true, data: [] }; // Will use existing students data
  },

  // Fetch analytics data
  async getAnalytics() {
    await delay();
    return { success: true, data: mockAnalytics };
  },

  // Add new class
  async addClass(classData) {
    await delay();
    const newClass = {
      id: mockClasses.length + 1,
      ...classData,
      studentCount: 0,
      assignedTeachers: [],
      status: 'active'
    };
    mockClasses.push(newClass);
    return { success: true, data: newClass };
  },

  // Update class
  async updateClass(id, classData) {
    await delay();
    const index = mockClasses.findIndex(c => c.id === id);
    if (index !== -1) {
      mockClasses[index] = { ...mockClasses[index], ...classData };
      return { success: true, data: mockClasses[index] };
    }
    return { success: false, message: 'Class not found' };
  },

  // Deactivate class
  async deactivateClass(id) {
    await delay();
    const index = mockClasses.findIndex(c => c.id === id);
    if (index !== -1) {
      mockClasses[index].status = 'inactive';
      return { success: true, data: mockClasses[index] };
    }
    return { success: false, message: 'Class not found' };
  },

  // Import data (bulk upload)
  async importData(file, type) {
    await delay(1000);
    // Mock import result
    return {
      success: true,
      data: {
        total: 100,
        successful: 95,
        failed: 5,
        errors: [
          { row: 23, reason: 'Missing required field: email' },
          { row: 45, reason: 'Invalid date format' },
          { row: 67, reason: 'Duplicate entry' },
          { row: 89, reason: 'Invalid class code' },
          { row: 92, reason: 'Missing required field: name' }
        ]
      }
    };
  }
};
