import React from "react";
import { useNavigate } from "react-router-dom";
import "./ReliefProgram.css";

function ReliefProgram({ userData }) {
  const navigate = useNavigate();

  if (userData.stu_current_mydex_points >= 5) {
    return null; // 5점 이상일 땐 컴포넌트가 보이지 않음
  }

  const handleNavigate = () => {
    navigate("/relief-programs"); // 구제 프로그램 페이지로 이동
  };

  return (
    <div className="relief-program">
      <div className="relief-header">구제프로그램?</div>
      <div className="relief-info">
        해당 자격을 확인할 수 있는 관련 서류를 제출하시면 신청이 가능합니다.
      </div>
      <button className="relief-button" onClick={handleNavigate}>
        구제프로그램 &gt;
      </button>
    </div>
  );
}

export default ReliefProgram;
