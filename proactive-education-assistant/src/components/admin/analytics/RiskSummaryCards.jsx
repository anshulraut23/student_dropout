function RiskSummaryCards({ riskDistribution }) {
  const cards = [
    {
      level: 'high',
      count: riskDistribution?.high || 0,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      borderColor: 'border-red-500'
    },
    {
      level: 'medium',
      count: riskDistribution?.medium || 0,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-500'
    },
    {
      level: 'low',
      count: riskDistribution?.low || 0,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      borderColor: 'border-green-500'
    }
  ];

  const total = cards.reduce((sum, card) => sum + card.count, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => {
        const percentage = total > 0 ? Math.round((card.count / total) * 100) : 0;
        
        return (
          <div
            key={card.level}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${card.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase">
                  {card.level} Risk
                </p>
                <p className={`text-4xl font-bold mt-2 ${card.textColor}`}>
                  {card.count}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {percentage}% of total students
                </p>
              </div>
              <div className={`${card.bgColor} p-4 rounded-full`}>
                <div className={`w-12 h-12 flex items-center justify-center text-2xl font-bold ${card.textColor}`}>
                  {percentage}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-${card.color}-600`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RiskSummaryCards;
