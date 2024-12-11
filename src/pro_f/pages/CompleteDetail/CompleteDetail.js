import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './completedetail.css';
import NoShowReasonModal from '../../component/NoShowReason/NoshowReasonModal';

const CompleteDetail = () => {
    const [program, setProgram] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { programId } = useParams();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const itemsPerPage = 10;

    const handleViewResponse = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };
    const handleEvaluate = (student) => {
        navigate(`/evaluationdetail/${programId}/${student.stu_id}`);
    };

    useEffect(() => {
        const fetchProgramDetail = async () => {
          try {
            const userString = sessionStorage.getItem('user');
            const user = JSON.parse(userString);
      
            if (!user || !user.adm_id) {
              throw new Error('관리자 정보가 없습니다.');
            }
      
            const response = await axios.post('http://100.94.142.127:3000/programs/fin/detail', {
                program_id: parseInt(programId),
                // adm_id: user.adm_id
              });
            
            if (response.data.programs && response.data.programs.length > 0) {
              setProgram(response.data.programs[0]);
              setStudentInfo(response.data.program_student);
            } else {
              throw new Error('프로그램 정보를 찾을 수 없습니다.');
            }
          } catch (error) {
            setError(error.message || '데이터를 불러오는데 실패했습니다.');
          } finally {
            setLoading(false);
          }
        };
      
        if (programId) {
          fetchProgramDetail();
        }
      }, [programId]);

  useEffect(() => {
    console.log('Current program state:', program);
    console.log('Current studentInfo state:', studentInfo);
  }, [program, studentInfo]);

  if (loading) {
    console.log('Rendering loading state');
    return <div className="loading">로딩 중...</div>;
  }
  if (error) {
    console.log('Rendering error state:', error);
    return <div className="error">{error}</div>;
  }
  if (!program) {
    console.log('Rendering no data state');
    return <div className="no-data">프로그램 정보가 없습니다.</div>;
  }

  console.log('Rendering program detail');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="program-detail-container">
      <h1 className="detail-title">비교과 프로그램 완료 상세</h1>
      
      <div className="notification-banner">
        <span className="bell-icon">🔔</span>
        비교과 프로그램 운영이 종료되었습니다 학생들을 평가하세요.
      </div>

      <div className="program-content">
        <div className="program-image">
          <img src={program.program_poster_image} alt="프로그램 포스터" />
        </div>

        <div className="program-info">
          <div className="info-section">
            <h2>프로그램 이름</h2>
            <p>{program.program_name}</p>
          </div>

          <div className="info-section">
            <h2>프로그램 내용</h2>
            <p>{program.program_description}</p>
          </div>

          <div className="info-section">
            <h2>신청일시</h2>
            <p>{`${formatDate(program.program_application_start_time)} (${formatTime(program.program_application_start_time)}) ~ ${formatDate(program.program_application_end_time)} (${formatTime(program.program_application_end_time)})`}</p>
          </div>

          <div className="info-section">
            <h2>운영일시</h2>
            <p>{`${formatDate(program.program_operation_start_time)} (${formatTime(program.program_operation_start_time)}) ~ ${formatDate(program.program_operation_end_time)} (${formatTime(program.program_operation_end_time)})`}</p>
          </div>

          <div className="info-section">
            <h2>설문조사기간</h2>
            <p>{`${formatDate(program.program_survey_start_time)} (${formatTime(program.program_survey_start_time)}) ~ ${formatDate(program.program_survey_end_time)} (${formatTime(program.program_survey_end_time)})`}</p>
          </div>

          <div className="info-section">
            <h2>Mydex 온도 포인트</h2>
            <p>{program.program_mydex_points}점</p>
          </div>

          <div className="info-section">
            <h2>프로그램 신청 인원</h2>
            <p>{program.program_max_participants}명</p>
          </div>

          <div className="info-section">
            <h2>프로그램 종류</h2>
            <p>{program.program_status}</p>
          </div>
        </div>
      </div>

      <div className="student-list-section">
    <h2 className="section-title">참여 학생 목록</h2>
    <div className="student-table-container">
    <table className="student-table">
    <thead>
        <tr>
            <th>학번</th>
            <th>학과</th>
            <th>학생이름</th>
            <th>전화번호</th>
            <th>최종 부여 포인트</th>
            <th>설문조사 응답 여부</th>
            <th>노쇼 이유 응답 여부</th>
            <th>답변 내용</th>
            <th>평가하기</th>
        </tr>
    </thead>
    <tbody>
    {studentInfo && studentInfo.map((student) => (
        <tr key={student.stu_id}>
            <td>{student.stu_id}</td>
            <td>{student.department_name}</td>
            <td>{student.stu_name}</td>
            <td>{student.stu_phone || '-'}</td>
            <td>{student.stu_give_mydex_points || '-'}</td>
            <td>
                {student.survey_response_status === 1 ? (
                    <span className="status-badge">응답완료</span>
                ) : null}
            </td>
            <td>
                {student.no_show_reason_response_status === 1 ? (
                    <span className="status-badge">응답완료</span>
                ) : null}
            </td>
            <td>
                {(student.survey_response_status === 1 || 
                  student.no_show_reason_response_status === 1) && (
                    <button 
                        className="view-button"
                        onClick={() => handleViewResponse(student)}
                    >
                        보러가기
                    </button>
                )}
            </td>
            <td>
                <div className="action-buttons">
                    {!student.stu_give_mydex_points && (
                        <button 
                            className="evaluate-button"
                            onClick={() => handleEvaluate(student)}
                        >
                            평가하기
                        </button>
                    )}
                    {student.stu_give_mydex_points && (
                        <button className="evaluate-complete">평가완료</button>
                    )}
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
        </div>
    </div>

      <button onClick={() => navigate('/completeprogram')} className="back-button">뒤로가기</button>
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