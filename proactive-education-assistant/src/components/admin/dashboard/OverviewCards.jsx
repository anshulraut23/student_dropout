import { Users, BookOpen, AlertCircle, UserCheck, Activity } from 'lucide-react';

export const OverviewCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      icon: UserCheck,
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Total Classes',
      value: stats.totalClasses,
      icon: BookOpen,
      color: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      title: 'High Risk Students',
      value: stats.highRiskStudents,
      icon: AlertCircle,
      color: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
    },
    {
      title: 'Active Interventions',
      value: stats.activeInterventions,
      icon: Activity,
      color: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`${card.color} ${card.borderColor} border rounded-lg p-6 transition-all hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {card.title}
                </p>
                <p className={`${card.textColor} text-3xl font-bold mt-2`}>
                  {card.value}
                </p>
              </div>
              <IconComponent className={`${card.textColor} w-8 h-8 opacity-70`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
