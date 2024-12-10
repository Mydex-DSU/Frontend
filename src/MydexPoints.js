import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MydexPoints.css';

const MyDexPoints = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(''); // 선택된 년도를 저장
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업창 상태 관리
  const [pointsData, setPointsData] = useState([]); // 백엔드에서 받은 데이터를 저장
  const [newApplication, setNewApplication] = useState({
    studentId: '',
    name: '',
    points: '',
  }); // 팝업에서 입력한 데이터를 저장

  const pointsPerPage = 5;

useEffect(() => {
  const fetchPointsData = async () => {
    try {
      const response = await axios.get('http://100.94.142.127:3000/mydexscholarshipapplication');
      console.log('API 응답 데이터:', response.data);

      if (response.status === 200) {
        const data = response.data.mydexpointsscholarshipapplicationlist;
        if (Array.isArray(data)) {
          setPointsData(data); // 필요한 배열만 저장
        } else {
          console.error('mydexpointsscholarshipapplicationlist가 배열이 아닙니다:', data);
          alert('서버에서 올바른 데이터를 받지 못했습니다.');
          setPointsData([]); // 데이터 초기화
        }
      } else {
        console.error('API 응답 상태 코드:', response.status);
        alert('데이터를 불러오는 데 실패했습니다. 서버 상태를 확인하세요.');
      }
    } catch (error) {
      console.error('데이터 가져오기 중 오류 발생:', error);
      alert('서버와 연결할 수 없습니다. 네트워크 상태를 확인하세요.');
    }
  };

  fetchPointsData();
}, []);

  
  
  const filteredPoints = Array.isArray(pointsData)
    ? selectedYear
      ? pointsData.filter((point) => point.date.startsWith(selectedYear))
      : pointsData
    : [];

  const indexOfLastPoint = currentPage * pointsPerPage;
  const indexOfFirstPoint = indexOfLastPoint - pointsPerPage;
  const currentPoints = filteredPoints.slice(indexOfFirstPoint, indexOfLastPoint);

  const totalPages = Math.ceil(filteredPoints.length / pointsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value); // 선택된 년도 업데이트
    setCurrentPage(1); // 페이지를 첫 페이지로 초기화
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true); // 팝업 열기
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // 팝업 닫기
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewApplication((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddApplication = async () => {
    if (!newApplication.studentId || !newApplication.points) {
      alert('학번과 포인트를 입력해주세요.');
      return;
    }
  
    try {
      const payload = {
        stu_id: newApplication.studentId,
        mydex_scholarship_application_period_id: 2, // Example period ID (static or dynamic based on your use case)
        requested_scholarship_points: parseInt(newApplication.points, 10),
      };
  
      const response = await axios.post(
        'http://100.94.142.127:3000/mydexscholarshipapplication',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        alert(response.data.message || '장학금 신청이 성공적으로 완료되었습니다.');
        setNewApplication({ studentId: '', name: '', points: '' }); // Clear the form
        setIsPopupOpen(false); // Close the popup
      } else {
        alert('장학금 신청에 실패했습니다.');
      }
    } catch (error) {
      console.error('장학금 신청 중 오류 발생:', error);
      alert('장학금 신청 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };
  

  return (
    <div className="mydex-container">
      <h1 className="main-title">Mydex 온도 포인트 장학금</h1>

      {/* 장학금 정보 섹션 */}
      <section className="scholarship-section">
        <div className="scholarship-content">
          <p>신청기간 2024-12-23 ~ 2024-12-29</p>
          <p><strong>환산 가능한 포인트의 범위?</strong></p>
          <p>
            Mydex 온도 포인트 중 기본 지급된 10점은 제외하고, 그 외의 포인트만 환산 신청이 가능합니다.
            교환 범위는 학기당 최대 50포인트까지 교환 가능합니다.
          </p>
          <p><strong>환산 신청 기준?</strong></p>
          <p className="highlight">
            현재 Mydex 온도 포인트가 30점 이상일 경우에만 환산 신청이 가능합니다.
          </p>
        </div>
      </section>

      {/* 신청하기 버튼 */}
      <div className="apply-button-container">
        <button className="apply-button" onClick={handleOpenPopup}>신청하기</button>
      </div>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">
              <h1 className="popup-title">Mydex 온도 포인트 장학금 신청</h1>
            </div>
            <table className="popup-table">
              <tbody>
                <tr>
                  <th className="table-header">학번</th>
                  <td><input type="text" name="studentId" value={newApplication.studentId} onChange={handleInputChange} /></td>
                </tr>
                <tr>
                  <th className="table-header">이름</th>
                  <td><input type="text" name="name" value={newApplication.name} onChange={handleInputChange} /></td>
                </tr>
                <tr>
                  <td className="table-header">신청 포인트</td>
                  <td>
                    <input type="text" name="points" value={newApplication.points} onChange={handleInputChange} />
                    <span>점</span>
                    <div className="popup-note">(*10점을 제외한 최대 50점까지 신청 가능합니다.)</div>
                  </td>
                </tr>
                <tr>
                  <td className="table-header">신청 기간</td>
                  <td className="center-text">2024-12-23 ~ 2024-12-29</td>
                </tr>
              </tbody>
            </table>
            <div className="popup-buttons">
              <button className="cancel-button" onClick={handleClosePopup}>취소</button>
              <button className="confirm-button" onClick={handleAddApplication}>신청하기</button>
            </div>
          </div>
        </div>
      )}

      <h2 className="title">Mydex 온도 포인트 신청 내역</h2>

      <div className="search-bar">
        <select className="dropdown" onChange={handleYearChange} value={selectedYear}>
          <option value="">년도</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2021">2021</option>
        </select>
      </div>

      <table className="points-table">
        <thead>
          <tr>
            <th>신청일시</th>
            <th>신청 포인트 금액</th>
          </tr>
        </thead>
        <tbody>
          {currentPoints.length > 0 ? (
            currentPoints.map((point) => (
              <tr key={point.id}>
                <td>{point.date}</td>
                <td>{point.points}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">해당 년도에 데이터가 없습니다.</td>
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

export default MyDexPoints;
