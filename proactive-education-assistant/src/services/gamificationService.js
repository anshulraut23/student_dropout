// Gamification Service - Handle XP awards, badges, and leaderboard

import apiService from './apiService';

class GamificationService {
  // Award XP for an action
  async awardXP(actionType, amount = 0) {
    try {
      // Calculate XP based on action type if amount not provided
      const xpMap = {
        attendance: 20,
        marks: 30,
        behaviour: 20,
        intervention: 40,
        login: 10,
      };

      const xpAmount = amount || xpMap[actionType] || 0;

      console.log(`🎮 Awarding ${xpAmount} XP for ${actionType}...`);

      // Call backend to save XP log
      const response = await apiService.request('/gamification/award-xp', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({
          actionType,
          xpEarned: xpAmount,
        }),
      });

      console.log('✅ XP awarded successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error awarding XP:', error);
      console.error('Error details:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Check and award badges
  async checkAndAwardBadges(teacherStats) {
    try {
      const response = await apiService.request('/gamification/check-badges', {
        method: 'POST',
        auth: true,
        body: JSON.stringify(teacherStats),
      });

      return response;
    } catch (error) {
      console.error('Error checking badges:', error);
      return { badges: [] };
    }
  }

  // Get teacher gamification stats
  async getTeacherStats() {
    try {
      const response = await apiService.request('/gamification/stats', {
        auth: true,
      });

      console.log('✅ Gamification stats loaded:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching gamification stats:', error);
      console.error('Error details:', error.message);
      // Return empty stats instead of mock data
      return {
        success: false,
        error: error.message,
        stats: {
          totalXP: 0,
          currentLevel: 1,
          loginStreak: 0,
          tasksCompleted: 0,
          studentsHelped: 0,
          studentsAdded: 0,
          attendanceRecords: 0,
          highRiskStudentsHelped: 0,
          weeklyTaskCompletion: 0,
          badges: [],
          earnedBadges: [],
          dailyTasksCompleted: {
            attendance: false,
            marks: false,
            behaviour: false,
            intervention: false,
            login: false
          },
          lastActiveDate: null
        }
      };
    }
  }

  // Get leaderboard
  async getLeaderboard(filter = 'all-time') {
    try {
      const response = await apiService.request(`/gamification/leaderboard?filter=${filter}`, {
        auth: true,
      });

      return response;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return { leaderboard: [], totalTeachers: 0 };
    }
  }

  // Get teacher rank
  async getTeacherRank() {
    try {
      const response = await apiService.request('/gamification/rank', {
        auth: true,
      });

      return response;
    } catch (error) {
      console.error('Error fetching teacher rank:', error);
      return { rank: 0, totalTeachers: 0 };
    }
  }

  // Update login streak
  async updateLoginStreak() {
    try {
      const response = await apiService.request('/gamification/update-streak', {
        method: 'POST',
        auth: true,
      });

      return response;
    } catch (error) {
      console.error('Error updating login streak:', error);
      return { streak: 1 };
    }
  }

  // Update metrics (studentsAdded, attendanceRecords, etc)
  async updateMetrics(updates = {}) {
    try {
      const response = await apiService.request('/gamification/metrics', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ updates })
      });

      return response;
    } catch (error) {
      console.error('Error updating gamification metrics:', error);
      return { success: false };
    }
  }

  // Download certificate
  async downloadCertificate(certificateId) {
    try {
      const response = await fetch(
        `${apiService.baseUrl}/gamification/certificate/${certificateId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiService.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download certificate');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true };
    } catch (error) {
      console.error('Error downloading certificate:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new GamificationService();
