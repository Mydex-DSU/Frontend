import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentManagement.css';

function StudentManagement() {
  const [students, setStudents] = useState([]); // 학생 데이터
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.post('http://100.94.142.127:3000/guidestudent', {
          pro_id: 1,
        });
        console.log('API 응답 데이터:', response.data.guidestudent);
        const sortedStudents = (response.data.guidestudent || []).sort(
          (a, b) => b.stu_current_warning_count - a.stu_current_warning_count
        );
        setStudents(sortedStudents);
      } catch (error) {
        console.error('학생 데이터를 가져오는 중 오류 발생:', error);
      }
    };
  
    fetchStudents();
  }, []);
  
  const handleSearch = () => {
    const filteredStudents = students.filter(
      (student) =>
        (selectedDepartment === '' || student.department_name === selectedDepartment) &&
        (student.stu_id.toString().includes(searchKeyword) || student.stu_name.includes(searchKeyword))
    );
    setStudents(filteredStudents);
    setCurrentPage(1);
  };

  const handleReset = async (stu_id) => {
    try {
      const response = await axios.post('http://100.94.142.127:3000/guidestudent/reset', {
        stu_id,
      });

      const updatedStudent = response.data;

      // 업데이트된 데이터를 반영
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.stu_id === stu_id ? { ...student, ...updatedStudent } : student
        )
      );

      alert('초기화되었습니다.');
    } catch (error) {
      console.error('초기화 요청 중 오류 발생:', error);
      alert('초기화 중 문제가 발생했습니다.');
    }
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalPages = Math.ceil(students.length / studentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const hasWarningStudents = students.some((student) => student.stu_current_warning_count >= 3);

  const handleRecommendClick = () => {
    navigate('/recommend');
  };

  return (
    <div className="student-management-container">
      <div className="header">
        <h2>★ 지도학생 관리</h2>
      </div>

      {hasWarningStudents && <WarningMessage />}

      <div className="search-and-table">
        <SearchBar
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          handleSearch={handleSearch}
        />

        <StudentTable students={currentStudents} handleReset={handleReset} />
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />

      <RecommendSection onRecommendClick={handleRecommendClick} />
    </div>
  );
}

// 경고 메시지 컴포넌트
const WarningMessage = () => (
  <div className="warning-message">
    <h2>학생 권한이 제한된<br /> 지도학생이 있습니다.</h2>
  </div>
);

// 검색 바 컴포넌트
const SearchBar = ({ searchKeyword, setSearchKeyword, selectedDepartment, setSelectedDepartment, handleSearch }) => (
  <div className="search-bar">
    <select className="dropdown" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
      <option value="">학과</option>
      <option value="소프트웨어학과">소프트웨어학과</option>
      <option value="컴퓨터공학과">컴퓨터공학과</option>
      <option value="기계공학과">기계공학과</option>
    </select>
    <input
      type="text"
      className="search-input"
      placeholder="학번 또는 이름 검색"
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)}
    />
    <button className="search-button" onClick={handleSearch}>검색</button>
  </div>
);

// 학생 테이블 컴포넌트
const StudentTable = ({ students, handleReset }) => (
  <table className="student-table">
    <thead>
      <tr>
        <th>학과</th>
        <th>학번</th>
        <th>이름</th>
        <th>경고 횟수</th>
        <th>초기화 횟수</th>
        <th>초기화</th>
      </tr>
    </thead>
    <tbody>
      {students.map((student) => (
        <tr key={student.stu_id}>
          <td>{student.department_name}</td>
          <td>{student.stu_id}</td>
          <td>{student.stu_name}</td>
          <td>{student.stu_current_warning_count}</td>
          <td>
            {student.stu_reset_available_count !== undefined
              ? student.stu_reset_available_count
              : '데이터 없음'}
          </td>
          <td>
            {/* 초기화 버튼이 경고 횟수가 2 또는 3일 때만 표시 */}
            {(student.stu_current_warning_count === 2 || student.stu_current_warning_count === 3) && (
              <button className="reset-button" onClick={() => handleReset(student.stu_id)}>
                초기화
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);


// 페이지네이션 컴포넌트
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

// 우수 졸업생 추천 컴포넌트
const RecommendSection = ({ onRecommendClick }) => (
  <div className="recommend-section">
    <div className="recommend-header">
      <h2>★ 우수 졸업생 추천하러 가기</h2>
    </div>
    <div className="recommend-box">
      <div className="recommend-content">
        <span className="icon">🎓</span>
        <p>2024년도 우수 졸업생을<br /> 추천할 수 있습니다.</p>
      </div>
      <button className="recommend-button" onClick={onRecommendClick}>
        추천 하러 가기 &gt;
      </button>
    </div>
  </div>
);

export default StudentManagement;