// Mock Admin Service - Replace with real API calls

export const getAdminStats = () => {
  return {
    totalTeachers: 12,
    totalClasses: 24,
    totalStudents: 487,
    highRiskStudents: 23,
    activeInterventions: 8,
  };
};

export const getRiskDistribution = () => {
  return [
    { name: 'Low Risk', value: 350, color: '#10b981' },
    { name: 'Medium Risk', value: 114, color: '#f59e0b' },
    { name: 'High Risk', value: 23, color: '#ef4444' },
  ];
};

export const getRiskTrendData = () => {
  // Last 30 days of risk data
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      highRisk: Math.max(18, Math.floor(Math.random() * 35)),
      mediumRisk: Math.max(80, Math.floor(Math.random() * 150)),
    });
  }
  return days;
};

export const getHighRiskAlerts = () => {
  return [
    {
      id: 1,
      name: 'Raj Kumar',
      class: '10-A',
      riskLevel: 'High',
      lastIntervention: '2 days ago',
      avatar: '🔴',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      class: '9-B',
      riskLevel: 'High',
      lastIntervention: '5 days ago',
      avatar: '🔴',
    },
    {
      id: 3,
      name: 'Amit Patel',
      class: '10-C',
      riskLevel: 'High',
      lastIntervention: '1 day ago',
      avatar: '🔴',
    },
    {
      id: 4,
      name: 'Neha Singh',
      class: '9-A',
      riskLevel: 'Medium',
      lastIntervention: '3 days ago',
      avatar: '🟡',
    },
    {
      id: 5,
      name: 'Vikram Das',
      class: '8-D',
      riskLevel: 'High',
      lastIntervention: '1 week ago',
      avatar: '🔴',
    },
  ];
};

export const getTeachers = () => {
  return [
    {
      id: 1,
      name: 'Dr. Anjali Sharma',
      email: 'anjali.sharma@school.edu',
      assignedClasses: ['10-A', '10-B'],
      status: 'Approved',
      joinedDate: '2025-12-15',
    },
    {
      id: 2,
      name: 'Mr. Rakesh Kumar',
      email: 'rakesh.kumar@school.edu',
      assignedClasses: ['9-A', '9-C'],
      status: 'Approved',
      joinedDate: '2025-12-20',
    },
    {
      id: 3,
      name: 'Ms. Priya Patel',
      email: 'priya.patel@school.edu',
      assignedClasses: ['8-A', '8-B', '8-C'],
      status: 'Pending',
      joinedDate: '2026-01-10',
    },
  ];
};

export const getClasses = () => {
  return [
    {
      id: 1,
      name: '10-A',
      attendanceMode: 'Daily',
      studentCount: 42,
      teachers: ['Dr. Anjali Sharma'],
    },
    {
      id: 2,
      name: '10-B',
      attendanceMode: 'Subject-wise',
      studentCount: 38,
      teachers: ['Dr. Anjali Sharma', 'Mr. Rakesh Kumar'],
    },
    {
      id: 3,
      name: '9-A',
      attendanceMode: 'Daily',
      studentCount: 45,
      teachers: ['Mr. Rakesh Kumar'],
    },
  ];
};

export const getSubjects = (classId) => {
  const subjectsMap = {
    1: [
      { id: 1, name: 'Mathematics', teacher: 'Dr. Anjali Sharma' },
      { id: 2, name: 'English', teacher: 'Ms. Priya Patel' },
    ],
    2: [
      { id: 3, name: 'Mathematics', teacher: 'Mr. Rakesh Kumar' },
      { id: 4, name: 'Science', teacher: 'Dr. Anjali Sharma' },
      { id: 5, name: 'Hindi', teacher: 'Ms. Priya Patel' },
    ],
  };
  return subjectsMap[classId] || [];
};

// Legacy service exports for compatibility
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
    return { success: true, data: [] };
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
    return {
      success: true,
      data: {
        total: 100,
        successful: 95,
        failed: 5,
        errors: [
          { row: 23, reason: 'Missing required field: email' },
          { row: 45, reason: 'Invalid date format' },
        ]
      }
    };
  }
};
