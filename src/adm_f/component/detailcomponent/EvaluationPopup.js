import React, { useState, useEffect } from 'react';
import './EvaluationPopup.css';

const EvaluationPopup = ({ onClose, onSubmit, currentApp }) => {
  const [points, setPoints] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApproveDisabled, setIsApproveDisabled] = useState(false);
  const [isRejectDisabled, setIsRejectDisabled] = useState(false);

  useEffect(() => {
    setIsApproveDisabled(rejectionReason.trim() !== '');
    setIsRejectDisabled(points.trim() !== '');
  }, [points, rejectionReason]);

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
    <div className="adm_popup">
      <div className="adm_popup-content">
        <div className="adm_popup-header">
          <h2>Mydex 온도포인트 평가</h2>
        </div>

        <div className="adm_input-group">
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="온도포인트 입력"
          />
        </div>
        <div className="adm_input-group">
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="거절 사유 입력"
          />
        </div>
        <div className="adm_button-group">
          <button 
            onClick={() => handleSubmit(true)} 
            disabled={isApproveDisabled}
          >
            승인
          </button>
          <button 
            onClick={() => handleSubmit(false)} 
            disabled={isRejectDisabled}
          >
            거절
          </button>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationPopup;
