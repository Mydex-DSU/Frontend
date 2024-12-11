import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReProg from '../component/ReProg/ReProg';
import Program from '../component/Program/Program';
import MoneyBt from '../component/MoneyBt/MoneyBt';
import Mydex from '../component/Mydex/Mydex';
import MoneyList from '../component/MoneyList/MoneyList';
import ChartList from '../component/ChartList/ChartList';
import SelectedDepartment from '../component/Department/SelectedDepartment';

const MainPage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [budgetUpdated, setBudgetUpdated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adm_id = sessionStorage.getItem('admin');
    if (adm_id) {
      setLoggedInUser(adm_id);
    } else {
      setLoggedInUser(null);
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

  const handleBudgetCalculated = () => {
    setBudgetUpdated(prev => !prev);
  };

  return (
    <div>
      <div className="adm_login-container">
        {loggedInUser && (
          <div className="adm_user-info">
            <button className="adm_logout-button" onClick={handleLogout}>로그아웃</button>
          </div>
        )}
      </div>

      <ReProg/>
      <Program/>
      <MoneyBt onBudgetCalculated={handleBudgetCalculated} />
      <MoneyList budgetUpdated={budgetUpdated} />
      <Mydex/>
      <ChartList/>
      <SelectedDepartment/>
    </div>
  );
};

export default MainPage;
