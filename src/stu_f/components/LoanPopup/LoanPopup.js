import React, { useState } from "react";
import axios from "axios";
import "./LoanPopup.css";

function LoanPopup({ onClose, userData, refreshPage }) {
  const [loanType, setLoanType] = useState("additional"); // Default to "additional loan"
  const [loanAmount, setLoanAmount] = useState(1); // Default loan amount
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLoanSubmit = async () => {
    const currentLoanPoints = userData.stu_current_loan_points;
    const maxLoanPoints = 5;
    const additionalLoanCount = userData.stu_additonal_loan_count;
    const loanPossiblePoints = userData.loan_possible_point;

    // Check loan conditions
    if (userData.stu_current_warning_count >= 3) {
      setErrorMessage("경고 횟수가 3회 이상일 경우 대출 신청이 불가능합니다.");
      return;
    }

    if (loanType === "additional") {
      if (currentLoanPoints === 0) {
        setErrorMessage("추가 대출은 현재 대출 포인트가 1 이상일 때만 가능합니다.");
        return;
      }

      if (additionalLoanCount <= 0) {
        setErrorMessage("추가 대출 횟수가 부족합니다.");
        return;
      }

      if (currentLoanPoints + loanAmount > maxLoanPoints) {
        setErrorMessage("대출 가능 포인트를 초과했습니다.");
        return;
      }
    } else if (loanType === "full") {
      if (currentLoanPoints > 0) {
        setErrorMessage("전체 대출은 현재 대출 포인트가 0일 때만 가능합니다.");
        return;
      }

      if (loanAmount !== loanPossiblePoints) {
        setErrorMessage(`전체 대출은 ${loanPossiblePoints}포인트로만 가능합니다.`);
        return;
      }
    }

    // Prepare API payload
    const payload = {
      stu_id: userData.stu_id,
      loan_type_status: loanType === "additional" ? 0 : 1, // 0: 추가 대출, 1: 전체 대출
      loan_transaction_points: loanAmount,
    };

    try {
      const response = await axios.post(
        "http://100.94.142.127:3000/loan/application",
        payload
      );

      if (response.status === 200) {
        setSuccessMessage("대출 신청이 성공적으로 처리되었습니다.");
        setErrorMessage("");

        // Call refreshPage to reload data
        refreshPage();

        // Close popup after a short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMessage("대출 신청 처리 중 문제가 발생했습니다.");
      }
    } catch (error) {
      setErrorMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("대출 신청 실패:", error);
    }
  };

  return (
    <div className="loan-popup-backdrop">
      <div className="loan-popup">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>대출 신청</h2>
        {userData.stu_current_mydex_points >= 5 ? (
          <p className="info-text">
            Mydex 온도 포인트가 5미만일 때만 대출을 신청할 수 있습니다.
          </p>
        ) : userData.stu_current_warning_count >= 3 ? (
          <p className="info-text">
            경고 횟수가 3회 이상일 경우 대출을 신청할 수 없습니다.
          </p>
        ) : (
          <>
            <div className="loan-options">
              <label>
                <input
                  type="radio"
                  name="loanType"
                  value="additional"
                  checked={loanType === "additional"}
                  onChange={() => setLoanType("additional")}
                  disabled={
                    userData.stu_current_loan_points === 0 ||
                    userData.stu_additonal_loan_count <= 0
                  }
                />
                추가 대출 (남은 횟수: {userData.stu_additonal_loan_count})
              </label>
              <label>
                <input
                  type="radio"
                  name="loanType"
                  value="full"
                  checked={loanType === "full"}
                  onChange={() => setLoanType("full")}
                  disabled={userData.stu_current_loan_points > 0}
                />
                전체 대출 (대출 가능 포인트: {userData.loan_possible_point})
              </label>
            </div>
            <div className="loan-amount">
              <label>대출 포인트 (1 ~ {loanType === "full" ? userData.loan_possible_point : 5}): </label>
              <input
                type="number"
                min="1"
                max={loanType === "full" ? userData.loan_possible_point : 5}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                disabled={loanType === "full"}
              />
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <button
              className="submit-btn"
              onClick={handleLoanSubmit}
              disabled={
                loanAmount < 1 ||
                loanAmount > (loanType === "full" ? userData.loan_possible_point : 5) ||
                (loanType === "additional" &&
                  (userData.stu_current_loan_points === 0 ||
                    userData.stu_additonal_loan_count <= 0)) ||
                (loanType === "full" &&
                  userData.stu_current_loan_points > 0)
              }
            >
              신청
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default LoanPopup;
