import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ApplicationProgram.css';

const ApplicationProgram = () => {
  const [programData, setProgramData] = useState(null);
  const [students, setStudents] = useState([]);
  const { programId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const response = await axios.post('http://100.94.142.127:3000/programs/application/detail', {
          program_id: parseInt(programId)
        });

        const program = response.data.program[0];
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
            "프로그램 신청 인원": program.program_max_participants,
            "프로그램 종류": program.programtype_id === 2 ? "특강" : "기타"
          }
        });

        setStudents(response.data.programdetail);
      } catch (error) {
        console.error('프로그램 상세 정보를 가져오는데 실패했습니다:', error);
      }
    };

    if (programId) {
      fetchProgramDetails();
    }
  }, [programId]);

  const handleBack = () => {
    navigate('/adm/programlist');
  };

  if (!programData) {
    return <div>로딩중...</div>;
  }

  return (
    <>
      <div className="header">
        <h2>비교과 프로그램 상세</h2>
        <button onClick={handleBack}>목록</button>
      </div>
  
      <div className="program-detail">
        <div className="program-wrapper">
          <img src={programData.image} alt={programData.title} className="program-poster" />
          <div className="program-description">
            <h3>{programData.title}</h3>
            <div className="program-info-list">
              {Object.entries(programData.details).map(([key, value]) => (
                <div className="info-item" key={key}>
                  <span className="info-label">{key}</span>
                  <span className="info-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  
      <div className="student-section">
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