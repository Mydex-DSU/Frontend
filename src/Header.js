import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // 스타일링을 위한 CSS 파일

const Header = () => {
  const [active, setActive] = useState('recommend'); // 활성화된 메뉴 항목

  return (
    <div className="header-container">
      <div className="header-left">
        <span className="mydex">MYDEX</span>
      </div>
      <div className="header-center">
        <Link
          to="/student-management"
          className={`header-item ${active === 'student-management' ? 'active' : ''}`}
          onClick={() => setActive('student-management')}
        >
          지도학생 관리
        </Link>
        <Link
          to="/recommend"
          className={`header-item ${active === 'recommend' ? 'active' : ''}`}
          onClick={() => setActive('recommend')}
        >
          우수 졸업생 관리
        </Link>
      </div>
      <div className="header-right">
        <button className="logout-button">로그아웃</button>
      </div>
    </div>
  );
};

export default Header;
