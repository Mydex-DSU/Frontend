import React, { useState, useEffect} from 'react';
import Card from '../Card/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './cardlist.css';


const CardList = () => {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const adminString = sessionStorage.getItem('admin');
      const admin = JSON.parse(adminString);

      if (!admin || !admin.adm_id) {
        console.error('사용자 정보가 없습니다.');
        return;
      }

      const response = await axios.get(`http://100.94.142.127:3000/programs`, {
        params: { adm_id: admin.adm_id },
      });
      setPrograms(response.data.programs);
    } catch (error) {
      console.error('구제 프로그램 신청 목록을 가져오는 데 실패했습니다:', error);
    }
  };

  const handleCardClick = (programId) => {
    navigate('/adm/applicationprogram', { state: { programId} });
  };

  return (
    <div className="program-section">
      <h2 className="section-title">비교과 프로그램 목록</h2>
      <div className="program-grid">
        {programs.map(program => (
          <Card
            key={program.program_id}
            title={program.program_name}
            image={program.program_poster_image}
            operationPeriod={`${new Date(program.program_operation_start_time).toLocaleDateString()} ~ ${new Date(program.program_operation_end_time).toLocaleDateString()}`}
            surveyPeriod={`${new Date(program.program_survey_start_time).toLocaleDateString()} ~ ${new Date(program.program_survey_end_time).toLocaleDateString()}`}
            status={program.program_status}
            likeCount={program.program_mydex_points}
            onClick={() => handleCardClick(program.program_id)}
          />
        ))}
      </div>
      <div className="program-links">
        <Link to="/adm/programlist">프로그램 목록 보러 가기 ＞</Link>
        <Link to="/adm/programregistration">프로그램 등록하러 가기 ＞</Link>
      </div>
    </div>
  );
};

export default CardList;