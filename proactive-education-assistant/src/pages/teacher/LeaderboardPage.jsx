// Leaderboard Page - Display teacher rankings and competition
import { useEffect, useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import LeaderboardTable from '../../components/gamification/LeaderboardTable';
import LeaderboardFilters from '../../components/gamification/LeaderboardFilters';
import leaderboardService from '../../services/leaderboardService';

export default function LeaderboardPage() {
  const { teacher } = useTeacher();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all-time');
  const [teacherRank, setTeacherRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await leaderboardService.fetchLeaderboard(filter);
      setLeaderboard(data);

      // Fetch teacher's rank
      const rankData = await leaderboardService.getTeacherRank(filter);
      setTeacherRank(rankData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Use mock data as fallback
      setLeaderboard(leaderboardService.getMockLeaderboard());
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const getTeacherPosition = () => {
    if (!teacher || !leaderboard.length) return null;
    const position = leaderboard.find((t) => t.teacherId === teacher._id || t.rank === teacherRank?.rank);
    return position;
  };

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);
  const teacherPosition = getTeacherPosition();

  return (
    <div className="px-4 py-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen" style={{ paddingTop: '5rem' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900">🏅 Leaderboard</h1>
          <p className="text-slate-600 mt-1">
            See how you stack up against other teachers in your school and beyond
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center md:justify-start">
          <LeaderboardFilters activeFilter={filter} onFilterChange={handleFilterChange} />
        </div>

        {/* Your Rank Card */}
        {teacherPosition && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
            <div className="grid md:grid-cols-4 gap-4 items-center">
              <div>
                <p className="text-sm font-medium text-blue-100">Your Current Rank</p>
                <p className="text-4xl font-bold mt-1">
                  {teacherPosition.rank === 1
                    ? '🥇'
                    : teacherPosition.rank === 2
                    ? '🥈'
                    : teacherPosition.rank === 3
                    ? '🥉'
                    : `#${teacherPosition.rank}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-100">Total XP</p>
                <p className="text-3xl font-bold">{teacherPosition.totalXP.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-100">Level</p>
                <p className="text-3xl font-bold">{teacherPosition.level}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-100">Badges</p>
                <p className="text-3xl font-bold">{teacherPosition.badgesCount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900 text-lg flex items-center gap-2">
              <span>🏆</span> Top Performers
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-400 shadow-md">
                  <div className="text-center">
                    <p className="text-4xl mb-2">🥈</p>
                    <p className="text-xs text-slate-600 mb-2">2nd Place</p>
                    <h3 className="font-bold text-slate-900">{topThree[1].name}</h3>
                    <p className="text-xs text-slate-600 mt-1">{topThree[1].schoolName}</p>
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Level:</span>
                        <span className="font-bold">{topThree[1].level}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>XP:</span>
                        <span className="font-bold text-blue-600">{topThree[1].totalXP.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl p-6 border-2 border-yellow-400 shadow-lg transform md:scale-105">
                  <div className="text-center">
                    <p className="text-5xl mb-2">🥇</p>
                    <p className="text-xs text-slate-600 mb-2 font-bold">1st Place</p>
                    <h3 className="font-bold text-slate-900 text-lg">{topThree[0].name}</h3>
                    <p className="text-xs text-slate-600 mt-1">{topThree[0].schoolName}</p>
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Level:</span>
                        <span className="font-bold">{topThree[0].level}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>XP:</span>
                        <span className="font-bold text-yellow-600">{topThree[0].totalXP.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-500 shadow-md">
                  <div className="text-center">
                    <p className="text-4xl mb-2">🥉</p>
                    <p className="text-xs text-slate-600 mb-2">3rd Place</p>
                    <h3 className="font-bold text-slate-900">{topThree[2].name}</h3>
                    <p className="text-xs text-slate-600 mt-1">{topThree[2].schoolName}</p>
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Level:</span>
                        <span className="font-bold">{topThree[2].level}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>XP:</span>
                        <span className="font-bold text-orange-600">{topThree[2].totalXP.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-900 text-lg flex items-center gap-2">
            <span>📊</span> Full Rankings
          </h2>

          {loading ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              </div>
              <p className="text-slate-600 mt-4">Loading leaderboard...</p>
            </div>
          ) : (
            <LeaderboardTable
              leaderboard={leaderboard}
              currentTeacherId={teacher?._id || teacher?.id}
            />
          )}
        </div>

        {/* Fun Facts */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span>📈</span> Leaderboard Stats
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-600">Total Teachers</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">{leaderboard.length}</p>
            </div>
            <div>
              <p className="text-slate-600">Average Level</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">
                {leaderboard.length > 0
                  ? (
                      leaderboard.reduce((sum, t) => sum + t.level, 0) / leaderboard.length
                    ).toFixed(1)
                  : '0'}
              </p>
            </div>
            <div>
              <p className="text-slate-600">Highest XP</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">
                {leaderboard.length > 0 ? leaderboard[0].totalXP.toLocaleString() : '0'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
