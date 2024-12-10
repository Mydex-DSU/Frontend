import React, { useState } from 'react';
import './EvaluationPopup.css';

const EvaluationPopup = ({ onClose, onSubmit, currentApp }) => {
  const [points, setPoints] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleSubmit = (isApproved) => {
    if (isApproved && !points) {
      alert('온도포인트를 입력해주세요.');
      return;
    }
    if (!isApproved && !rejectionReason) {
      alert('거절 사유를 입력해주세요.');
      return;
    }
    onSubmit(isApproved, points, rejectionReason);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Mydex 온도포인트 평가</h2>
        <div>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="온도포인트 입력"
          />
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="거절 사유 입력"
          />
          <div className="button-group">
            <button onClick={() => handleSubmit(true)}>승인</button>
            <button onClick={() => handleSubmit(false)}>거절</button>
            <button onClick={onClose}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationPopup;