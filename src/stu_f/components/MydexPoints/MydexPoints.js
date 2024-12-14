import React from 'react';
import './MydexPoints.css';

function MydexPoints({ userData }) {
  const progressWidth = Math.min((userData.stu_current_mydex_points / 30) * 100, 100);
  return (
    <div className="mydex-points-container">
      <div className="points-row">
        {/* 총 Mydex 온도 포인트 */}
        <div>
          <div className="points-box total-mydex">
            <img src="/total-Mydex.png" alt="총 Mydex 온도 포인트" />
            <div className="value">{userData.stu_total_mydex_points}</div>
          </div>
          <div className="points-label">총 Mydex 온도 포인트</div>
        </div>

        {/* 현재 Mydex 온도 포인트 */}
        <div>
          <div className="points-box current-mydex">
            <img src="/current-MydexPoint.png" alt="현재 Mydex 온도 포인트" />
            <div className="value">{userData.stu_current_mydex_points}</div>
          </div>
          <div className="points-label">현재 Mydex 온도 포인트</div>
        </div>

        {/* 대출 포인트 */}
        <div>
          <div className="points-box loan-mydex">
            <img src="/loan-point.png" alt="대출포인트" />
            <div className="value">{userData.stu_current_loan_points}</div>
          </div>
          <div className="points-label">대출포인트</div>
        </div>

        {/* 경고 */}
        <div>
          <div className="points-box warning">
            <img src="/warning.png" alt="경고" />
            <div className="value">경고 {userData.stu_current_warning_count}</div>
          </div>
          <div className="points-label">.</div>
        </div>
      </div>

      {/* 프로그래스 바 */}
      <div className="progress-bar-section">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progressWidth}%`,
            }}
          ></div>
        </div>
        <div className="progress-labels">
          <span>0</span>
          <span>30</span>
        </div>
        <div className="remaining-info">
          {userData.stu_current_mydex_points >= 30
            ? "장학금을 신청할 수 있습니다!"
            : `Mydex 온도 포인트 장학금 신청까지 ${30 - userData.stu_current_mydex_points}점 남았습니다.`}
        </div>
      </div>
    </div>
  );
}

export default MydexPoints;
