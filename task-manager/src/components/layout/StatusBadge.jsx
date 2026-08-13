import { getStatusBadgeColors } from "@/utils/helper";


const StatusBadge = ({ status }) => {
  const colors = getStatusBadgeColors(status);

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colors.bg} ${colors.text}`}
    >
      {/* Replaces underscores/hyphens with spaces for a cleaner UI */}
      {status.replace(/[-_]/g, ' ')}
    </span>
  );
};

export default StatusBadge;