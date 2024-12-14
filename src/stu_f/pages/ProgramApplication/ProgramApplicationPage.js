import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgramApplicationPage.css';

const ProgramApplications = () => {
  const [programs, setPrograms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const itemsPerPage = 5;

  const userId = sessionStorage.getItem("stu_id");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.post(
          'http://100.94.142.127:3000/profile/application/programlist',
          { stu_id: userId },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data && Array.isArray(response.data.applicationProgramList)) {
          setPrograms(response.data.applicationProgramList);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError('프로그램 데이터를 불러오는 데 실패했습니다.');
      }
    };

    fetchPrograms();
  }, []);

  const fetchProgramDetails = async (programId) => {
    try {
      const response = await axios.post(
        'http://100.94.142.127:3000/profile/program/detail',
        { program_id: programId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && Array.isArray(response.data.program_detail_all)) {
        setPopupData(response.data.program_detail_all[0]);
        setIsPopupOpen(true);
      } else {
        throw new Error('Invalid response format');
      }
    } catch {
      setError('프로그램 상세정보를 불러오는 데 실패했습니다.');
    }
  };

  

  const cancelProgramApplication = async (programId) => {
    try {
      const response = await axios.post(
        'http://100.94.142.127:3000/application/delete',
        { program_id: programId, stu_id: userId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        // 신청 취소가 성공한 경우, UI에서 해당 프로그램 제거
        setPrograms((prevPrograms) =>
          prevPrograms.filter((program) => program.program_id !== programId)
        );
        alert('신청이 취소되었습니다.');
      } else {
        alert('신청 취소에 실패했습니다. 다시 시도해주세요.');
      }
    } catch {
      alert('신청 취소 요청 중 오류가 발생했습니다.');
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupData(null);
  };

  const filteredPrograms = programs.filter((program) =>
    program.program_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPrograms = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="pro2program-applications-container">
      <h1 className="pro2page-title">비교과 프로그램 신청 목록</h1>

      {error && <div className="pro2error-message">{error}</div>}

      <div className="pro2search-container">
        <input
          type="text"
          placeholder="프로그램 이름을 검색하세요"
          value={searchQuery}
          onChange={handleSearchChange}
          className="pro2search-input"
        />
      </div>

      <table className="pro2applications-table">
        <thead>
          <tr>
            <th>프로그램 이름</th>
            <th>Mydex 온도포인트</th>
            <th>신청날짜</th>
            <th>신청 취소</th>
            <th>상세 정보</th>
          </tr>
        </thead>
        <tbody>
          {currentPrograms.length > 0 ? (
            currentPrograms.map((program) => (
              <tr key={program.program_id}>
                <td>{program.program_name || '이름 없음'}</td>
                <td>{program.ondo_points || '-'}</td>
                <td>
                  {program.application_date
                    ? new Date(program.application_date).toLocaleString('ko-KR')
                    : '-'}
                </td>
                <td>
                  <button
                    className="pro2cancel-button"
                    onClick={() => cancelProgramApplication(program.program_id)}
                  >
                    취소
                  </button>
                </td>
                <td>
                  <button
                    className="pro2details-button"
                    onClick={() => fetchProgramDetails(program.program_id)}
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">등록된 프로그램이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />

      {isPopupOpen && popupData && (
        <div className="pro2popup-overlay">
          <div className="pro2popup-content">
            <h1 className="pro2popup-title">비교과 프로그램 상세</h1>
            <div className="pro2popup-body">
              <div className="pro2popup-left">
                <div className="pro2popup-program-title">{popupData.program_name}</div>
                <div className="pro2popup-image-container">
                  <img
                    src={popupData.program_poster_image}
                    alt="프로그램 포스터"
                    className="pro2popup-image"
                  />
                </div>
              </div>
              <div className="pro2popup-right">
                <p>
                  <strong>프로그램 이름:</strong> {popupData.program_name}
                </p>
                <p>
                  <strong>프로그램 설명:</strong> {popupData.program_description}
                </p>
                <p>
                  <strong>신청 기간:</strong>{' '}
                  {new Date(popupData.program_application_start_time).toLocaleString('ko-KR')} ~{' '}
                  {new Date(popupData.program_application_end_time).toLocaleString('ko-KR')}
                </p>
                <p>
                  <strong>운영 기간:</strong>{' '}
                  {new Date(popupData.program_operation_start_time).toLocaleString('ko-KR')} ~{' '}
                  {new Date(popupData.program_operation_end_time).toLocaleString('ko-KR')}
                </p>
                <p>
                  <strong>설문조사 기간:</strong>{' '}
                  {new Date(popupData.program_survey_start_time).toLocaleString('ko-KR')} ~{' '}
                  {new Date(popupData.program_survey_end_time).toLocaleString('ko-KR')}
                </p>
                <p>
                  <strong>담당자 이름:</strong> {popupData.adm_name}
                </p>
                <p>
                  <strong>담당자 번호:</strong> {popupData.adm_phone}
                </p>
                <p>
                  <strong>프로그램 종류:</strong> {popupData.programtype_id}
                </p>
              </div>
            </div>
            <button className="pro2close-button" onClick={closePopup}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Pagination = ({ totalPages, currentPage, handlePageChange }) => (
  <div className="pro2pagination">
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

export default ProgramApplications;
