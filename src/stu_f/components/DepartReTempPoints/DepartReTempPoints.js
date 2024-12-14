import React from 'react';
import './DepartReTempPoints.css'; // 스타일링 파일

function DepartReTempPoint({ departReTemp, WarningPoint }) {
  const isWarningExceeded = WarningPoint >= 3; // 경고 3회 이상 여부 확인

  return (
    <div className="depart-re-temp-point">
      {isWarningExceeded && (
        <div className="depart-warning-overlay">
            <img src="/Lock.png" alt="Lock Icon" className="lock-icon" />
          <div className="depart-warning-message">
            현재 경고 3회로 해당 컨텐츠 이용이 불가합니다! <br />
            교수와의 면담을 통해 해제하세요.
          </div>
          
        </div>
      )}
      <div className="department-title-box">
        <h2 className="department-title">{departReTemp.department_name}</h2>
      </div>
      <div className="point-container">
        <div className="remain-point-box">
          <h2>{departReTemp.faculty_mydex_points}</h2>
        </div>
        <div className="go-to-scholarship-application">
          <a href="#scholarship">장학금 신청하러가기</a>
        </div>
      </div>
    </div>
  );
}

export default DepartReTempPoint;
