import React from "react";
import "./WarningAlert.css";

function WarningAlert({ userData }) {
  if (!userData || userData.stu_current_warning_count === 0) {
    return null; // 경고가 없을 경우 컴포넌트가 렌더링되지 않음
  }

  const getWarningMessage = () => {
    const warningCount = userData.stu_current_warning_count;

    if (warningCount === 3) {
      return "경고 3회로 인해 장학금, 대출 포인트, 비교과 프로그램 전부 신청하지 못합니다.지도 교수와의 면담을 통해 경고 횟수 초기화가 가능합니다.(학기당 1회)";
    }
    if (warningCount === 2) {
      return "경고 2회로 인해 대출 포인트 신청을 하지 못합니다. 지도 교수와의 면담을 통해 경고 횟수 초기화가 가능합니다.(학기당 1회)";
    }
    if (warningCount === 1) {
      return "경고 1회입니다. 경고 횟수가 늘어날 수록 불이익이 발생할 수 있습니다.";
    }
    return ""; // 기본값
  };

  return (
    <div className="warning-alert">
      <span className="icon">🔔</span>
      <p>{getWarningMessage()}</p>
    </div>
  );
}

export default WarningAlert;
