import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import './proHeader.css'; // 스타일링을 위한 CSS 파일

const ProHeader = () => {
  const [active, setActive] = useState('recommend'); // 활성화된 메뉴 항목
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 훅

  return (
    <div className="header-container-pro1">
      <div className="header-left-pro1">
        <Link to="/pro/promainpage">MYDEX</Link> {/* MYDEX 메인 로고 */}
      </div>
      <div className="header-right-pro1">
      </div>
    </div>
  );
};

export default ProHeader;
