import React, { useState, useContext } from "react";
import { UserDataContext } from "../../../context/userDataContext";
import "./LoanPopup.css";

const LoanApplicationPopup = ({ onClose }) => {
  const { userData, setUserData } = useContext(UserDataContext);

  // 초기 상태
  const [loanType, setLoanType] = useState("additional"); // 추가 대출 (default)
  const [loanAmount, setLoanAmount] = useState(1); // 대출 포인트 (default)

  // 조건 검증
  const canApply = userData?.stu_tpoint < 5; // Mydex 온도 포인트가 5 미만이어야 함
  const canSelectAdditional = userData?.stu_tadditional_loan_count > 0; // 추가 대출 가능 여부
  const canSelectEntire = userData?.stu_tloan === 0; // 전체 대출 가능 여부

  const handleLoanApplication = () => {
    const totalLoanAfterApplication = userData?.stu_tloan + loanAmount;

    if (totalLoanAfterApplication > 5) {
      alert("총 대출 포인트는 5점을 넘을 수 없습니다.");
      return;
    }

    if (loanType === "additional" && canSelectAdditional) {
      // 추가 대출 처리
      setUserData((prev) => ({
        ...prev,
        stu_tloan: prev.stu_tloan + loanAmount,
        stu_tadditional_loan_count: prev.stu_tadditional_loan_count - 1,
      }));
      alert(`${loanAmount} 포인트 추가 대출이 완료되었습니다.`);
    } else if (loanType === "entire" && canSelectEntire) {
      // 전체 대출 처리
      setUserData((prev) => ({
        ...prev,
        stu_tloan: loanAmount,
      }));
      alert("전체 대출이 완료되었습니다.");
    } else {
      alert("대출 신청 조건을 만족하지 않습니다.");
    }

    onClose(); // 팝업 닫기
  };

  return (
    <div className="loan-application-popup">
      <div className="popup-content">
        <h2>대출 신청</h2>
        {!canApply && (
          <p className="error-text">Mydex 온도 포인트가 5 미만일 때만 신청할 수 있습니다.</p>
        )}

        {canApply && (
          <>
            <p>대출 유형을 선택하세요:</p>
            <div>
              <label>
                <input
                  type="radio"
                  value="additional"
                  checked={loanType === "additional"}
                  onChange={() => setLoanType("additional")}
                  disabled={!canSelectAdditional}
                />
                추가 대출 (남은 추가 대출 횟수: {userData?.stu_tadditional_loan_count || 0})
              </label>
              <label>
                <input
                  type="radio"
                  value="entire"
                  checked={loanType === "entire"}
                  onChange={() => setLoanType("entire")}
                  disabled={!canSelectEntire}
                />
                전체 대출 (현재 대출 포인트: {userData?.stu_tloan})
              </label>
            </div>

            <p>대출 포인트를 선택하세요 (1~5):</p>
            <input
              type="number"
              min="1"
              max="5"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />

            <button
              onClick={handleLoanApplication}
              disabled={loanAmount < 1 || loanAmount > 5 || !canApply}
            >
              신청
            </button>
          </>
        )}
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default LoanApplicationPopup;
