import { Users, BookOpen, AlertCircle, UserCheck, Activity } from 'lucide-react';

export const OverviewCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      icon: UserCheck,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Total Classes',
      value: stats.totalClasses,
      icon: BookOpen,
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-100',
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-violet-50',
      iconColor: 'text-violet-600',
      borderColor: 'border-violet-100',
    },
    {
      title: 'High Risk',
      value: stats.highRiskStudents,
      icon: AlertCircle,
      color: 'bg-rose-50',
      iconColor: 'text-rose-600',
      borderColor: 'border-rose-100',
    },
    {
      title: 'Interventions',
      value: stats.activeInterventions,
      icon: Activity,
      color: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`bg-white border ${card.borderColor} rounded-lg p-4 hover:shadow-md transition-all`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                <IconComponent className={`${card.iconColor} w-5 h-5`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900 mb-1">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                {card.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
