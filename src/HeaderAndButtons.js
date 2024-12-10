import React from 'react';
import './HeaderAndButtons.css';
import Header from './Header';

function HeaderAndButtons({ onCancel, onSubmit }) {
  return (
    <div className="header-buttons-container">
        {/* Header 컴포넌트 포함 */}
      <Header /> 
      <div className="title-section">
      <h2 className="recommend-list-title">우수 졸업생 추천 목록</h2>
      </div>
       {/* 버튼 컨테이너 */}
       <div className="button-container">
        <button className="cancel-button" onClick={onCancel}>
          취소
        </button>
        <button className="submit-button" onClick={onSubmit}>
          등록
        </button>
      </div>
      {/* 헤더 */}
      <div className="header">우수 졸업생 정보</div>
    </div>
    
    
  );
}

export default HeaderAndButtons;
