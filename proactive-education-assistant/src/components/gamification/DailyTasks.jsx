// DailyTasks Component - Display daily tasks and XP rewards
import { useGame } from '../../context/GamificationContext';
import gamificationService from '../../services/gamificationService';
import { useTranslation } from 'react-i18next';

export default function DailyTasks() {
  const { t } = useTranslation();
  const { gamificationData, markTaskCompleted, DAILY_TASKS, applyServerStats } = useGame();

  const tasksCompleted = Object.values(gamificationData.dailyTasksCompleted).filter(Boolean).length;
  const totalTasks = DAILY_TASKS.length;
  const completionPercentage = Math.round((tasksCompleted / totalTasks) * 100);

  const getTaskDescription = (task) => {
    const keyMap = {
      attendance: 'add_attendance_record',
      marks: 'add_student_marks',
      behaviour: 'add_behaviour_note',
      intervention: 'complete_intervention',
      login: 'daily_login',
    };

    return t(`teacher_gamification.daily_tasks.${keyMap[task.type]}`, task.description);
  };

  const handleTaskClick = async (task) => {
    if (!gamificationData.dailyTasksCompleted[task.type]) {
      // Mark task as completed
      markTaskCompleted(task.type);

      // Award XP to backend
      try {
        const response = await gamificationService.awardXP(task.type, task.xpReward);
        if (response && response.stats) {
          applyServerStats(response.stats);
        }
      } catch (error) {
        console.error('Error awarding XP:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Today's Bonus Tasks */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <span>📋</span> {t('teacher_gamification.daily_tasks.title', "Today's Bonus Tasks")}
        </h3>

        <div className="space-y-3">
          {DAILY_TASKS.map((task) => {
            const isCompleted = gamificationData.dailyTasksCompleted[task.type];

            return (
              <button
                key={task.id}
                onClick={() => handleTaskClick(task)}
                disabled={isCompleted}
                className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition-all ${
                  isCompleted
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer'
                }`}
              >
                <div className={`text-xl mt-0.5 ${isCompleted ? 'text-green-600' : 'text-slate-400'}`}>
                  {isCompleted ? '✓' : '◻️'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{getTaskDescription(task)}</p>
                  <p className={`text-xs font-medium mt-1 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                    {isCompleted
                      ? t('teacher_gamification.daily_tasks.xp_earned', '+{{xp}} XP earned', { xp: task.xpReward })
                      : t('teacher_gamification.daily_tasks.earn_xp', 'Earn +{{xp}} XP', { xp: task.xpReward })}
                  </p>
                </div>
                <div className="text-lg">{task.icon}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500">{t('teacher_gamification.daily_tasks.daily_progress', 'Daily progress')}</span>
            <span className="text-xs font-semibold text-slate-900">
              {t('teacher_gamification.daily_tasks.completed_count', '{{done}} / {{total}} completed', { done: tasksCompleted, total: totalTasks })}
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {tasksCompleted === totalTasks && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-semibold text-green-700">🎉 {t('teacher_gamification.daily_tasks.all_tasks_completed', 'All tasks completed! Great job!')}</p>
          </div>
        )}
      </div>

      {/* This Week Stats */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
        <h3 className="font-semibold text-slate-900 mb-4">🎯 {t('teacher_gamification.daily_tasks.this_week', 'This Week')}</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-700">{t('teacher_gamification.daily_tasks.total_xp_earned', 'Total XP Earned')}</span>
            <span className="text-lg font-bold text-purple-700">
              {gamificationData.totalXP}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-700">{t('teacher_gamification.daily_tasks.tasks_completed', 'Tasks Completed')}</span>
            <span className="text-lg font-bold text-purple-700">
              {gamificationData.tasksCompleted}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-700">{t('teacher_gamification.daily_tasks.students_updated', 'Students Updated')}</span>
            <span className="text-lg font-bold text-purple-700">
              {gamificationData.studentsAdded}
            </span>
          </div>
        </div>
      </div>

      {/* Next Achievement*/}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
        <h3 className="font-semibold text-slate-900 mb-3">🎁 {t('teacher_gamification.daily_tasks.next_milestone', 'Next Milestone')}</h3>
        <div className="text-center py-4">
          <div className="text-4xl mb-2 opacity-60">🌟</div>
          <p className="font-semibold text-slate-900">{t('teacher_gamification.daily_tasks.day_streak_goal', '30 Day Streak')}</p>
          <p className="text-xs text-slate-600 mt-1">
            {t('teacher_gamification.daily_tasks.days_to_go', '{{count}} days to go', { count: Math.max(0, 30 - gamificationData.loginStreak) })}
          </p>
          <div className="h-1.5 bg-amber-200 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${(gamificationData.loginStreak / 30) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
