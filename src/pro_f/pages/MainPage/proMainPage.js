import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './proMainPage.css'

function ProMainPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]); // 학생 데이터
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [checkRecommend, setCheckRecommend] = useState(false)
  const [checkRecommendStu, setCheckRecommendStu] = useState('')
  const studentsPerPage = 5;

  const pro_id = sessionStorage.getItem('pro_id');
  console.log(pro_id);


  useEffect(() => {
    const professorId = sessionStorage.getItem("pro_id");
    console.log(professorId)
    if (professorId) {
      setIsLoggedIn(true);
    } else {
      // If no professor ID is found, redirect to the login page
      navigate("/");
    }

      const fetchCheckRecommend = async () => {
        try {
          const currentYear = new Date().getFullYear(); // 현재 시간의 년도 가져오기 (2024 형태)
          const response = await axios.post('http://100.94.142.127:3000/guidestudent/recommend/check', {
            pro_id: pro_id,
            year: currentYear.toString(), // 문자열 형태로 변환
          });
    
    
          console.log('추천 체크 API 응답 데이터: ', response.data);
          const isRecommended = response.data.check === 'true' || response.data.check === true;
          setCheckRecommend(isRecommended);
          console.log('추천 체크 API 응답 데이터: ', response.data.student);
          console.log('추천 체크 API 응답 데이터: ', response.data.student.stu_name);
          const student = response.data.student[0]; // 배열의 첫 번째 요소
          setCheckRecommendStu(student)
          }catch (error) {
          console.error('학생 데이터를 가져오는 중 오류 발생:', error);
        }
      }
      fetchStudents();
      fetchCheckRecommend();
  }, [navigate]);

    const fetchStudents = async () => {
        try {
        const response = await axios.post('http://100.94.142.127:3000/guidestudent', {
            pro_id: pro_id,
        });
        console.log('API 응답 데이터:', response.data.guidestudent);

        const students = response.data.guidestudent || [];
        // 두 가지 기준으로 정렬
        const sortedStudents = students.sort((a, b) => {
            if (b.stu_current_warning_count !== a.stu_current_warning_count) {
            return b.stu_current_warning_count - a.stu_current_warning_count; // 경고 횟수 내림차순
            }
            return (b.stu_reset_available_count || 0) - (a.stu_reset_available_count || 0); // 초기화 가능 횟수 내림차순
        });

        setStudents(sortedStudents);
        } catch (error) {
        console.error('학생 데이터를 가져오는 중 오류 발생:', error);
        }
    };

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
        alert('초기화되었습니다.');

        // 데이터 갱신
        await fetchStudents();
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
      navigate('/pro/prorecommendpage');
    };
  



  const handleLogout = () => {
    sessionStorage.removeItem("pro_id");
    setIsLoggedIn(false);
    navigate("/"); // Redirect to main page or login page after logout
  };

  if (!isLoggedIn) {
    return <p>로그인이 필요합니다. 메인 화면으로 이동 중...</p>;
  }

  return (
    // <div className="main-container">
    //   <div className="auth-button-container">

    //   </div>
    <div className="student-management-container">
        <button className="auth-button" onClick={handleLogout}>
        로그아웃
        </button>
        <div className="proMainheader">
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

        {/* <RecommendSection onRecommendClick={handleRecommendClick} /> */}
        <RecommendSection checkRecommend={checkRecommend} checkRecommendStu={checkRecommendStu} onRecommendClick={handleRecommendClick} />

    </div>
    //</div>
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
          <th>노쇼 횟수</th>
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
                {/* 노쇼 횟수: 값이 없으면 0으로 표시 */}
                <td>{student.stu_no_show_count || 0}</td>
            <td>
              {student.stu_reset_available_count !== undefined
                ? student.stu_reset_available_count
                : '데이터 없음'}
            </td>
            <td>
              {(student.stu_current_warning_count === 2 || student.stu_current_warning_count === 3) && (student.stu_reset_available_count === 1) &&
              (
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
  const RecommendSection = ({ checkRecommend, onRecommendClick, checkRecommendStu }) => (
    <div className="recommend-section">
      <div className="recommend-header">
        <h2>★ 우수 졸업생 추천하러 가기</h2>
      </div>
      <div className="recommend-box">
        <div className="recommend-content">
          <span className="icon">🎓</span>
          <p>
          {checkRecommend ? (
            <>
              이미 {checkRecommendStu.year_of_recommendation}년도 우수졸업생인 <br />
              {checkRecommendStu.stu_name} 학생을 추천하였습니다.
            </>
          ) : (
            '2024년도 우수 졸업생을 추천할 수 있습니다.'
          )}
          </p>
        </div>
        {!checkRecommend && (
          <button className="recommend-button" onClick={onRecommendClick}>
            추천 하러 가기 &gt;
          </button>
        )}
      </div>
    </div>
  );
  
  

export default ProMainPage;
