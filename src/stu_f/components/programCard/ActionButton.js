import React from 'react';
import './ActionButton.css';

function ActionButton({ label }) {
  return <button className="action-button">{label}</button>;
}

export default ActionButton;