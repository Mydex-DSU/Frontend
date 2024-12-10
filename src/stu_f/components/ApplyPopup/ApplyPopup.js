import React, { useState } from "react";
import axios from "axios";
import "./ApplyPopup.css";

const ApplyPopup = ({ programId, isEligible, eligibilityMessage, onCancel }) => {
  const stuId = sessionStorage.getItem("stu_id");

  const handleConfirm = async () => {
    if (!stuId) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
      onCancel();
      return;
    }

    try {
      await axios.post("http://100.94.142.127:3000/application", {
        stu_id: stuId,
        program_id: programId,
      });
      alert("프로그램 신청이 완료되었습니다.");
      onCancel();
    } catch (error) {
      console.error("프로그램 신청에 실패했습니다:", error.response?.data || error.message);
      alert("프로그램 신청에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="apply-popup">
      <div className="popup-content">
        <div className="popup-header">
          <span className="popup-header-icon">🔔</span>
        </div>
        <div className="popup-message">
          <p>{eligibilityMessage || "로그인 상태가 아닙니다"}</p>
        </div>
        <div className="popup-buttons">
          <button
            className={`confirm-button ${!isEligible ? "disabled" : ""}`}
            onClick={handleConfirm}
            disabled={!isEligible} // isEligible에 따라 버튼 활성화/비활성화
          >
            신청
          </button>
          <button className="cancel-button" onClick={onCancel}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyPopup;
