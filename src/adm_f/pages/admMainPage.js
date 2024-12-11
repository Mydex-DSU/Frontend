import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReProg from '../component/ReProg/ReProg';
import Program from '../component/Program/Program';
import MoneyBt from '../component/MoneyBt/MoneyBt';
import Mydex from '../component/Mydex/Mydex';
import MoneyList from '../component/MoneyList/MoneyList';
import ChartList from '../component/ChartList/ChartList';

const MainPage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = sessionStorage.getItem('admin');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setLoggedInUser(user.adm_id);
    } else {
      // 로그인 정보가 없을 때는 메인 페이지로 리다이렉트하지 않고
      // 로그인 상태만 null로 설정
      setLoggedInUser(userInfo);
    }
  }, []);

  const handleLogout = async () => {
    try {
      
      sessionStorage.removeItem('admin');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <div>
      <div className="login-container">
        {loggedInUser && (
          <div className="user-info">
            <button className="logout-button" onClick={handleLogout}>로그아웃</button>
          </div>
        )}
      </div>
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