import React, { useState, useEffect } from 'react';
import ReProg from '../pro_f/component/ReProg/ReProg';
import Program from '../pro_f/component/Program/Program';
import MoneyBt from '../pro_f/component/MoneyBt/MoneyBt';
import Mydex from '../pro_f/component/Mydex/Mydex';
import MoneyList from '../pro_f/component/MoneyList/MoneyList';
import ChartList from '../pro_f/component/ChartList/ChartList';
import Login from '../pro_f/component/Login/Login';
import './mainpage.css';

const MainPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // 컴포넌트 마운트 시 세션 스토리지에서 로그인 정보 확인
  useEffect(() => {
    const userInfo = sessionStorage.getItem('user');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setLoggedInUser(user.adm_name);
    }
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = (userId) => {
    setLoggedInUser(userId);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setLoggedInUser(null);
  };

  return (
    <div>
      <div className="login-container">
        {loggedInUser ? (
          <div className="user-info">
            <span className="welcome-message">{loggedInUser}님, 환영합니다!</span>
            <button className="logout-button" onClick={handleLogout}>로그아웃</button>
          </div>
        ) : (
          <button className="login-button" onClick={handleOpenModal}>로그인</button>
        )}
      </div>
      {isModalOpen && (
        <Login
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onLogin={handleLogin}
        />
      )}
      <ReProg/>
      <Program/>
      <MoneyBt/>
      <Mydex/>
      <MoneyList/>
      <ChartList/>
    </div>
  );
};

export default MainPage;