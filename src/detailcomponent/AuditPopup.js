// src/detailcomponent/DetailPopup.jsx
import React from 'react';
import './AuditPopup.css';

const AuditPopup = ({ onClose, application }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>심사내용</h2>
        {application.processing_result === 1 ? (
          <>
            <h3>지급된 Mydex 온도 포인트</h3>
            <p>{application.granted_mydex_points}포인트</p>
            <button onClick={onClose}>확인</button>
          </>
        ) : (
          <>
            <h3>거절 사유</h3>
            <p>{application.rejection_reason}</p>
            <p>처리 결과: 거절</p>
            <p>온도포인트: {application.granted_mydex_points}</p>
            <p>처리 날짜: {new Date(application.processing_datetime).toLocaleString()}</p>
            <button onClick={onClose}>닫기</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuditPopup;