function StatCard({ title, value, icon: Icon, bgColor, textColor, borderColor }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border-2 p-6 transition-transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${textColor || 'text-gray-900'}`}>
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor || 'bg-gray-100'}`}
          >
            <Icon className={`text-xl ${textColor || 'text-gray-600'}`} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;