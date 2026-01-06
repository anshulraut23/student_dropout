function StatCard({ title, value, icon: Icon, bgColor, textColor, borderColor }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 dark:border-gray-700 p-6 transition-transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${textColor || 'text-gray-900 dark:text-white'}`}>
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor || 'bg-gray-100 dark:bg-gray-700'}`}
          >
            <Icon className={`text-xl ${textColor || 'text-gray-600 dark:text-gray-300'}`} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;