import React from 'react';
import './StatusBadge.css';

function StatusBadge({ status }) {
  return <div className="status-badge">{status}</div>;
}

export default StatusBadge;
