function TrendPlaceholder({ title, data, type }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Calculate max value for scaling
  const maxValue = data ? Math.max(...data) : 100;
  const minValue = data ? Math.min(...data) : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      
      {/* Simple Bar Chart */}
      <div className="flex items-end justify-between h-64 gap-2">
        {data && data.map((value, index) => {
          const height = ((value - minValue) / (maxValue - minValue)) * 100;
          const isWeekend = index >= 5;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              {/* Bar */}
              <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                <div
                  className={`w-full rounded-t transition-all hover:opacity-80 ${
                    isWeekend ? 'bg-gray-300' : 'bg-blue-500'
                  }`}
                  style={{ height: `${height}%` }}
                  title={`${days[index]}: ${value}%`}
                />
              </div>
              
              {/* Value Label */}
              <div className="text-sm font-medium text-gray-700">
                {value}%
              </div>
              
              {/* Day Label */}
              <div className={`text-xs ${isWeekend ? 'text-gray-400' : 'text-gray-600'}`}>
                {days[index]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Weekday</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-sm text-gray-600">Weekend</span>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> This is a simplified visualization. For detailed analytics, 
          integrate with a charting library like Chart.js or Recharts.
        </p>
      </div>
    </div>
  );
}

export default TrendPlaceholder;
