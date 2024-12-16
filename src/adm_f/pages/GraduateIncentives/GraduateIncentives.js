import React, { useState, useEffect } from 'react';
import './GraduateIncentives.css';
import axios from 'axios';

const GraduateIncentives = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [department, setDepartment] = useState('소프트웨어학과');
  const [year, setYear] = useState('2024년');
  const [searchId, setSearchId] = useState('');
  const [graduateData, setGraduateData] = useState([]);

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://100.94.142.127:3000/recommend/graduate');
        setGraduateData(response.data.graduate);
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };

    fetchData();
  }, []);

  // 페이지당 표시할 항목 수
  const itemsPerPage = 5;

  // 검색 필터링된 데이터
  const filteredData = graduateData.filter(item => 
    (!searchId || item.stu_id.toString().includes(searchId))
  );

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 현재 페이지에 표시할 데이터
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // 페이지네이션 버튼 생성
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisibleButtons) {
      const halfVisible = Math.floor(maxVisibleButtons / 2);
      if (currentPage <= halfVisible) {
        endPage = maxVisibleButtons;
      } else if (currentPage >= totalPages - halfVisible) {
        startPage = totalPages - maxVisibleButtons + 1;
      } else {
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }

    buttons.push(
      <button 
        key="prev"
        className="adm_page-btn"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`adm_page-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    buttons.push(
      <button 
        key="next"
        className="adm_page-btn"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    );

    return buttons;
  };

  const handleSearch = (e) => {
    setSearchId(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="adm_container">
      <h2>우수 졸업생 인센티브 내역</h2>
      <div className="adm_filters">
        {/* <select 
          value={department} 
          onChange={(e) => setDepartment(e.target.value)}
          className="adm_select-box"
        >
          <option>소프트웨어학과</option>
        </select>
        <select 
          value={year} 
          onChange={(e) => setYear(e.target.value)}
          className="adm_select-box"
        >
          <option>2024년</option>
        </select> */}
      </div>

      <table className="adm_incentive-table">
        <thead>
          <tr>
            <th>학번</th>
            {/* <th>학과</th> */}
            {/* <th>이름</th> */}
            <th>인센티브 지급 금액</th>
            <th>인센티브 지급 날짜</th>
          </tr>
        </thead>
        <tbody>
          {getCurrentPageData().map((item) => (
            <tr key={item.incentive_details_id}>
              <td>{item.stu_id}</td>
              {/* <td>{department}</td> */}
              {/* <td>-</td> */}
              <td>{item.bestgraduateincentivelistcolincentive_payment_amount.toLocaleString()}</td>
              <td>{formatDate(item.payment_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="adm_pagination">
        {renderPaginationButtons()}
      </div>

      <div className="adm_search-box">
        <label>학번 : </label>
        <input 
          type="text" 
          value={searchId}
          onChange={handleSearch}
        />
        <button className="adm_search-btn">🔍</button>
      </div>
    </div>
  );
};

export default GraduateIncentives;
