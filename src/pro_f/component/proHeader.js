import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import './proHeader.css'; // 스타일링을 위한 CSS 파일

const ProHeader = () => {
  const [active, setActive] = useState('recommend'); // 활성화된 메뉴 항목
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 훅

  const handleLogout = () => {
    // 세션 스토리지에서 인증 데이터 삭제
    sessionStorage.clear(); 
    // 로그인 페이지로 리디렉션
    navigate('/login'); 
  };

  return (
    <div className="header-container-pro1">
      <div className="header-left-pro1">
        <span className="mydex-pro1">MYDEX</span>
      </div>
      <div className="header-center-pro1">
        <Link
          to="/studentmanagement"
          className={`header-item-pro1 ${active === 'studentmanagement' ? 'active' : ''}`}
          onClick={() => setActive('studentmanagement')}
        >
          지도학생 관리
        </Link>
        <Link
          to="/recommend"
          className={`header-item-pro1 ${active === 'recommend' ? 'active' : ''}`}
          onClick={() => setActive('recommend')}
        >
          우수 졸업생 관리
        </Link>
      </div>
      <div className="header-right-pro1">
        <button className="logout-button-pro1" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default ProHeader;
