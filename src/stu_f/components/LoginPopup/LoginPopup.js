import React, { useState } from "react";
import axios from "axios";
import "./LoginPopup.css";

function LoginPopup({ onClose, onLoginSuccess, initialUserType }) {
  const [userId, setUserId] = useState(""); // 사용자 입력 값
  const [userType, setUserType] = useState(initialUserType || "student"); // 초기 사용자 유형
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    try {
      // API URL 설정
      const apiUrl =
        userType === "student"
          ? "http://100.94.142.127:3000/login"
          : userType === "professor"
          ? "http://100.94.142.127:3000/login/professor"
          : "http://100.94.142.127:3000/login/admin";

      // 요청 데이터 설정
      const requestData = {
        [
          userType === "student"
            ? "stu_id"
            : userType === "professor"
            ? "pro_name"
            : "adm_name"
        ]: userId,
      };

      console.log("로그인 요청 데이터:", requestData);

      const response = await axios.post(apiUrl, requestData);
      console.log("로그인 응답 데이터:", response.data);

      // 로그인 성공 처리
      if (response.data) {
        const userIdKey =
          userType === "student"
            ? "stu_id"
            : userType === "professor"
            ? "pro_id"
            : "adm_id";

        const userIdValue = response.data[userIdKey];

        if (userIdValue) {
          sessionStorage.setItem(userIdKey, userIdValue);

          setSuccessMessage(
            `${userType === "student" ? "학생" : userType === "professor" ? "교수" : "관리자"} 로그인 성공!`
          );
          setError("");

          setTimeout(() => {
            onLoginSuccess(userType, userIdValue);
            onClose();
          }, 1000);
        } else {
          setError("로그인 응답에서 올바른 사용자 ID를 찾을 수 없습니다.");
          setSuccessMessage("");
        }
      } else {
        setError("아이디가 일치하지 않거나 존재하지 않는 아이디입니다.");
        setSuccessMessage("");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "로그인 요청에 실패했습니다. 다시 시도해주세요.";
      setError(errorMessage);
      setSuccessMessage("");
      console.error("로그인 요청 실패:", err.response || err.message);
    }
  };

  return (
    <div className="login-popup-backdrop">
      <div className="login-popup">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>
          {userType === "student"
            ? "학생 로그인"
            : userType === "professor"
            ? "교수 로그인"
            : "관리자 로그인"}
        </h2>
        <input
          type="text"
          placeholder={
            userType === "student"
              ? "학생 아이디 입력"
              : userType === "professor"
              ? "교수 이름 입력"
              : "관리자 아이디 입력"
          }
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={handleLogin}>로그인</button>
        {error && <p className="error" style={{ color: "red" }}>{error}</p>}
        {successMessage && <p className="success" style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </div>
  );
}

export default LoginPopup;
