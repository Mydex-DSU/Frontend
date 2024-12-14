import React, { useState, useEffect } from 'react';
import './mydex.css';
import MydexModal from '../MydexModal/MydexModal';
import axios from 'axios';

const Mydex = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scholarshipData, setScholarshipData] = useState(null);

  useEffect(() => {
    const fetchScholarshipData = async () => {
      try {
        const response = await axios.get('http://100.94.142.127:3000/mydexscholarship');
        const sortedData = response.data.mydexscholarship.sort((a, b) => 
          b.mydex_scholarship_application_period_id - a.mydex_scholarship_application_period_id
        );
        setScholarshipData(sortedData[0]);
      } catch (error) {
        console.error('Error fetching scholarship data:', error);
      }
    };

    fetchScholarshipData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
  };

  return (
    <div>
      <h2 className='adm_MydexHead'>Mydex 온도 포인트 장학금 신청 기간 등록</h2>
      <div className="adm_content-box">
        <p className="adm_text">
          Mydex 온도 포인트 장학금 신청 기간 등록 유의사항
        </p>
        <p className="adm_text">
          등록 기간은 학기 종강일에 시작해야하며 기간은 일주일로 고정됩니다.
        </p>
        {scholarshipData && (
          <p className="adm_text">
            이번 학기 종강일은 {formatDate(scholarshipData.mydex_application_start_dateTime)} 입니다.
          </p>
        )}
      </div>
      <button className="adm_register-button" onClick={() => setIsModalOpen(true)}>
        등록
      </button>
      <MydexModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Mydex;
