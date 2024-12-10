import React from 'react';
import './WarningAlert.css';

function WarningAlert({ message }) {
  return (
    <div className="warning-alert">
      <span className="warning-icon">⚠️</span>
      <span className="warning-message">{message}</span>
    </div>
  );
}

export default WarningAlert;