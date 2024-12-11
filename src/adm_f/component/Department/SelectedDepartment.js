// SelectedDepartment.jsx
import React, { useState } from 'react';
import './selectedDepartment.css';

const SelectedDepartment = () => {

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
      <h2>비교과 프로그램 상세</h2>  
      <div className="controls-wrapper">
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
          <div className="search-box">
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedDepartment;