import React, { useState } from 'react';
import axios from 'axios';
import './mydexmodal.css';

const MydexModal = ({ isOpen, onClose }) => {
  const [year, setYear] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endSubmitDate, setEndSubmitDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 5}, (_, i) => currentYear + i);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      const startDateTime = `${startDate} ${startTime}:00`;
      const endDateTime = `${endSubmitDate} ${endTime}:00`;

      const response = await axios.post('http://100.94.142.127:3000/mydexscholarship/registration', {
        mydex_scholarship_application_period_year: parseInt(year),
        mydex_application_start_dateTime: startDateTime,
        mydex_application_end_dateTime: endDateTime
      });

      setMessage(response.data.message);
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('등록 실패:', error);
      setMessage('등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Mydex 온도 포인트 장학금 신청 기간 등록</h2>
        
        {message && <div className="message">{message}</div>}

        <div className="form-group">
          <label>시행 연도</label>
          <select 
            value={year} 
            onChange={(e) => setYear(e.target.value)}
            className="year-select"
          >
            <option value="">연도 선택</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>신청시작 날짜/일시</label>
          <div className="date-time-inputs">
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
            <input 
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="time-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>신청종료 날짜/일시</label>
          <div className="date-time-inputs">
            <input 
              type="date"
              value={endSubmitDate}
              onChange={(e) => setEndSubmitDate(e.target.value)}
              className="date-input"
            />
            <input 
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="time-input"
            />
          </div>
        </div>

        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>취소</button>
          <button className="submit-button" onClick={handleSubmit}>등록</button>
        </div>
      </div>
    </div>
  );
};

export default MydexModal;