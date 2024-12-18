import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ApplicationProgram.css';

const ApplicationProgram = () => {
  const [programData, setProgramData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const program_type_mapping = {
    1: '특강',
    2: '견학',
    3: '캠프 및 워크숍',
    4: '클리닉참여',
    5: '학습공동체활동'
  };

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const programId = location.state?.programId;
        if (!programId) {
          throw new Error('프로그램 ID가 전달되지 않았습니다.');
        }

        const response = await axios.post('http://100.94.142.127:3000/programs/application/detail', {
          program_id: programId
        });

        const programdetail = response.data.programdetail.length
        console.log(programdetail)
        const program = response.data.program[0];
        console.log(response.data)
        setProgramData({
          title: program.program_name,
          image: program.program_poster_image,
          description: program.program_description,
          details: {
            "프로그램 이름": program.program_name,
            "프로그램 내용": program.program_description,
            신청일시: `${new Date(program.program_application_start_time).toLocaleDateString()} ~ ${new Date(program.program_application_end_time).toLocaleDateString()}`,
            운영일시: `${new Date(program.program_operation_start_time).toLocaleDateString()} ~ ${new Date(program.program_operation_end_time).toLocaleDateString()}`,
            설문조사기간: `${new Date(program.program_survey_start_time).toLocaleDateString()} ~ ${new Date(program.program_survey_end_time).toLocaleDateString()}`,
            "Mydex 온도 포인트": `${program.program_mydex_points}점`,
            "프로그램 수용 인원": program.program_max_participants,
            "프로그램 신청 인원" : programdetail,
            "프로그램 종류": program_type_mapping[program.programtype_id] || "기타",
          }
        });

        setStudents(response.data.programdetail);
        setLoading(false);
      } catch (error) {
        console.error('프로그램 상세 정보를 가져오는데 실패했습니다:', error);
        setError(error.message || '데이터를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [location.state]);

  const handleBack = () => {
    navigate('/adm/programlist');
  };

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;
  if (!programData) return <div>프로그램 데이터가 없습니다.</div>;

  return (
    <>
      <div className="adm_header">
        <h2>비교과 프로그램 상세</h2>
        <button onClick={handleBack}>목록</button>
      </div>
  
      <div className="adm_program-detail">
        <div className="adm_program-wrapper">
          <img src={programData.image} alt={programData.title} className="adm_program-poster" />
          <div className="adm_program-description">
            <h3>{programData.title}</h3>
            <div className="adm_program-info-list">
              {Object.entries(programData.details).map(([key, value]) => (
                <div className="adm_info-item" key={key}>
                  <span className="adm_info-label">{key}</span>
                  <span className="adm_info-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  
      <div className="adm_student-section">
        <h3>신청학생 목록</h3>
        <table>
          <thead>
            <tr>
              <th>학번</th>
              <th>학과</th>
              <th>학생이름</th>
              <th>학생 전화번호</th>
              <th>이메일</th>
              <th>학생 Mydex 온도 포인트</th>
              <th>신청일시</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.stu_id}>
                <td>{student.stu_id}</td>
                <td>{student.department_name}</td>
                <td>{student.stu_name}</td>
                <td>{student.stu_phone}</td>
                <td>{student.stu_email}</td>
                <td>{student.stu_current_mydex_points}</td>
                <td>{student.application_datetime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ApplicationProgram;
