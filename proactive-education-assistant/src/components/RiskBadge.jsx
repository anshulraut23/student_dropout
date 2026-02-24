function RiskBadge({ level }) {
  const getBadgeStyles = () => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          dot: 'bg-red-600',
          label: 'Critical Risk'
        };
      case 'high':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          dot: 'bg-orange-500',
          label: 'High Risk'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          dot: 'bg-yellow-500',
          label: 'Medium Risk'
        };
      case 'low':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          dot: 'bg-green-500',
          label: 'Low Risk'
        };
      case 'insufficient':
      case 'gathering':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          dot: 'bg-gray-400',
          icon: '⏳',
          label: 'Gathering Data'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          dot: 'bg-gray-500',
          label: 'Unknown'
        };
    }
  };

  const styles = getBadgeStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${styles.bg} ${styles.text}`}
    >
      {styles.icon ? (
        <span>{styles.icon}</span>
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
      )}
      {styles.label}
    </span>
  );
}

export default RiskBadge;
