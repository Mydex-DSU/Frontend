import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate 사용
import './Loginpage.css';

function LoginPage() {
  const [professorName, setProfessorName] = useState(''); // 교수 이름 입력 필드
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // useNavigate로 페이지 이동 처리

  sessionStorage.setItem('pro_name',professorName);
  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // 이전 오류 메시지 초기화

    try {
      // API 요청: 교수 이름과 비밀번호를 백엔드로 전송
      const response = await axios.post('http://100.94.142.127:3000/login/professor', {
        pro_name: professorName, // 교수 이름
        password,
      });

      if (response.status === 200) {
        // 로그인 성공 시 응답 데이터 처리
        console.log('로그인 성공:', response.data);

        // 프로 ID와 토큰을 로컬 스토리지에 저장
        const { pro_id, token } = response.data;
        localStorage.setItem('pro_id', pro_id);
        localStorage.setItem('token', token);

        alert('로그인 성공!');

        // StudentManagement 페이지로 이동
        navigate('/student-management'); // 페이지 이동
      }
    } catch (error) {
      console.error('로그인 실패:', error);

      // 서버 응답에 따른 에러 메시지 표시
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('로그인 중 문제가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">로그인</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="professorName">교수 이름</label>
          <input
            type="text"
            id="professorName"
            value={professorName}
            onChange={(e) => setProfessorName(e.target.value)}
            placeholder="교수 이름 입력"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            required
          />
        </div>
        <button type="submit" className="login-button">로그인</button>
      </form>
    </div>
  );
}

export default LoginPage;
