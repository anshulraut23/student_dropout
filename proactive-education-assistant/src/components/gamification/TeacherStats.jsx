// TeacherStats Component - Display top stats cards
import { useGame } from '../../context/GamificationContext';

export default function TeacherStats() {
  const { gamificationData } = useGame();

  const stats = [
    {
      label: 'Total XP',
      value: gamificationData.totalXP,
      icon: '⭐',
      color: 'blue',
    },
    {
      label: 'Achievements',
      value: gamificationData.badges.length,
      icon: '🏆',
      color: 'green',
    },
    {
      label: 'Day Streak',
      value: gamificationData.loginStreak,
      icon: '🔥',
      color: 'orange',
    },
    {
      label: 'Students Helped',
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
