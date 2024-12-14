import React, { useState } from 'react';
import './mydex.css';
import MydexModal from '../MydexModal/MydexModal';

const Mydex = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <p className="adm_text">
          이번 학기 종강일은 2024-12-20(금) 입니다.
        </p>
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