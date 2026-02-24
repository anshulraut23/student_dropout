// Hook to integrate gamification with teacher actions
import { useGame } from '../context/GamificationContext';
import gamificationService from '../services/gamificationService';

export const useGameification = () => {
  const { applyServerStats } = useGame();

  // Award XP for attendance entry
  const awardAttendanceXP = async () => {
    const response = await gamificationService.awardXP('attendance', 20);
    if (response && response.stats) applyServerStats(response.stats);
  };

  // Award XP for marks entry
  const awardMarksXP = async () => {
    const response = await gamificationService.awardXP('marks', 30);
    if (response && response.stats) applyServerStats(response.stats);
  };

  // Award XP for behavior entry
  const awardBehaviorXP = async () => {
    const response = await gamificationService.awardXP('behaviour', 20);
    if (response && response.stats) applyServerStats(response.stats);
  };

  // Award XP for intervention
  const awardInterventionXP = async () => {
    const response = await gamificationService.awardXP('intervention', 40);
    if (response && response.stats) applyServerStats(response.stats);
  };

  // Award daily login XP
  const awardLoginXP = async () => {
    const lastLogin = localStorage.getItem('lastGameificationLogin');
    const today = new Date().toDateString();

    if (lastLogin !== today) {
      const response = await gamificationService.awardXP('login', 10);
      if (response && response.stats) applyServerStats(response.stats);
      localStorage.setItem('lastGameificationLogin', today);
    }
  };

  // Track when a student is added
  const trackStudentAdded = () => {
    gamificationService.updateMetrics({ studentsAdded: 1 }).then((response) => {
      if (response && response.stats) applyServerStats(response.stats);
    });
  };

  // Track attendance record
  const trackAttendanceRecord = () => {
    gamificationService.updateMetrics({ attendanceRecords: 1 }).then((response) => {
      if (response && response.stats) applyServerStats(response.stats);
    });
  };

  // Track high-risk student helped
  const trackHighRiskStudentHelped = () => {
    gamificationService.updateMetrics({ highRiskStudentsHelped: 1 }).then((response) => {
      if (response && response.stats) applyServerStats(response.stats);
    });
  };

  return {
    awardAttendanceXP,
    awardMarksXP,
    awardBehaviorXP,
    awardInterventionXP,
    awardLoginXP,
    trackStudentAdded,
    trackAttendanceRecord,
    trackHighRiskStudentHelped
  };
};

export default useGameification;
