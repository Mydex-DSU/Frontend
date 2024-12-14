import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = (e) => {
    // 드롭다운 영역 외부 클릭 시 닫기
    if (!e.target.closest(".menu-item")) {
      setIsDropdownOpen(false);
    }
  };

  React.useEffect(() => {
    // 전역 클릭 이벤트 리스너 추가
    document.addEventListener("click", closeDropdown);
    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  return (
    <div className="navbar">
      {/* 로고 또는 홈 링크 */}
      <Link to="/" className="nav-link">MYDEX</Link>

      {/* 비교과 프로그램 드롭다운 */}
      <div className="menu-item">
        <span className="nav-link" onClick={toggleDropdown}>
          비교과프로그램
        </span>
        {isDropdownOpen && (
          <ul className="submenu">
            <li>
              <Link to="/stu/programlistpage" className="submenu-link">
                비교과프로그램 목록
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* 구제 프로그램 */}
      <Link to="/stu/reliefprogrampage" className="nav-link">
        구제 프로그램
      </Link>

      {/* 졸업생 포트폴리오 */}
      <Link to="/portfolio" className="nav-link">
        졸업생 포트폴리오
      </Link>

      {/* MYDEX 온도 포인트 */}
      <Link to="/temperature" className="nav-link">
        MYDEX 온도포인트 장학금
      </Link>
    </div>
  );
}

export default NavBar;
