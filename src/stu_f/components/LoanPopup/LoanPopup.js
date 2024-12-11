import React, { useState, useContext } from "react";
import { UserDataContext } from "../../../context/userDataContext";
import "./LoanPopup.css";

function LoanPopup({ onClose }) {
  const { userData, setUserData } = useContext(UserDataContext);
  const [loanType, setLoanType] = useState("additional"); // Default to "additional loan"
  const [loanAmount, setLoanAmount] = useState(1); // Default loan amount
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoanSubmit = () => {
    const currentLoanPoints = userData.stu_current_loan_points;
    const maxLoanPoints = 5;
    const additionalLoanCount = userData.stu_additonal_loan_count;

    // Check loan conditions
    if (loanType === "additional") {
      if (additionalLoanCount <= 0) {
        setErrorMessage("추가 대출 횟수가 부족합니다.");
        return;
      }

      if (currentLoanPoints + loanAmount > maxLoanPoints) {
        setErrorMessage("대출 가능 포인트를 초과했습니다.");
        return;
      }

      // Update user data
      setUserData((prev) => ({
        ...prev,
        stu_current_loan_points: prev.stu_current_loan_points + loanAmount,
        stu_additonal_loan_count: prev.stu_additonal_loan_count - 1,
      }));
    } else if (loanType === "full") {
      if (userData.stu_current_loan_points > 0) {
        setErrorMessage("현재 대출 포인트가 0일 때만 전체 대출이 가능합니다.");
        return;
      }

      // Update user data for full loan
      setUserData((prev) => ({
        ...prev,
        stu_current_loan_points: maxLoanPoints,
      }));
    }

    setErrorMessage(""); // Clear error message
    onClose(); // Close popup
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
                  disabled={userData.stu_additonal_loan_count <= 0}
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
                전체 대출 (현재 대출 포인트: {userData.stu_current_loan_points})
              </label>
            </div>
            <div className="loan-amount">
              <label>대출 포인트 (1 ~ 5): </label>
              <input
                type="number"
                min="1"
                max="5"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                disabled={loanType === "full"}
              />
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <button
              className="submit-btn"
              onClick={handleLoanSubmit}
              disabled={
                loanAmount < 1 ||
                loanAmount > 5 ||
                (loanType === "additional" &&
                  userData.stu_additonal_loan_count <= 0) ||
                (loanType === "full" && userData.stu_current_loan_points > 0)
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
