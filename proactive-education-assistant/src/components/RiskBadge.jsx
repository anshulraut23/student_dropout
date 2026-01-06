function RiskBadge({ level }) {
  const getBadgeStyles = () => {
    switch (level?.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-300',
          label: 'High Risk'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          border: 'border-yellow-300',
          label: 'Medium Risk'
        };
      case 'low':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-300',
          label: 'Low Risk'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-300',
          label: 'Unknown'
        };
    }
  };

  const styles = getBadgeStyles();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
        ${styles.bg} ${styles.text} ${styles.border}`}
    >
      {styles.label}
    </span>
  );
}

export default RiskBadge;