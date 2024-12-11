import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './moneylist.css';

const MoneyList = ({ budgetUpdated }) => {
  const [departments, setDepartments] = useState([]);

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

  return (
    <div className="department-table-container">
      <h2 className="table-title">학부별 남은 예산 금액</h2>
      <table className="department-table">
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
