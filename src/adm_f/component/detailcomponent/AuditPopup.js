// src/detailcomponent/DetailPopup.jsx
import React from 'react';
import './AuditPopup.css';

const AuditPopup = ({ onClose, application }) => {
  return (
    <div className="adm_popup-noshow">
      <div className="adm_popup-content-noshow">
        <div className="adm_popup-header">
          <h2>심사내용</h2>
        </div>
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
            <button onClick={onClose}>확인</button>
          </>
        )}
      </div>
    </div>
  );
};


export default AuditPopup;