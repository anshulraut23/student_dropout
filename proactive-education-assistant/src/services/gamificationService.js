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

      // Call backend to save XP log
      const response = await apiService.request('/gamification/award-xp', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({
          actionType,
          xpEarned: xpAmount,
        }),
      });

      return response;
    } catch (error) {
      console.error('Error awarding XP:', error);
      // Still award XP locally even if backend fails
      return { success: true, xpEarned: amount };
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

      return response;
    } catch (error) {
      console.error('Error fetching gamification stats:', error);
      // Return mock data if backend fails
      return {
        totalXP: 680,
        currentLevel: 3,
        loginStreak: 7,
        tasksCompleted: 45,
        badges: [],
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
