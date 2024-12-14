import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './cardlist.css';

const CardList = () => {
  const [programs, setPrograms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const adminString = sessionStorage.getItem('admin');
      const admin = JSON.parse(adminString);

      // if (!admin || !admin.adm_id) {
      //   console.error('사용자 정보가 없습니다.');
      //   return;
      // }

      const response = await axios.get(`http://100.94.142.127:3000/programs`, {
        params: { adm_id: admin.adm_id },
      });
      setPrograms(response.data.programs);
    } catch (error) {
      console.error('프로그램 목록을 가져오는 데 실패했습니다:', error);
    }
  };

  const handleCardClick = (programId) => {
    navigate('/adm/applicationprogram', { state: { programId } });
  };

  const nextSlide = () => {
    const maxIndex = Math.ceil(programs.length / 4) - 1;
    setCurrentIndex(current => current === maxIndex ? 0 : current + 1);
  };

  const prevSlide = () => {
    const maxIndex = Math.ceil(programs.length / 4) - 1;
    setCurrentIndex(current => current === 0 ? maxIndex : current - 1);
  };
  
  return (
    <div className="adm_program-section">
      <h2 className="adm_section-title">비교과 프로그램 목록</h2>
      <div className="adm_slider-wrapper">
        <button className="adm_slider-button adm_prev" onClick={prevSlide}>&lt;</button>
        <div className="adm_slider-container">
          <div className="adm_program-grid" 
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}>
            {programs.map((program) => (
              <div className="adm_card-item" key={program.program_id}>
                <Card
                  title={program.program_name}
                  image={program.program_poster_image}
                  operationPeriod={`${new Date(program.program_operation_start_time).toLocaleDateString()} ~ ${new Date(program.program_operation_end_time).toLocaleDateString()}`}
                  surveyPeriod={`${new Date(program.program_survey_start_time).toLocaleDateString()} ~ ${new Date(program.program_survey_end_time).toLocaleDateString()}`}
                  status={program.program_status}
                  likeCount={program.program_mydex_points}
                  onClick={() => handleCardClick(program.program_id)}
                />
              </div>
            ))}
          </div>
        </div>
        <button className="adm_slider-button adm_next" onClick={nextSlide}>&gt;</button>
      </div>
      <div className="adm_program-links">
        <Link to="/adm/programlist">프로그램 목록 보러 가기 ＞</Link>
        <Link to="/adm/programregistration">프로그램 등록하러 가기 ＞</Link>
      </div>
    </div>
  );
};
    
    

export default CardList;
