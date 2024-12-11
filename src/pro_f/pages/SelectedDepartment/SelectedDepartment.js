// SelectedDepartment.jsx
import React, { useState } from 'react';
import './selectedDepartment.css';

const SelectedDepartment = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('소프트웨어융합대학');
  const [year, setYear] = useState('2024');
  const [semester, setSemester] = useState('');
  const [programCode, setProgramCode] = useState('');
  const [programName, setProgramName] = useState('');
  const [selectedOption, setSelectedOption] = useState('비교과 프로그램 개설');
  const [showOptions, setShowOptions] = useState();

  const budgetData = [
    {
      department: '소프트웨어학과',
      code: '193567',
      name: 'MD - 컴퓨터알고리즘을 위한 아동사례 특강',
      amount: -100000,
      points: 20,
      date: '2024-12-16',
      semester:"1학기"
    },
    {
      department: '소프트웨어학과',
      code: '185673',
      name: 'SW개발역량강소기업 취업 플러스 포럼 특강',
      amount: 200000,
      points: 40,
      date: '2024-11-04',
      semester:"2학기"
    },
    {
      department: '소프트웨어학과',
      code: '185673',
      name: 'SW개발역량강소기업 취업 플러스 포럼 특강',
      amount: -1000000,
      points: 160,
      date: '2024-06-20',
      semester:"1학기"
    },
    {
      department: '소프트웨어학과',
      code: '125223',
      name: '융합전공과정 프로그램 - 비지니스 캔버스 워크숍',
      amount: -500000,
      points: 100,
      date: '2024-02-11',
      semester:"1학기"
    },
    {
      department: '소프트웨어학과',
      code: '133238',
      name: '문제해결능력향상을 위한 취업 스토리 워크숍',
      amount: -400000,
      points: 80,
      date: '2024-01-16',
      semester:"1학기"
    }
  ];


  return (
    <div className="budget-container">
      <h2>학부별 예산 처리 거래 내역</h2>
      
      <div className="controls-wrapper">
        <div className="select-wrapper">
          <select 
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="department-select"
          >
            <option value="소프트웨어융합대학">소프트웨어융합대학</option>
          </select>
          
          <div>
            <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}
                className='department-select'>
              <option>비교과 프로그램</option>
              <option>Mydex 온도 포인트 장학금</option>
            </select>
          </div>
        </div>

        <div className="budget-info">
          <div className="budget-amounts">
            <span>총 남은 금액: {(6750000).toLocaleString()}</span>
            <span>비교과 프로그램 사용 금액: {(-1800000).toLocaleString()}</span>
          </div>
          <div className="period-select">
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option>2024년</option>
            </select>
            <select value={semester} onChange={(e) => setSemester(e.target.value)}>
              <option>1학기</option>
              <option>2학기</option>
            </select>
          </div>
        </div>
        <div className="table-container">
             <table>
                <thead>
                    <tr>
                    <th>학과</th>
                    <th>비교과 프로그램 번호</th>
                    <th>비교과 프로그램 이름</th>
                    <th>거래 금액</th>
                    <th>Mydex온도 포인트</th>
                    <th>예산 결재 날짜</th>
                    </tr>
                </thead>
                <tbody>
                    {budgetData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.department}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td className={item.amount < 0 ? 'negative' : 'positive'}>
                        {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}
                        </td>
                        <td>{item.points}</td>
                        <td>{item.date}</td>
                    </tr>
                    ))}
                </tbody>
                </table>

        </div>

        <div className="search-wrapper">
          <p className="point-notice">Mydex 온도 포인트는 1점 당 5000원 입니다.</p>
          <div className="search-box">
            <div className="input-group">
              <label>프로그램번호:</label>
              <input
                type="text"
                value={programCode}
                onChange={(e) => setProgramCode(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>프로그램이름:</label>
              <input
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
              />
            </div>
            <button className="search-btn">검색</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedDepartment;