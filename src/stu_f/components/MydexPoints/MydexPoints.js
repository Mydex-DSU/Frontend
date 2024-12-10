import React from 'react';
import './MydexPoints.css';

function MydexPoints({userData}) {
  return (
    <div className='point-container'>
        <div className="mydex-points">
        <div className="points-container">
            <div className="totall-point-box">
            <div className="totall-point-value">{userData.stu_total_mydex_points}</div>
            <div className="totall-point-text">총 Mydex 온도 포인트</div>
            </div>
            <div className="current-point-box">
            <div className="current-point-value">{userData.stu_current_mydex_points}</div>
            <div className="current-point-text">현재 Mydex 온도 포인트</div>
            </div>

            <div className="laon-point-box">
            <div className="laon-point-value">{userData.stu_current_loan_points}</div>
            <div className="laon-point-text">대출포인트</div>
            </div>

            <div className="warning">
            <div className="icon">⚠️</div>
            <div className="warning-value">{userData.stu_current_warning_count}</div>
            <div className="warning-text">경고</div>
            </div>
        </div>
        <div className="progress-bar">
            <div className="progress" style={{ width: '10%' }}></div>
        </div>
        <div className="pnote">
            Mydex 온도 포인트 한계선 신청까지 29일 남았습니다
        </div>
        </div>
    </div>
  );
}

export default MydexPoints;