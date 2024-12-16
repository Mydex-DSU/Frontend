import React from 'react';
import './proHeaderAndButtons.css';
import Header from './proHeader';

function ProHeaderAndButtons({ onCancel, onSubmit }) {
  return (
    <div className="header-buttons-container">
        {/* Header 컴포넌트 포함 */}
      <Header /> 
    
    
 
       {/* 버튼 컨테이너 */}
       <div className="button-container-pro1">
        <button className="cancel-button-pro1" onClick={onCancel}>
          취소
        </button>
        <button className="submit-button-pro1" onClick={onSubmit}>
          등록
        </button>
      </div>
      
    </div>
    
    
  );
}

export default ProHeaderAndButtons;
