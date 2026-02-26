// Gamification Controller - API endpoint handlers

import dataStore from '../storage/dataStore.js';

const LEVELS = [
  { id: 1, minXP: 0 },
  { id: 2, minXP: 300 },
  { id: 3, minXP: 1000 },
  { id: 4, minXP: 2000 },
  { id: 5, minXP: 4000 }
];

const DAILY_TASK_TYPES = ['attendance', 'marks', 'behaviour', 'intervention', 'login'];

const getLevelFromXP = (totalXP) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].minXP) return LEVELS[i].id;
  }
  return 1;
};

const getDateRange = (filter) => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (filter === 'today') {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (filter === 'week') {
    const day = start.getDay();
    const diff = (day === 0 ? 6 : day - 1);
    start.setDate(start.getDate() - diff);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (filter === 'month') {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  return { start, end };
};

const buildDailyTasksCompleted = (logs) => {
  const completed = {
    attendance: false,
    marks: false,
    behaviour: false,
    intervention: false,
    login: false
  };

  logs.forEach((log) => {
    if (completed.hasOwnProperty(log.actionType)) {
      completed[log.actionType] = true;
    }
  });

  return completed;
};

const computeWeeklyTaskCompletion = (logs) => {
  const byDate = new Map();

  logs.forEach((log) => {
    const dateKey = new Date(log.createdAt).toISOString().slice(0, 10);
    if (!byDate.has(dateKey)) {
      byDate.set(dateKey, new Set());
    }
    byDate.get(dateKey).add(log.actionType);
  });

  let completedDays = 0;
  for (const actionSet of byDate.values()) {
    if (DAILY_TASK_TYPES.every((type) => actionSet.has(type))) {
      completedDays += 1;
    }
  }

  return completedDays;
};

const ensureTeacherRow = async (teacherId) => {
  let stats = await dataStore.getTeacherGamification(teacherId);
  if (!stats) {
    stats = await dataStore.createTeacherGamification(teacherId, {});
  }
  return stats;
};

const evaluateBadges = async (teacherId, stats) => {
  const definitions = await dataStore.getBadgeDefinitions();
  const earned = await dataStore.getTeacherBadges(teacherId);
  const earnedIds = new Set(earned.map((b) => b.badgeId));

  const newBadges = [];

  definitions.forEach((badge) => {
    if (earnedIds.has(badge.badgeId)) return;

    const shouldAward = (
      (badge.badgeId === 'first_10_students' && stats.studentsAdded >= 10) ||
      (badge.badgeId === '7_day_streak' && stats.loginStreak >= 7) ||
      (badge.badgeId === '100_records' && stats.attendanceRecords >= 100) ||
      (badge.badgeId === 'risk_saver' && stats.highRiskStudentsHelped >= 5) ||
      (badge.badgeId === 'consistency_star' && stats.weeklyTaskCompletion >= 7)
    );

    if (shouldAward) {
      newBadges.push(badge.badgeId);
    }
  });

  for (const badgeId of newBadges) {
    await dataStore.addTeacherBadge(teacherId, badgeId, new Date().toISOString());
  }

  return newBadges;
};

const buildStatsResponse = async (teacherId) => {
  const stats = await ensureTeacherRow(teacherId);
  const badges = await dataStore.getTeacherBadges(teacherId);
  const badgeIds = badges.map((b) => b.badgeId);

  const { start, end } = getDateRange('today');
  const logsToday = await dataStore.getXPLogsForTeacher(teacherId, { 
    startDate: start.toISOString(), 
    endDate: end.toISOString() 
  });
  const dailyTasksCompleted = buildDailyTasksCompleted(logsToday);

  const { start: weekStart, end: weekEnd } = getDateRange('week');
  const logsWeek = await dataStore.getXPLogsForTeacher(teacherId, { 
    startDate: weekStart.toISOString(), 
    endDate: weekEnd.toISOString() 
  });
  const weeklyTaskCompletion = computeWeeklyTaskCompletion(logsWeek);

  if (weeklyTaskCompletion !== stats.weeklyTaskCompletion) {
    await dataStore.updateTeacherGamification(teacherId, { weeklyTaskCompletion });
    stats.weeklyTaskCompletion = weeklyTaskCompletion;
  }

  return {
    totalXP: stats.totalXP,
    currentLevel: stats.currentLevel,
    loginStreak: stats.loginStreak,
    tasksCompleted: stats.tasksCompleted,
    studentsHelped: stats.studentsHelped,
    studentsAdded: stats.studentsAdded,
    attendanceRecords: stats.attendanceRecords,
    highRiskStudentsHelped: stats.highRiskStudentsHelped,
    weeklyTaskCompletion: stats.weeklyTaskCompletion,
    badges: badgeIds,
    earnedBadges: badges.map((b) => ({ badgeId: b.badgeId, earnedAt: b.earnedAt })),
    dailyTasksCompleted,
    lastActiveDate: stats.lastActiveDate
  };
};

export const getTeacherStats = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log('📊 Fetching stats for userId:', userId);
    const stats = await buildStatsResponse(userId);
    console.log('✅ Stats retrieved successfully');

    res.json({ success: true, stats });
  } catch (error) {
    console.error('❌ GET GAMIFICATION STATS ERROR:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch stats',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

export const awardXP = async (req, res) => {
  try {
    const { userId } = req.user;
    const { actionType, xpEarned } = req.body;

    if (!actionType || xpEarned === undefined) {
      return res.status(400).json({ success: false, error: 'actionType and xpEarned are required' });
    }

    const stats = await ensureTeacherRow(userId);

    await dataStore.addXPLog({
      teacherId: userId,
      actionType,
      xpEarned,
      createdAt: new Date().toISOString()
    });

    const newTotalXP = stats.totalXP + Number(xpEarned || 0);
    const newLevel = getLevelFromXP(newTotalXP);
    const tasksCompleted = stats.tasksCompleted + 1;

    await dataStore.updateTeacherGamification(userId, {
      totalXP: newTotalXP,
      currentLevel: newLevel,
      tasksCompleted,
      lastActiveDate: new Date().toISOString().slice(0, 10)
    });

    const updatedStats = await buildStatsResponse(userId);
    await evaluateBadges(userId, updatedStats);

    res.json({ success: true, stats: updatedStats });
  } catch (error) {
    console.error('Award XP error:', error);
    res.status(500).json({ success: false, error: 'Failed to award XP' });
  }
};

export const updateLoginStreak = async (req, res) => {
  try {
    const { userId } = req.user;
    const stats = await ensureTeacherRow(userId);

    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);
    const lastActive = stats.lastActiveDate ? new Date(stats.lastActiveDate).toISOString().slice(0, 10) : null;

    let newStreak = stats.loginStreak || 0;

    if (lastActive === todayKey) {
      newStreak = stats.loginStreak || 0;
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().slice(0, 10);

      newStreak = lastActive === yesterdayKey ? (stats.loginStreak || 0) + 1 : 1;

      await dataStore.addXPLog({
        teacherId: userId,
        actionType: 'login',
        xpEarned: 10,
        createdAt: new Date().toISOString()
      });

      await dataStore.updateTeacherGamification(userId, {
        loginStreak: newStreak,
        totalXP: stats.totalXP + 10,
        currentLevel: getLevelFromXP(stats.totalXP + 10),
        tasksCompleted: stats.tasksCompleted + 1,
        lastActiveDate: todayKey
      });
    }

    const updatedStats = await buildStatsResponse(userId);
    await evaluateBadges(userId, updatedStats);

    res.json({ success: true, streak: newStreak, stats: updatedStats });
  } catch (error) {
    console.error('Update login streak error:', error);
    res.status(500).json({ success: false, error: 'Failed to update login streak' });
  }
};

export const checkBadges = async (req, res) => {
  try {
    const { userId } = req.user;
    const stats = await buildStatsResponse(userId);
    const newBadges = await evaluateBadges(userId, stats);

    res.json({ success: true, newBadges, stats });
  } catch (error) {
    console.error('Check badges error:', error);
    res.status(500).json({ success: false, error: 'Failed to check badges' });
  }
};

export const updateMetrics = async (req, res) => {
  try {
    const { userId } = req.user;
    const { updates } = req.body;

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, error: 'updates object is required' });
    }

    const stats = await ensureTeacherRow(userId);
    const nextUpdates = {};

    Object.keys(updates).forEach((key) => {
      if (typeof updates[key] === 'number') {
        nextUpdates[key] = (stats[key] || 0) + updates[key];
      } else {
        nextUpdates[key] = updates[key];
      }
    });

    await dataStore.updateTeacherGamification(userId, nextUpdates);

    const updatedStats = await buildStatsResponse(userId);
    await evaluateBadges(userId, updatedStats);

    res.json({ success: true, stats: updatedStats });
  } catch (error) {
    console.error('Update metrics error:', error);
    res.status(500).json({ success: false, error: 'Failed to update metrics' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const filter = (req.query.filter || 'all-time').toLowerCase();

    const { start, end } = getDateRange(filter);
    const useLogs = filter !== 'all-time';

    const leaderboard = await dataStore.getLeaderboard({ start, end, useLogs });

    const ranked = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.json({
      success: true,
      leaderboard: ranked,
      totalTeachers: ranked.length
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
};

export const getTeacherRank = async (req, res) => {
  try {
    const { userId } = req.user;
    const filter = (req.query.filter || 'all-time').toLowerCase();
    const { start, end } = getDateRange(filter);
    const useLogs = filter !== 'all-time';

    const leaderboard = await dataStore.getLeaderboard({ start, end, useLogs });
    const ranked = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    const me = ranked.find((entry) => entry.teacherId === userId);

    res.json({
      success: true,
      rank: me ? me.rank : 0,
      totalTeachers: ranked.length
    });
  } catch (error) {
    console.error('Get rank error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch rank' });
  }
};

export const downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const content = `Certificate ID: ${certificateId}\nIssued: ${new Date().toISOString()}\nCongratulations on your achievement.`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${certificateId}.pdf`);
    res.send(content);
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({ success: false, error: 'Failed to download certificate' });
  }
};
