import React, { useState } from 'react';
import axios from 'axios';
import './LoginPopup.css';

function LoginPopup({ onClose, onLoginSuccess }) {
  const [stuId, setStuId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async () => {
    try {
      const requestData = {
        stu_id: stuId,
      };

      console.log('로그인 요청 데이터:', requestData);

      const response = await axios.post('http://100.94.142.127:3000/login', requestData);
      console.log('로그인 응답 데이터:', response.data);

      // 반환된 데이터가 있을 경우 로그인 성공 처리
      if (response.data && response.data.stu_id) {
        sessionStorage.setItem('stu_id', response.data.stu_id); // sessionStorage에 stu_id 저장
        setSuccessMessage('로그인 성공! 메인 화면으로 이동합니다.');
        setError('');

        // 1초 후 로그인 성공 처리
        setTimeout(() => {
          onLoginSuccess(); // 부모 컴포넌트에 성공 알림
          onClose(); // 팝업 닫기
        }, 1000);
      } else {
        // 반환된 데이터가 없으면 실패 처리
        setError('아이디가 일치하지 않거나 존재하지 않는 아이디입니다.');
        setSuccessMessage('');
      }
    } catch (err) {
      // 에러 발생 시 상황에 맞는 에러 메시지 표시
      const errorMessage =
        err.response?.data?.message || '아이디가 일치하지 않거나 존재하지 않는 아이디입니다.';
      setError(errorMessage);
      setSuccessMessage('');
      console.error('로그인 요청 실패:', err.response || err.message);
    }
  };

  return (
    <div className="login-popup-backdrop">
      <div className="login-popup">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>로그인</h2>
        <input
          type="text"
          placeholder="학번"
          value={stuId}
          onChange={(e) => setStuId(e.target.value)}
        />
        <button onClick={handleLogin}>로그인</button>
        {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p className="success" style={{ color: 'green' }}>{successMessage}</p>}
      </div>
    </div>
  );
}

export default LoginPopup;
