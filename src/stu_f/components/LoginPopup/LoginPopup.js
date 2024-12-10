import React, { useState } from "react";
import axios from "axios";
import "./LoginPopup.css";

function LoginPopup({ onClose, onLoginSuccess }) {
  const [userId, setUserId] = useState(""); // ID input (student ID or professor ID)
  const [userType, setUserType] = useState("student"); // Default to "student"
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    try {
      // Define API endpoint based on user type
      const apiUrl =
        userType === "student"
          ? "http://100.94.142.127:3000/login"
          : "http://100.94.142.127:3000/login/professor";
    
      // Dynamically set the request data key based on user type
      const requestData = {
        [userType === "student" ? "stu_id" : "pro_name"]: userId, // Use dynamic property name
      };
    
      console.log("로그인 요청 데이터:", requestData);
    
      const response = await axios.post(apiUrl, requestData);
      console.log("로그인 응답 데이터:", response.data);
    
      // Check if the login was successful
      if (response.data) {
        const userIdKey = userType === "student" ? "stu_id" : "pro_id"; // Determine the key dynamically
        console.log(userIdKey)
        const userIdValue = response.data[userIdKey]; // Extract the corresponding value from the response
        console.log(userIdValue)
        if (userIdValue) {
          // Save to session storage
          sessionStorage.setItem(userIdKey, userIdValue);
    
          setSuccessMessage(
            `${userType === "student" ? "학생" : "교수"} 로그인 성공!`
          );
          setError("");
    
          // Notify parent component of login success and close the popup
          setTimeout(() => {
            onLoginSuccess(userType, userIdValue); // Notify parent with user type and ID
            onClose(); // Close popup
          }, 1000);
        } else {
          // Handle unexpected response structure
          setError("로그인 응답에서 올바른 사용자 ID를 찾을 수 없습니다.");
          setSuccessMessage("");
        }
      } else {
        // Handle invalid login
        setError("아이디가 일치하지 않거나 존재하지 않는 아이디입니다.");
        setSuccessMessage("");
      }
    } catch (err) {
      // Handle errors
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
        <h2>로그인</h2>
        <div className="user-type-selector">
          <label>
            <input
              type="radio"
              name="userType"
              value="student"
              checked={userType === "student"}
              onChange={() => setUserType("student")}
            />
            학생
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="professor"
              checked={userType === "professor"}
              onChange={() => setUserType("professor")}
            />
            교수
          </label>
        </div>
        <input
          type="text"
          placeholder={userType === "student" ? "학번" : "교수 ID"}
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

// import React, { useState } from 'react';
// import axios from 'axios';
// import './LoginPopup.css';

// function LoginPopup({ onClose, onLoginSuccess }) {
//   const [stuId, setStuId] = useState('');
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleLogin = async () => {
//     try {
//       const requestData = {
//         stu_id: stuId,
//       };

//       console.log('로그인 요청 데이터:', requestData);

//       const response = await axios.post('http://100.94.142.127:3000/login', requestData);
//       console.log('로그인 응답 데이터:', response.data);

//       // 반환된 데이터가 있을 경우 로그인 성공 처리
//       if (response.data && response.data.stu_id) {
//         sessionStorage.setItem('stu_id', response.data.stu_id); // sessionStorage에 stu_id 저장
//         setSuccessMessage('로그인 성공! 메인 화면으로 이동합니다.');
//         setError('');

//         // 1초 후 로그인 성공 처리
//         setTimeout(() => {
//           onLoginSuccess(); // 부모 컴포넌트에 성공 알림
//           onClose(); // 팝업 닫기
//         }, 1000);
//       } else {
//         // 반환된 데이터가 없으면 실패 처리
//         setError('아이디가 일치하지 않거나 존재하지 않는 아이디입니다.');
//         setSuccessMessage('');
//       }
//     } catch (err) {
//       // 에러 발생 시 상황에 맞는 에러 메시지 표시
//       const errorMessage =
//         err.response?.data?.message || '아이디가 일치하지 않거나 존재하지 않는 아이디입니다.';
//       setError(errorMessage);
//       setSuccessMessage('');
//       console.error('로그인 요청 실패:', err.response || err.message);
//     }
//   };

//   return (
//     <div className="login-popup-backdrop">
//       <div className="login-popup">
//         <button className="close-btn" onClick={onClose}>
//           ×
//         </button>
//         <h2>로그인</h2>
//         <input
//           type="text"
//           placeholder="학번"
//           value={stuId}
//           onChange={(e) => setStuId(e.target.value)}
//         />
//         <button onClick={handleLogin}>로그인</button>
//         {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
//         {successMessage && <p className="success" style={{ color: 'green' }}>{successMessage}</p>}
//       </div>
//     </div>
//   );
// }

// export default LoginPopup;
