// Leaderboard Service - Handle leaderboard data and filtering

import apiService from './apiService';

class LeaderboardService {
  // Fetch leaderboard with filters
  async fetchLeaderboard(filterType = 'all-time', schoolId = null) {
    try {
      let endpoint = `/gamification/leaderboard?filter=${filterType}`;
      if (schoolId) {
        endpoint += `&schoolId=${schoolId}`;
      }

      const response = await apiService.request(endpoint, {
        auth: true,
      });

      return response.leaderboard || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return this.getMockLeaderboard();
    }
  }

  // Get teacher's rank
  async getTeacherRank(filterType = 'all-time') {
    try {
      const response = await apiService.request(
        `/gamification/leaderboard/rank?filter=${filterType}`,
        {
          auth: true,
        }
      );

      return response;
    } catch (error) {
      console.error('Error fetching teacher rank:', error);
      return { rank: 0, totalTeachers: 0 };
    }
  }

  // Get school leaderboard
  async getSchoolLeaderboard(schoolId, filterType = 'all-time') {
    try {
      const response = await apiService.request(
        `/gamification/leaderboard/school/${schoolId}?filter=${filterType}`,
        {
          auth: true,
        }
      );

      return response.leaderboard || [];
    } catch (error) {
      console.error('Error fetching school leaderboard:', error);
      return [];
    }
  }

  // Get district leaderboard
  async getDistrictLeaderboard(districtId, filterType = 'all-time') {
    try {
      const response = await apiService.request(
        `/gamification/leaderboard/district/${districtId}?filter=${filterType}`,
        {
          auth: true,
        }
      );

      return response.leaderboard || [];
    } catch (error) {
      console.error('Error fetching district leaderboard:', error);
      return [];
    }
  }

  // Mock leaderboard data for testing
  getMockLeaderboard() {
    return [
      {
        rank: 1,
        teacherId: 'teacher_001',
        name: 'Rajesh Kumar',
        schoolName: 'Delhi Public School',
        level: 5,
        totalXP: 5420,
        badgesCount: 8,
      },
      {
        rank: 2,
        teacherId: 'teacher_002',
        name: 'Priya Sharma',
        schoolName: 'St. Mary School',
        level: 5,
        totalXP: 5180,
        badgesCount: 7,
      },
      {
        rank: 3,
        teacherId: 'teacher_003',
        name: 'Amit Patel',
        schoolName: 'DAV School',
        level: 4,
        totalXP: 3920,
        badgesCount: 6,
      },
      {
        rank: 4,
        teacherId: 'teacher_004',
        name: 'Neha Singh',
        schoolName: 'Delhi Public School',
        level: 4,
        totalXP: 3650,
        badgesCount: 5,
      },
      {
        rank: 5,
        teacherId: 'teacher_005',
        name: 'Vikram Reddy',
        schoolName: 'St. Xavier School',
        level: 3,
        totalXP: 2840,
        badgesCount: 4,
      },
      {
        rank: 6,
        teacherId: 'teacher_006',
        name: 'Anjali Gupta',
        schoolName: 'Vidya Niketan',
        level: 3,
        totalXP: 2120,
        badgesCount: 3,
      },
      {
        rank: 7,
        teacherId: 'teacher_007',
        name: 'David Martinez',
        schoolName: 'American School',
        level: 2,
        totalXP: 1450,
        badgesCount: 2,
      },
      {
        rank: 8,
        teacherId: 'teacher_008',
        name: 'Sarah Williams',
        schoolName: 'Riverside School',
        level: 2,
        totalXP: 980,
        badgesCount: 2,
      },
      {
        rank: 9,
        teacherId: 'teacher_009',
        name: 'Ravi Verma',
        schoolName: 'Delhi Public School',
        level: 2,
        totalXP: 720,
        badgesCount: 1,
      },
      {
        rank: 10,
        teacherId: 'teacher_010',
        name: 'Emma Johnson',
        schoolName: 'International School',
        level: 1,
        totalXP: 450,
        badgesCount: 1,
      },
    ];
  }

  // Calculate rank medals
  getRankMedal(rank) {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '🎖️';
    }
  }

  // Get median XP for a filter
  async getMedianXP(filterType = 'all-time') {
    try {
      const leaderboard = await this.fetchLeaderboard(filterType);
      if (leaderboard.length === 0) return 0;

      const xpValues = leaderboard.map((t) => t.totalXP).sort((a, b) => a - b);
      const mid = Math.floor(xpValues.length / 2);

      if (xpValues.length % 2 === 0) {
        return (xpValues[mid - 1] + xpValues[mid]) / 2;
      }
      return xpValues[mid];
    } catch (error) {
      return 0;
    }
  }
}

export default new LeaderboardService();
