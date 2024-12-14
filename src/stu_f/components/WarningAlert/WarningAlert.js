import React from 'react';
import './WarningAlert.css';

function WarningAlert({ userData }) {
  return (
    <div className="warning-alert">
      <span className="warning-icon">⚠️</span>
      <span className="warning-message">{}</span>
    </div>
  );
}

export default WarningAlert;