import { createContext, useContext, useState, useEffect } from "react";
import gamificationService from "../services/gamificationService";

const GameContext = createContext();

// Level definitions
const LEVELS = [
  { id: 1, title: "Newcomer", minXP: 0, maxXP: 300, badge: "🌟", certificate: null },
  { id: 2, title: "Helper", minXP: 300, maxXP: 1000, badge: "🤝", certificate: "Emerging Educator" },
  { id: 3, title: "Student Champion", minXP: 1000, maxXP: 2000, badge: "🏆", certificate: "Student Champion" },
  { id: 4, title: "Mentor", minXP: 2000, maxXP: 4000, badge: "🎓", certificate: "Certified Mentor" },
  { id: 5, title: "Master Educator", minXP: 4000, maxXP: Infinity, badge: "👑", certificate: "Master Educator" },
];

// Badge definitions
const BADGE_DEFINITIONS = {
  "first_10_students": {
    id: "first_10_students",
    title: "First 10 Students",
    description: "Added your first 10 students",
    icon: "👥",
    criteria: "studentsAdded >= 10",
  },
  "7_day_streak": {
    id: "7_day_streak",
    title: "7 Day Streak",
    description: "Logged in for 7 consecutive days",
    icon: "🔥",
    criteria: "loginStreak >= 7",
  },
  "100_records": {
    id: "100_records",
    title: "100 Attendance Records",
    description: "Tracked 100 attendance records",
    icon: "📊",
    criteria: "attendanceRecords >= 100",
  },
  "risk_saver": {
    id: "risk_saver",
    title: "Student Supporter",
    description: "Helped 5 high-risk students",
    icon: "💙",
    criteria: "highRiskStudentsHelped >= 5",
  },
  "consistency_star": {
    id: "consistency_star",
    title: "Consistency Star",
    description: "Completed all daily tasks for a week",
    icon: "⭐",
    criteria: "weeklyTaskCompletion === 7",
  },
};

// Daily tasks
const DAILY_TASKS = [
  { id: 1, type: "attendance", description: "Add attendance record", xpReward: 20, icon: "📋" },
  { id: 2, type: "marks", description: "Add student marks", xpReward: 30, icon: "📝" },
  { id: 3, type: "behaviour", description: "Add behaviour note", xpReward: 20, icon: "📌" },
  { id: 4, type: "intervention", description: "Complete intervention", xpReward: 40, icon: "🎯" },
  { id: 5, type: "login", description: "Daily login", xpReward: 10, icon: "🔑" },
];

export function GamificationProvider({ children }) {
  const defaultState = {
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
      login: false,
    },
    lastActiveDate: null,
    xpHistory: [],
  };

  const [gamificationData, setGamificationData] = useState(defaultState);

  const normalizeStats = (stats) => ({
    ...defaultState,
    ...stats,
    dailyTasksCompleted: {
      ...defaultState.dailyTasksCompleted,
      ...(stats.dailyTasksCompleted || {})
    }
  });

  const applyServerStats = (stats) => {
    if (!stats) return;
    setGamificationData((prev) => ({
      ...prev,
      ...normalizeStats(stats)
    }));
  };

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      // Only load stats if user is authenticated
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        return; // Skip loading stats if not authenticated
      }

      try {
        console.log('📊 Loading gamification stats from backend...');
        const response = await gamificationService.getTeacherStats();
        if (isMounted && response && response.stats) {
          console.log('✅ Loaded stats from backend:', response.stats);
          applyServerStats(response.stats);
        } else {
          console.log('⚠️ No stats returned from backend, using defaults');
        }
      } catch (error) {
        console.error('❌ Error fetching gamification stats:', error);
        console.log('Using default stats instead');
        // Use default state instead of any cached data
        setGamificationData(defaultState);
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  // Remove localStorage persistence - rely only on backend database
  // This ensures fresh, accurate data on every page load

  const addXP = (amount, actionType = "general") => {
    setGamificationData((prev) => {
      const newTotalXP = prev.totalXP + amount;
      const newLevel = getLevelFromXP(newTotalXP);
      return {
        ...prev,
        totalXP: newTotalXP,
        currentLevel: newLevel,
        xpHistory: [
          ...prev.xpHistory,
          { amount, actionType, date: new Date().toISOString() },
        ],
      };
    });
  };

  const markTaskCompleted = (taskType) => {
    setGamificationData((prev) => {
      const taskXP = DAILY_TASKS.find((t) => t.type === taskType)?.xpReward || 0;
      if (taskXP > 0 && !prev.dailyTasksCompleted[taskType]) {
        addXP(taskXP, taskType);
      }

      return {
        ...prev,
        dailyTasksCompleted: {
          ...prev.dailyTasksCompleted,
          [taskType]: true,
        },
        tasksCompleted: prev.tasksCompleted + 1,
      };
    });
  };

  const awardBadge = (badgeId) => {
    setGamificationData((prev) => {
      if (!prev.badges.includes(badgeId)) {
        return {
          ...prev,
          badges: [...prev.badges, badgeId],
          earnedBadges: [
            ...prev.earnedBadges,
            { badgeId, earnedAt: new Date().toISOString() },
          ],
        };
      }
      return prev;
    });
  };

  const updateMetric = (metricName, value) => {
    setGamificationData((prev) => ({
      ...prev,
      [metricName]: value,
    }));
  };

  const resetDailyTasks = () => {
    setGamificationData((prev) => ({
      ...prev,
      dailyTasksCompleted: {
        attendance: false,
        marks: false,
        behaviour: false,
        intervention: false,
        login: false,
      },
    }));
  };

  const clearAllData = () => {
    console.log('🔄 Clearing gamification data...');
    setGamificationData(defaultState);
    localStorage.removeItem('gamificationData');
  };

  const getLevelFromXP = (totalXP) => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVELS[i].minXP) {
        return LEVELS[i].id;
      }
    }
    return 1;
  };

  const getCurrentLevelData = () => {
    return LEVELS[gamificationData.currentLevel - 1];
  };

  const getNextLevelData = () => {
    if (gamificationData.currentLevel < LEVELS.length) {
      return LEVELS[gamificationData.currentLevel];
    }
    return null;
  };

  const getXPProgressToNextLevel = () => {
    const nextLevel = getNextLevelData();
    if (!nextLevel) {
      return { current: 0, next: 0, progress: 100 };
    }

    const currentLevelMinXP = LEVELS[gamificationData.currentLevel - 1].minXP;
    const nextLevelMinXP = nextLevel.minXP;

    const currentXPInThisLevel = gamificationData.totalXP - currentLevelMinXP;
    const xpNeededForNextLevel = nextLevelMinXP - currentLevelMinXP;
    const progress = Math.round((currentXPInThisLevel / xpNeededForNextLevel) * 100);

    return {
      current: currentXPInThisLevel,
      next: xpNeededForNextLevel,
      progress: Math.min(progress, 100),
      xpRemaining: Math.max(nextLevelMinXP - gamificationData.totalXP, 0),
    };
  };

  const value = {
    gamificationData,
    addXP,
    markTaskCompleted,
    awardBadge,
    updateMetric,
    resetDailyTasks,
    clearAllData,
    applyServerStats,
    getLevelFromXP,
    getCurrentLevelData,
    getNextLevelData,
    getXPProgressToNextLevel,
    LEVELS,
    BADGE_DEFINITIONS,
    DAILY_TASKS,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GamificationProvider");
  }
  return context;
};
