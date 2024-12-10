import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './moneylist.css';

const MoneyList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://100.94.142.127:3000/faculty');
        setDepartments(response.data.faculty);
        setLoading(false);
      } catch (err) {
        console.error('데이터를 불러오는 데 실패했습니다:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

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