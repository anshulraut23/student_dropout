// TeacherStats Component - Display top stats cards
import { useGame } from '../../context/GamificationContext';
import { useTranslation } from 'react-i18next';

export default function TeacherStats() {
  const { t } = useTranslation();
  const { gamificationData } = useGame();

  const stats = [
    {
      label: t('teacher_gamification.stats.total_xp', 'Total XP'),
      value: gamificationData.totalXP,
      icon: '⭐',
      color: 'blue',
    },
    {
      label: t('teacher_gamification.stats.achievements', 'Achievements'),
      value: gamificationData.badges.length,
      icon: '🏆',
      color: 'green',
    },
    {
      label: t('teacher_gamification.stats.day_streak', 'Day Streak'),
      value: gamificationData.loginStreak,
      icon: '🔥',
      color: 'orange',
    },
    {
      label: t('teacher_gamification.stats.students_helped', 'Students Helped'),
      value: gamificationData.studentsHelped,
      icon: '👥',
      color: 'purple',
    },
  ];

  const colorLightMap = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    orange: 'bg-orange-100',
    purple: 'bg-purple-100',
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className={`${colorLightMap[stat.color]} p-3 rounded-lg`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
