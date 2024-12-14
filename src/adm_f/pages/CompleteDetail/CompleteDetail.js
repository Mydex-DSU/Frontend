import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './completedetail.css';
import NoShowReasonModal from '../../component/NoShowReason/NoshowReasonModal';

const CompleteDetail = () => {
  const location = useLocation();
  const programId = location.state?.programId;
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(4);

  const programTypeNames = {
    1: "특강",
    2: "견학",
    3: "캠프및",
    4: "클리닉참여",
    5: "학습공동체활동"
  };

  const getProgramTypeName = (typeId) => {
    return programTypeNames[typeId] || "알 수 없음";
  };

  useEffect(() => {
    if (programId) {
      fetchProgramDetail(programId);
    } else {
      console.error("프로그램 ID가 없습니다.");
      setError("프로그램 ID가 없습니다.");
      setLoading(false);
    }
  }, [programId]);

  const fetchProgramDetail = async (id) => {
    try {
      const response = await axios.post(
        "http://100.94.142.127:3000/programs/fin/detail",
        { program_id: id }
      );
      setProgram(response.data.programs[0]);
      setStudentInfo(response.data.program_student);
    } catch (error) {
      console.error("프로그램 정보를 불러오는데 실패했습니다:", error.response?.data || error.message);
      setError('프로그램 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResponse = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleEvaluate = (student) => {
    navigate('/adm/evaluationdetail', { 
      state: { 
        programId: programId, 
        studentId: student.stu_id 
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = studentInfo ? studentInfo.slice(indexOfFirstStudent, indexOfLastStudent) : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="adm_loading">로딩 중...</div>;
  if (error) return <div className="adm_error">{error}</div>;
  if (!program) return <div className="adm_no-data">프로그램 정보가 없습니다.</div>;

  return (
    <div className="adm_program-detail-container">
      <h1 className="adm_detail-title">비교과 프로그램 완료 상세</h1>
      <div className="adm_notification-banner">
        <span className="adm_bell-icon">🔔</span>
        비교과 프로그램 운영이 종료되었습니다 학생들을 평가하세요.
      </div>
      <div className="adm_program-content">
        <div className="adm_program-image">
          <img src={program.program_poster_image} alt="프로그램 포스터" />
        </div>
        <div className="adm_program-info">
          <div className="adm_info-section">
            <h2>프로그램 이름</h2>
            <p>{program.program_name}</p>
          </div>
          <div className="adm_info-section">
            <h2>프로그램 내용</h2>
            <p>{program.program_description}</p>
          </div>
          <div className="adm_info-section">
            <h2>신청일시</h2>
            <p>{`${formatDate(program.program_application_start_time)} (${formatTime(program.program_application_start_time)}) ~ ${formatDate(program.program_application_end_time)} (${formatTime(program.program_application_end_time)})`}</p>
          </div>
          <div className="adm_info-section">
            <h2>운영일시</h2>
            <p>{`${formatDate(program.program_operation_start_time)} (${formatTime(program.program_operation_start_time)}) ~ ${formatDate(program.program_operation_end_time)} (${formatTime(program.program_operation_end_time)})`}</p>
          </div>
          <div className="adm_info-section">
            <h2>설문조사기간</h2>
            <p>{`${formatDate(program.program_survey_start_time)} (${formatTime(program.program_survey_start_time)}) ~ ${formatDate(program.program_survey_end_time)} (${formatTime(program.program_survey_end_time)})`}</p>
          </div>
          <div className="adm_info-section">
            <h2>Mydex 온도 포인트</h2>
            <p>{program.program_mydex_points}점</p>
          </div>
          <div className="adm_info-section">
            <h2>프로그램 신청 인원</h2>
            <p>{program.program_max_participants}명</p>
          </div>
          <div className="adm_info-section">
            <h2>프로그램 종류</h2>
            <p>{getProgramTypeName(program.programtype_id)}</p>
          </div>
        </div>
      </div>
      <div className="adm_student-list-section">
        <h2 className="adm_section-title-complete">참여 학생 목록</h2>
        <div className="adm_student-table-container">
          <table className="adm_student-table">
            <thead className='adm_thread-complete'>
              <tr>
                <th>학번</th>
                <th>학과</th>
                <th>학생이름</th>
                <th>전화번호</th>
                <th>최종 부여 포인트</th>
                <th>설문조사 응답 여부</th>
                <th>노쇼 이유 응답 여부</th>
                <th>노쇼 이유 답변</th>
                <th>평가하기</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.stu_id}>
                  <td>{student.stu_id}</td>
                  <td>{student.department_name}</td>
                  <td>{student.stu_name}</td>
                  <td>{student.stu_phone || '-'}</td>
                  <td>{student.stu_give_mydex_points || '-'}</td>
                  <td>
                    {student.survey_response_status === 1 ? (
                      <span className="adm_status-badge">응답완료</span>
                    ) : null}
                  </td>
                  <td>
                    {student.no_show_reason_response_status === 1 ? (
                      <span className="adm_status-badge">응답완료</span>
                    ) : null}
                  </td>
                  <td>
                    {student.no_show_reason_response_status === 1 && (
                      <button 
                        className="adm_view-button"
                        onClick={() => handleViewResponse(student)}
                      >
                        보러가기
                      </button>
                    )}
                  </td>
                  <td>
                    <div className="adm_action-buttons">
                      {!student.stu_give_mydex_points && (
                        <button 
                          className="adm_evaluate-button"
                          onClick={() => handleEvaluate(student)}
                        >
                          평가하기
                        </button>
                      )}
                      {student.stu_give_mydex_points && (
                        <button className="adm_evaluate-complete">평가완료</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="adm_pagination-detail">
          <button 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="adm_page-arrow-detail"
          >
            &lt;
          </button>
          
          {studentInfo && (
            [...Array(Math.ceil(studentInfo.length / studentsPerPage))].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`adm_page-button-detail ${currentPage === index + 1 ? 'adm_active' : ''}`}
              >
                {index + 1}
              </button>
            ))
          )}
          
          <button 
            onClick={() => paginate(currentPage + 1)}
            disabled={studentInfo && currentPage === Math.ceil(studentInfo.length / studentsPerPage)}
            className="adm_page-arrow-detail"
          >
            &gt;
          </button>
        </div>

      </div>
      <button onClick={() => navigate('/adm/completeprogram')} className="adm_back-button-detail">목록으로</button>
      <NoShowReasonModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />
    </div>
  );
};

export default CompleteDetail;
