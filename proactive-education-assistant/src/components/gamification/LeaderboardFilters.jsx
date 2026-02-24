// LeaderboardFilters Component - Filter leaderboard by time period
export default function LeaderboardFilters({ activeFilter, onFilterChange }) {
  const filters = [
    { id: 'today', label: '📅 Today', value: 'today' },
    { id: 'week', label: '📊 This Week', value: 'week' },
    { id: 'month', label: '📈 This Month', value: 'month' },
    { id: 'all-time', label: '🏆 All Time', value: 'all-time' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeFilter === filter.value
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
