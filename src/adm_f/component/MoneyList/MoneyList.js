import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './moneylist.css';
// import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const MoneyList = ({ budgetUpdated }) => {
  
  const [departments, setDepartments] = useState([]);
  // const navigate = useNavigate();
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://100.94.142.127:3000/faculty');
        setDepartments(response.data.faculty);
      } catch (err) {
        console.error('데이터를 불러오는 데 실패했습니다:', err);
      }
    };

    fetchDepartments();
  }, [budgetUpdated]);  // budgetUpdated가 변경될 때마다 데이터를 다시 불러옵니다.


  // const goFacultyTranscation = async () => {
  //   try {
  //     navigate('/adm/facultytransaction');
  //   } catch (error) {
  //     console.error('로그아웃 중 오류 발생:', error);
  //   }
  // };

  return (
    <div className="adm_department-table-container">
      <h2 className="adm_table-title">학부별 남은 예산 금액</h2>
      <div className="adm_button-container1">
      <Link to="/adm/facultytransaction" className="adm_link-text">학부별 예산 거래 내역 보러 가기 ＞</Link>
      <Link to="/adm/graduateincentives" className='adm_link-text1'>우수졸업생 인센티브 내역 ＞</Link>
        {/* <button className="adm_logout-button" onClick={goFacultyTranscation}>
          학부별 예산 거래 내역 보러 가기
        </button> */}
      </div>
      <table className="adm_department-table">
        <thead>
        <tr>
            <th>학부</th>
            <th>학부별 예산 금액</th>
            <th>총 Mydex 포인트</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.faculty_id}>
              <td>{dept.faculty_name}</td>
              <td>{dept.faculty_budget_amount.toLocaleString()} 원</td>
              <td>{dept.faculty_mydex_points} 포인트</td>
              <td>{dept.budget_percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MoneyList;
