import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MydexPointApplicationPage.css';
import MydexPoints from "../../components/MydexPoints/MydexPoints";

const MyDexPoints = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업창 상태 관리
  const [pointsData, setPointsData] = useState([]); // 백엔드에서 받은 데이터를 저장
  const [applicationPeriod, setApplicationPeriod] = useState({ start: '', end: '' , mydex_scholarship_application_period_id : null }); // 신청 기간 저장
  const [newApplication, setNewApplication] = useState({ points: '' }); // 팝업에서 입력한 데이터를 저장
  const [userData, setUserData] = useState([]);

  const pointsPerPage = 5;
  const userId = sessionStorage.getItem("stu_id");

  useEffect(() => {
    const fetchPointsData = async () => {
      try {
        const response = await axios.post('http://100.94.142.127:3000/mydexscholarshipapplication', {
          stu_id: userId,
        });

        console.log('API 응답 데이터:', response.data);

        if (response.status === 200) {
          setPointsData(response.data.mydex_point_scholarship_application_list);
        } else {
          console.error('올바르지 않은 데이터 형식:', response.data);
          alert('서버에서 올바른 데이터를 받지 못했습니다.');
        }
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
        alert('서버와 연결할 수 없습니다. 네트워크 상태를 확인하세요.');
      }
    };

    const fetchApplicationPeriod = async () => {
      try {
        const response = await axios.get('http://100.94.142.127:3000/mydexscholarship');

        console.log('신청 기간 API 응답 데이터:', response.data);

        if (
          response.status === 200 &&
          Array.isArray(response.data.mydexscholarship) &&
          response.data.mydexscholarship.length > 0
        ) {
          const sortedPeriods = response.data.mydexscholarship.sort(
            (a, b) =>
              new Date(b.mydex_application_start_dateTime) -
              new Date(a.mydex_application_start_dateTime)
          );

          const latestPeriod = sortedPeriods[0];
          setApplicationPeriod({
            mydex_scholarship_application_period_id : latestPeriod.mydex_scholarship_application_period_id,
            start: latestPeriod.mydex_application_start_dateTime,
            end: latestPeriod.mydex_application_end_dateTime,
          });
        } else {
          console.error('신청 기간 데이터 오류:', response.data);
          alert('신청 기간 정보를 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('신청 기간 정보 오류:', error);
        alert('신청 기간 정보를 가져오는 데 문제가 발생했습니다.');
      }
    };

    const fetchUserData= async() => {
      try{
        const response = await axios.post('http://100.94.142.127:3000/profile',
        {
          stu_id:userId,
        });

        setUserData(response.data.student_profile);

      }catch{
        console.error('프로필 api 오류');
      }
    };
    fetchUserData();
    fetchPointsData();
    fetchApplicationPeriod();
  }, []);

  const indexOfLastPoint = currentPage * pointsPerPage;
  const indexOfFirstPoint = indexOfLastPoint - pointsPerPage;
  const currentPoints = pointsData.slice(indexOfFirstPoint, indexOfLastPoint);

  const totalPages = Math.ceil(pointsData.length / pointsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
    const requestedPoints = parseInt(newApplication.points, 10);

    if (isNaN(requestedPoints) || requestedPoints <= 0) {
      alert('유효한 포인트를 입력해주세요.');
      return;
    }

    if (requestedPoints > 50) {
      alert('최대 신청 가능 장학금 포인트는 50점 입니다.');
      return;
    }

    if (userData.stu_current_mydex_points - requestedPoints < 10) {
      alert('기본 지급된 10점은 장학금 신청이 불가능 합니다. 10점을 제외한 나머지 포인트만 신청 가능하니 참고해 주시길 바랍니다.');
      return;
    }

    try {
      const response = await axios.post(
        'http://100.94.142.127:3000/mydexscholarshipapplication/application',
        {
          stu_id : userId,
          mydex_scholarship_application_period_id: applicationPeriod.mydex_scholarship_application_period_id, // Example period ID
          requested_scholarship_points: requestedPoints,
        }
      );

      if (response.status === 200) {
        alert(response.data.message || '장학금 신청이 성공적으로 완료되었습니다.');
        setNewApplication({ points: '' }); // Clear the form
        setIsPopupOpen(false); // Close the popup
        window.location.reload(); // Refresh the page
      } else {
        alert('장학금 신청에 실패했습니다.');
      }
    } catch (error) {
      console.error('장학금 신청 오류:', error);
      alert('장학금 신청 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="pro4mydex-container">
      <div>
      {userData ? (
          <MydexPoints userData={userData} />
        ) : (
          <p>사용자 데이터를 로드할 수 없습니다.</p>
        )}
      </div>
      <h1 className="pro4main-title">Mydex 온도 포인트 장학금</h1>

      <section className="pro4scholarship-section">
        <div className="pro4scholarship-content">
          <p>
            신청기간: {new Date(applicationPeriod.start).toLocaleString('ko-KR') || 'N/A'} ~{' '}
            {new Date(applicationPeriod.end).toLocaleString('ko-KR') || 'N/A'}
          </p>
          <p><strong>환산 가능한 포인트의 범위?</strong></p>
          <p>
            Mydex 온도 포인트 중 기본 지급된 10점은 제외하고, 그 외의 포인트만 환산 신청이 가능합니다.
            교환 범위는 학기당 최대 50포인트까지 교환 가능합니다.
          </p>
          <p><strong>환산 신청 기준?</strong></p>
          <p className="pro4highlight">
            현재 Mydex 온도 포인트가 30점 이상일 경우에만 환산 신청이 가능합니다.
          </p>
        </div>
      </section>

      <div className="pro4apply-button-container">
        <button className="pro4apply-button" onClick={handleOpenPopup}>신청하기</button>
      </div>

      {isPopupOpen && (
        <div className="pro4popup-overlay">
          <div className="pro4popup">
            <div className="pro4popup-header">
              <h1 className="pro4popup-title">Mydex 온도 포인트 장학금 신청</h1>
            </div>
            <table className="pro4popup-table">
              <tbody>
                <tr>
                  <td className="pro4table-header">신청 포인트</td>
                  <td>
                    <input
                      type="text"
                      name="points"
                      value={newApplication.points}
                      onChange={handleInputChange}
                    />
                    <span>점</span>
                    <div className="pro4popup-note">(*10점을 제외한 최대 50점까지 신청 가능합니다.)</div>
                  </td>
                </tr>
                <tr>
                  <td className="pro4table-header">신청 기간</td>
                  <td className="pro4center-text">
                    {new Date(applicationPeriod.start).toLocaleString('ko-KR') || 'N/A'} ~{' '}
                    {new Date(applicationPeriod.end).toLocaleString('ko-KR') || 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="pro4popup-buttons">
              <button className="pro4cancel-button" onClick={handleClosePopup}>취소</button>
              <button className="pro4confirm-button" onClick={handleAddApplication}>신청하기</button>
            </div>
          </div>
        </div>
      )}

      <h2 className="pro4title">Mydex 온도 포인트 신청 내역</h2>

      <table className="pro4points-table">
        <thead>
          <tr>
            <th>신청 일시</th>
            <th>신청 포인트</th>
          </tr>
        </thead>
        <tbody>
          {pointsData.length > 0 ? (
            pointsData.map((point, index) => (
              <tr key={index}>
                <td>{new Date(point.scholarship_application_datetime).toLocaleString()}</td>
                <td>{point.requested_scholarship_points}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">신청 내역이 없습니다.</td>
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
  <div className="pro4pagination">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => handlePageChange(index + 1)}
        className={currentPage === index + 1 ? 'pro4active' : ''}
      >
        {index + 1}
      </button>
    ))}
  </div>
);

export default MyDexPoints;
