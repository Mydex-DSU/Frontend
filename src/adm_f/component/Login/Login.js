// Login.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({ isOpen, onClose, onLogin }) => {
  const [managerId, setManagerId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://100.94.142.127:3000/login/admin', {
        adm_name: managerId
      });

      if (response.status === 200) {
        sessionStorage.setItem('user', JSON.stringify(response.data));
        setSuccessMessage('로그인 성공!');
        setErrorMessage('');
        onLogin(managerId);
        setTimeout(() => {
          onClose();
          navigate('/adm/admmainpage');
        }, 500);
      }
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(error.response?.status === 401 ? '잘못된 아이디입니다.' : `서버 에러가 발생했습니다: ${error.message}`);
      console.error('Login error:', error);
    }
  };



  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>관리자 로그인</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>관리자 이름:</label>
            <input
              type="text"
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit">로그인</button>
            <button type="button" onClick={onClose}>취소</button>
          </div>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default Login;