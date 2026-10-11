import React from 'react';

export const StatusBadge = ({ status }) => {
  const normStatus = (status || 'UNKNOWN').toUpperCase();
  const statusClass = `status-${normStatus.toLowerCase()}`;

  return (
    <span className={`status-badge ${statusClass}`}>
      <span className="status-dot" />
      {normStatus}
    </span>
  );
};

export default StatusBadge;
