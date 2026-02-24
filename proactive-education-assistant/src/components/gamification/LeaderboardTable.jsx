// LeaderboardTable Component - Display leaderboard rankings
import leaderboardService from '../../services/leaderboardService';

export default function LeaderboardTable({ leaderboard, currentTeacherId }) {
  const getRankMedal = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${rank}.`;
    }
  };

  const getLevelBadge = (level) => {
    const badges = ['🌟', '🤝', '🏆', '🎓', '👑'];
    return badges[level - 1] || '🌟';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Rank</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Teacher</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">School</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-900">Level</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">XP</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-900">Badges</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((teacher, index) => {
              const isCurrentTeacher = teacher.teacherId === currentTeacherId;

              return (
                <tr
                  key={teacher.teacherId}
                  className={`border-b border-slate-100 transition-colors ${
                    isCurrentTeacher
                      ? 'bg-blue-50 hover:bg-blue-100'
                      : 'hover:bg-slate-50'
                  } ${teacher.rank <= 3 ? 'font-medium' : ''}`}
                >
                  {/* Rank */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg w-6">{getRankMedal(teacher.rank)}</span>
                    </div>
                  </td>

                  {/* Teacher Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{teacher.name}</p>
                        {isCurrentTeacher && (
                          <p className="text-xs text-blue-600 font-medium">You</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* School */}
                  <td className="px-4 py-3">
                    <p className="text-slate-600 text-xs">{teacher.schoolName}</p>
                  </td>

                  {/* Level */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-lg">{getLevelBadge(teacher.level)}</span>
                      <span className="font-semibold">L{teacher.level}</span>
                    </div>
                  </td>

                  {/* XP */}
                  <td className="px-4 py-3 text-right">
                    <span className="font-bold text-slate-900">{teacher.totalXP.toLocaleString()}</span>
                  </td>

                  {/* Badges */}
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-sm font-bold text-yellow-700">
                      {teacher.badgesCount}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500">No leaderboard data available</p>
        </div>
      )}
    </div>
  );
}
