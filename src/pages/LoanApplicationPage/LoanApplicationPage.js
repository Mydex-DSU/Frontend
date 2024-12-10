import React, { useContext, useEffect, useState } from "react";
import "./LoanApplicationPage.css";
import MydexPoints from "../../../components/MydexPoints/MydexPoints";
import { UserDataContext } from "../../../context/userDataContext";
import axios from "axios";
import LoanPopup from "../../../components/LoanPopup/LoanPopup";

function LoanApplicationPage() {
  const { userData } = useContext(UserDataContext);
  const [loanHistory, setLoanHistory] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const stuId = sessionStorage.getItem("stu_id");

  // 대출 내역 불러오기
  const fetchLoanHistory = async () => {
    try {
      const response = await axios.post("http://100.94.142.127:3000/loan", {
        stu_id: stuId,
      });
      setLoanHistory(response.data.loan_all || []);
    } catch (error) {
      console.error("Error fetching loan history:", error);
    }
  };

  useEffect(() => {
    fetchLoanHistory();
  }, []);

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

      {/* 대출 관련 안내 */}
      <div className="loan-info">
        <h2>대출 관련 내용</h2>
        <ul>
          <li>현재 Mydex 온도 포인트 5점 미만만 신청 가능</li>
          <li>경고 횟수 2회 이상이면 대출 신청 불가능</li>
          <li>경고 횟수 초기화는 교수님의 입력</li>
        </ul>
      </div>

      {/* 대출 신청 버튼 */}
      <div className="loan-apply">
        <h2>Mydex 온도 포인트 대출 신청</h2>
        <button className="apply-button" onClick={() => setIsPopupOpen(true)}>
          대출 포인트 신청하러 가기
        </button>
      </div>

      {isPopupOpen && <LoanPopup onClose={() => setIsPopupOpen(false)} />}

      {/* 대출 거래 내역 */}
      <div className="loan-history">
        <h2>대출 포인트 거래 내역</h2>
        <table className="loan-history-table">
          <thead>
            <tr>
              <th>대출 날짜</th>
              <th>대출 구분</th>
              <th>대출 거래 금액</th>
              <th className="loan-balance">대출 거래 잔액</th>
            </tr>
          </thead>
          <tbody>
            {loanHistory.length > 0 ? (
              loanHistory.map((history) => (
                <tr key={history.loan_id}>
                  <td>{formatDateTime(history.loan_transaction_date)}</td>
                  <td>{history.loan_type}</td>
                  <td>{history.loan_transaction_points}포인트</td>
                  <td className="loan-balance">{history.loan_remaining_points}포인트</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">대출 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LoanApplicationPage;
