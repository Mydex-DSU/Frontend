import React, { useEffect, useState } from "react";
import "./LoanApplicationPage.css";
import LoanPopup from "../../components/LoanPopup/LoanPopup";
import axios from "axios";
import MydexPoints from "../../components/MydexPoints/MydexPoints";

function LoanApplicationPage() {
  const [userData, setUserData] = useState(null);
  const [loanHistory, setLoanHistory] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const stuId = sessionStorage.getItem("stu_id");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "http://100.94.142.127:3000/profile",
          { stu_id: stuId }
        );
        setUserData(response.data.student_profile);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchLoanHistory = async () => {
      try {
        const response = await axios.post(
          "http://100.94.142.127:3000/loan",
          { stu_id: stuId }
        );
        setLoanHistory(response.data.loan_all || []);
      } catch (error) {
        console.error("Error fetching loan history:", error);
      }
    };

    fetchUserData();
    fetchLoanHistory();
  }, [stuId]);

  const formatDateTime = (dateTime) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
    return new Date(dateTime).toLocaleString("ko-KR", options);
  };

  return (
    <div className="loan-application-page">
      {/* Mydex 포인트 표시 */}
      <div className="profile-section">
        {userData && <MydexPoints userData={userData} />}
      </div>

      <section className="loan-info-section">
        <h2>대출 관련 내용</h2>
        <div className="loan-info-cards">
          <div className="loanpage-card">현재 Mydex 온도 포인트 5점 미만만 신청 가능</div>
          <div className="loanpage-card">경고 횟수 3회 이상이면 대출 신청 불가능</div>
          <div className="loanpage-card">경고 횟수 초기화는 교수님의 입력</div>
        </div>
      </section>

      <section className="loan-descriptions">
        <div className="loan-section">
          <h3 className="all-loan-title">전체 대출 포인트 신청</h3>
          <div className="loan-description">
            <div className="loan-description-title">전체 대출 포인트 간단 설명</div>
            <p>대출 포인트를 처음 신청하거나 대출 포인트를 상환을 다 하였을 때 신청하는 경우입니다.</p>
            <div className="loan-description-title">전체 대출 포인트를 빌릴 수 있는 경우</div>
            <p>현재 대출 포인트가 0이면 신청 가능합니다. </p>
            <p>대출 포인트를 빌린 후 상환을 완벽하게 했을 경우는 다시 전체 대출 포인트를 신청할 수 있습니다.</p>
            <p>1~5점 포인트 중 하나를 선택하여 신청할 수 있습니다.</p>
          </div>
        </div>
        <div className="loan-section">
          <h3 className="part-loan-title">추가 대출 포인트 신청</h3>
          <div className="loan-description">
            <div className="loan-description-title-2">추가 대출 포인트 간단 설명</div>
            <p>대출 포인트가 1점 이상일 경우 대출을 다시 신청하는 경우입니다.</p>
            <div className="loan-description-title-2">추가 대출 포인트를 빌릴 수 있는 경우</div>
            <p>현재 대출 포인트가 1이상일 때 신청 가능합니다.</p>
            <p>추가 대출 포인트는 현재 대출 포인트 + 신청할 대출 포인트가
            5 초과가 되지 못하며 3번까지 신청이 가능합니다.</p>
            <p>대출 포인트를 다 상납하였을 시에 또 신청이 가능합니다.</p>
          </div>
        </div>
      </section>

      <section className="loan-application">
        <h2>Mydex 온도 포인트 대출 신청</h2>
        <button
          className="loan-apply-button"
          onClick={() => setIsPopupOpen(true)}
          disabled={!userData || userData.stu_current_mydex_points >= 5}
        >
          대출 포인트 신청하러 가기
        </button>
        {userData && userData.stu_current_mydex_points >= 5 && (
          <p className="loan-info-text">Mydex 온도 포인트가 5 미만일 때만 대출을 신청할 수 있습니다.</p>
        )}
      </section>

      {isPopupOpen && (
        <LoanPopup
          onClose={() => setIsPopupOpen(false)}
          userData={userData}
          refreshPage={() => window.location.reload()}
        />
      )}

      {/* 대출 거래 내역 */}
      <section className="loan-history-section">
        <h2>대출 포인트 거래 내역</h2>
        <table className="loan-history-table">
          <thead>
            <tr>
              <th>대출 날짜</th>
              <th>대출 구분</th>
              <th>대출 거래 금액</th>
              <th>대출 거래 잔액</th>
            </tr>
          </thead>
          <tbody>
            {loanHistory.length > 0 ? (
              loanHistory.map((history) => (
                <tr key={history.loan_id}>
                  <td>{formatDateTime(history.loan_transaction_date)}</td>
                  <td>{history.loan_type}</td>
                  <td>{history.loan_transaction_points}포인트</td>
                  <td>{history.loan_remaining_points}포인트</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">대출 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default LoanApplicationPage;
