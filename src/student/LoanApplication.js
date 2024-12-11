// LoanApplication.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoanApplication.css';

const LoanApplication = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedPoints, setSelectedPoints] = useState('4');
  const [loanType, setLoanType] = useState('추가 대출');
  const [loanHistory, setLoanHistory] = useState([]);
  const [currentLoanPoints, setCurrentLoanPoints] = useState(0);
  const [additionalLoanCount, setAdditionalLoanCount] = useState(0);
  const [remainingLoanCount, setRemainingLoanCount] = useState(3);

  useEffect(() => {
    fetchLoanHistory();
  }, []);

  const fetchLoanHistory = async () => {
    try {
      const response = await axios.post('http://100.94.142.127:3000/loan', {
        stu_id: 20201813
      });
      
      if (response.data && response.data.loan_all) {
        setLoanHistory(response.data.loan_all);
        
        // 현재 대출 포인트 계산
        const currentPoints = response.data.loan_all.length > 0 
          ? response.data.loan_all[response.data.loan_all.length - 1].loan_remaining_points 
          : 0;
        setCurrentLoanPoints(currentPoints);

        // 추가 대출 횟수 계산
        const additionalLoans = response.data.loan_all.filter(loan => loan.loan_type === "추가 대출").length;
        setAdditionalLoanCount(additionalLoans);
        setRemainingLoanCount(3 - additionalLoans);
      }
    } catch (error) {
      console.error('대출 내역을 불러오는데 실패했습니다:', error);
    }
  };

  const handleLoanApplication = async () => {
    try {
      // 추가 대출 제한 조건 체크
      if (loanType === '추가 대출') {
        // 추가 대출 횟수 체크
        if (additionalLoanCount >= 3) {
          alert('추가대출 횟수가 0이라 추가대출이 진행되지 않습니다.');
          setShowModal(false);
          return;
        }

        // 총 대출 포인트 제한 체크
        const totalPoints = currentLoanPoints + parseInt(selectedPoints);
        if (totalPoints > 6) {
          alert('전체 대출과 추가 대출의 합이 5포인트를 초과할 수 없습니다.');
          return;
        }
      }

      const response = await axios.post('http://100.94.142.127:3000/loan/application', {
        stu_id: 20201813,
        loan_type_status: loanType === '전체 대출' ? 1 : 0,
        loan_transaction_points: parseInt(selectedPoints)
      });

      if (response.data.loan) {
        if (response.data.loan.includes('추가대출 횟수가 0')) {
          alert('추가대출 횟수가 0이라 추가대출이 진행되지 않습니다.');
          setShowModal(false);
        } else {
          setModalType('success');
          await fetchLoanHistory();
        }
      }
    } catch (error) {
      console.error('대출 신청 실패:', error);
    }
  };

  // 대출 포인트 선택 옵션 생성
  const getPointOptions = () => {
    if (loanType === '전체 대출') {
      return [1,2,3,4,5];
    } else {
      // 추가 대출의 경우 남은 가능한 포인트 계산
      const maxAdditionalPoints = 5 - currentLoanPoints;
      return Array.from({length: Math.min(4, maxAdditionalPoints)}, (_, i) => i + 1);
    }
  };

  return (
    <div className="loan-container">
      <h1>Mydex 온도 포인트 대출 신청</h1>
      
      <div className="loan-info-banner">
        <div className="info-box">현재 Mydex 온도 포인트 5점 미만만 신청 가능</div>
        <div className="info-box">경고 횟수 20회상이면 대출 신청 불가능</div>
        <div className="info-box">경고 횟수 초기화는 교수님과의 면담</div>
      </div>

      <div className="content-wrapper">
        <div className="loan-sections">
          <div className="loan-section">
            <h2>전체 대출 포인트 신청</h2>
            <div className="loan-content">
              <h3>전체 대출 포인트 간단 설명</h3>
              <p>대출 포인트를 처음 신청하거나 대출 포인트를 상환을 다 하였을 때 신청하는 경우입니다.</p>
              <h3>전체 대출 포인트를 받을 수 있는 경우</h3>
              <p>현재 대출 포인트가 0이면 신청 가능합니다.</p>
              <p>1~5점 포인트 중 하나를 선택하여 신청할 수 있습니다.</p>
            </div>
          </div>

          <div className="loan-section">
            <h2>추가 대출 포인트 신청</h2>
            <div className="loan-content">
              <h3>추가 대출 포인트 간단 설명</h3>
              <p>대출 포인트가 1점 이상인 경우 대출을 다시 신청하는 경우입니다.</p>
              <h3>추가 대출 포인트를 받을 수 있는 경우</h3>
              <p>현재 대출 포인트가 10점일 때 신청 가능합니다.</p>
              <p>추가 대출 포인트는 현재 대출 포인트 + 신청할 대출 포인트가 5 초과가 되지 못하며 3점까지 신청이 가능합니다.</p>
            </div>
          </div>
        </div>

        <p>대출 포인트 신청하러 가기</p>
        <button className="apply-button" onClick={() => setShowModal(true)}>신청</button>

        <div className="point-history-container">
          <div className="header">
            <h2>대출 포인트 거래 내역</h2>
            <select className="filter">
              <option>전체 보기</option>
            </select>
          </div>
          <table className="point-history-table">
            <thead>
              <tr>
                <th>대출날짜</th>
                <th>대출구분</th>
                <th>대출 거래 금액</th>
                <th>대출 거래 잔액</th>
              </tr>
            </thead>
            <tbody>
              {loanHistory.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.loan_transaction_date).toLocaleString('ko-KR')}</td>
                  <td>{item.loan_type}</td>
                  <td>{item.loan_transaction_points}포인트</td>
                  <td>{item.loan_remaining_points}포인트</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          {modalType === 'success' ? (
            <div className="modal-content">
              <h2>{loanType === '전체 대출' ? '전체' : '추가'} 대출 포인트 신청이 완료되었습니다.</h2>
              <button 
                className="confirm-button"
                onClick={() => {
                  setShowModal(false);
                  setModalType('');
                }}
              >
                확인
              </button>
            </div>
          ) : (
            <div className="modal-content">
              {loanType === '추가 대출' && (
                <div className="loan-status-info">
                  <p>현재 누적 {additionalLoanCount}번 추가 대출하셨습니다.</p>
                  <p>남은 추가 대출 포인트 신청은 {remainingLoanCount}번입니다.</p>
                  <p>현재 대출 포인트: {currentLoanPoints}포인트</p>
                </div>
              )}
              <h2>{loanType === '전체 대출' ? '전체' : '추가'} 대출 포인트 신청을 완료해주세요.</h2>
              <div className="select-group">
                <select 
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="loan-select"
                >
                  <option value="전체 대출">전체 대출</option>
                  <option value="추가 대출">추가 대출</option>
                </select>
                <select 
                  value={selectedPoints}
                  onChange={(e) => setSelectedPoints(e.target.value)}
                  className="points-select"
                >
                  {getPointOptions().map(point => (
                    <option key={point} value={point}>{point}</option>
                  ))}
                </select>
              </div>
              <div className="button-group">
                <button className="cancel-button" onClick={() => setShowModal(false)}>
                  취소
                </button>
                <button className="apply-button" onClick={handleLoanApplication}>
                  신청
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoanApplication;