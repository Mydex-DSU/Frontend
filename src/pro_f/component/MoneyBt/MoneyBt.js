import React, { useState, useEffect} from 'react';
import axios from 'axios';
import './moneybt.css';

const MoneyBt = () => {
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://100.94.142.127:3000/schoolbudget', {
        school_total_budget_amount: parseInt(budget),
        start_date: startDate,
        end_date: endDate
      });
      
      setMessage(response.data.message);
      console.log('서버 응답:', response.data);
    } catch (error) {
      setMessage('오류가 발생했습니다.');
      console.error('API 요청 중 오류 발생:', error);
    }
  };

  return (
    <div className="budget-form-container">
      <h1 className="form-title">학부별 예산 선정</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="budget">총 예산 금액</label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="총 예산 금액 입력"
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">개강일</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">종강일</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="button-container">
          <button type="submit" className="submit-button">산정하기</button>
        </div>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default MoneyBt;