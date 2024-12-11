import React from 'react';
import './proHeaderAndButtons.css';
import Header from './proHeader';

function ProHeaderAndButtons({ onCancel, onSubmit }) {
  return (
    <div className="header-buttons-container">
        {/* Header 컴포넌트 포함 */}
      <Header /> 
      <div className="title-section-pro1">
      <h2 className="recommend-list-title-pro1">우수 졸업생 추천 목록</h2>
      </div>
       {/* 버튼 컨테이너 */}
       <div className="button-container-pro1">
        <button className="cancel-button-pro1" onClick={onCancel}>
          취소
        </button>
        <button className="submit-button-pro1" onClick={onSubmit}>
          등록
        </button>
      </div>
      {/* 헤더 */}
      <div className="header">우수 졸업생 정보</div>
    </div>
    
    
  );
}

export default ProHeaderAndButtons;
