import React, { useState } from 'react';
import './LoanPointHistory.css';

const LoanPointHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 카테고리 저장
  const pointsData = [
    { id: 1, date: '2024-12-21(월) 11:41', type: '노쇼로 인한 초기화', amount: '3포인트', balance: '0포인트' },
    { id: 2, date: '2024-10-30(금) 09:23', type: '상환', amount: '2포인트', balance: '3포인트' },
    { id: 3, date: '2024-10-21(월) 11:41', type: '추가 대출', amount: '2포인트', balance: '5포인트' },
    { id: 4, date: '2024-09-20(금) 09:23', type: '전체 대출', amount: '3포인트', balance: '3포인트' },
  ];

  const pointsPerPage = 5;
  const filteredPoints = selectedCategory
    ? pointsData.filter((point) => point.type === selectedCategory || selectedCategory === '전체보기')
    : pointsData;

  const indexOfLastPoint = currentPage * pointsPerPage;
  const indexOfFirstPoint = indexOfLastPoint - pointsPerPage;
  const currentPoints = filteredPoints.slice(indexOfFirstPoint, indexOfLastPoint);

  const totalPages = Math.ceil(filteredPoints.length / pointsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // 선택된 카테고리 업데이트
    setCurrentPage(1); // 페이지를 첫 페이지로 초기화
  };

  return (
    <div className="loan-point-history-container">
      {/* 전체 대출 포인트 신청 섹션 */}
      <div className="section">
        <h3 className="section-title">전체 대출 포인트 신청</h3>
        <p className="section-description">
          대출 포인트를 처음 신청하거나 대출 포인트를 상환을 다 하였을 때 신청하는 경우입니다.
        </p>
        <p className="section-criteria">
          <strong>전체 대출 포인트를 빌릴 수 있는 경우</strong><br />
          현재 대출 포인트가 0이면 신청 가능합니다. 대출 포인트를 빌린 후 상환을 완료하게 되면, 다시 전체 대출 포인트를 신청할 수 있습니다.<br />
          1~5점 중 하나를 선택하여 신청할 수 있습니다.
        </p>
        <button className="apply-button">대출 포인트 신청하기</button>
      </div>

      {/* 추가 대출 포인트 신청 섹션 */}
      <div className="section">
        <h3 className="section-title">추가 대출 포인트 신청</h3>
        <p className="section-description">
          대출 포인트가 1점 이상인 경우 대출을 다시 신청하는 경우입니다.
        </p>
        <p className="section-criteria">
          <strong>추가 대출 포인트를 빌릴 수 있는 경우</strong><br />
          현재 대출 포인트가 10 이상일 때 신청 가능합니다. 추가 대출 포인트는 현재 대출 포인트 + 신청한 대출 포인트가 5초과가 되지 않으며 3까지는 신청이 가능합니다.<br />
          대출 포인트를 다 상환했을 시에 또 신청이 가능합니다.
        </p>
        <button className="apply-button">대출 포인트 신청하기</button>
      </div>

      <h1 className="title">대출 포인트 거래 내역</h1>

      <div className="search-bar">
        <select className="dropdown" onChange={handleCategoryChange} value={selectedCategory}>
          <option value="전체보기">전체 보기</option>
          <option value="노쇼로 인한 초기화">노쇼로 인한 초기화</option>
          <option value="상환">상환</option>
          <option value="추가 대출">추가 대출</option>
          <option value="전체 대출">전체 대출</option>
        </select>
      </div>

      <table className="loan-history-table">
        <thead>
          <tr>
            <th>대출 날짜</th>
            <th>대출 구분</th>
            <th>대출 거래 금액</th>
            <th>대출 거래 잔액</th>
          </tr>
        </thead>
        <tbody>
          {currentPoints.length > 0 ? (
            currentPoints.map((point) => (
              <tr key={point.id}>
                <td>{point.date}</td>
                <td>{point.type}</td>
                <td>{point.amount}</td>
                <td>{point.balance}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">해당 데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

const Pagination = ({ totalPages, currentPage, handlePageChange }) => (
  <div className="pagination">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => handlePageChange(index + 1)}
        className={currentPage === index + 1 ? 'active' : ''}
      >
        {index + 1}
      </button>
    ))}
  </div>
);

export default LoanPointHistory;
