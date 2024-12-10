import React from "react";

function LoanPopup({ onClose }) {
  return (
    <div className="loan-popup">
      <div className="popup-content">
        <h3>대출 포인트 신청</h3>
        <p>대출 포인트를 신청하려면 다음 절차를 진행하세요.</p>
        <button className="close-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default LoanPopup;
