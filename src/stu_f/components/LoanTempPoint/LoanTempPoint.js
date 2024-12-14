import React from 'react';
import './LoanTempPoint.css';
import { useNavigate } from 'react-router-dom';

function LoanTemperaturePoint({ userData, onLoanClick }) {
  const navigate = useNavigate();

  const handleReliefProgramClick = () => {
    navigate("/stu/loanapplicationpage"); // 대출 페이지로 이동
  };

  if (userData.stu_current_mydex_points >= 5) {
    return null; // 5점 이상일 경우 컴포넌트 표시 안 함
  }

  const isWarningExceeded = userData.stu_current_warning_count >= 3; // 경고 3회 이상 여부 확인

  return (
    <div className="loan-temperature-point">
      {isWarningExceeded && (
        <div className="loan-warning-overlay">
          <img src="/Lock.png" alt="Lock Icon" className="lock-icon" />
          <div className="loan-warning-message">현재 경고 3회로 해당 컨텐츠 이용이 불가합니다!</div>
          <div className="loan-instruction">구제프로그램을 이용해주세요.</div>
         
        </div>
      )}
      <div className="loan-header">현재 대출 가능한 온도 포인트</div>
      <div className="loan-score">{userData.loan_possible_point}</div>
      <div className="loan-info">추가 대출 가능 횟수 {userData.stu_additonal_loan_count}회</div>
      <button className="loan-button" onClick={handleReliefProgramClick}>온도 대출하기 &gt;</button>
    </div>
  );
}

export default LoanTemperaturePoint;
