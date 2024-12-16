import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 열림 상태
  const [activeDropdown, setActiveDropdown] = useState(""); // 어떤 드롭다운이 열려 있는지

  const toggleDropdown = (menuName) => {
    if (activeDropdown === menuName) {
      setIsDropdownOpen(false); // 이미 열린 메뉴를 다시 클릭하면 닫기
      setActiveDropdown("");
    } else {
      setIsDropdownOpen(true); // 드롭다운 열기
      setActiveDropdown(menuName);
    }
  };

  const closeDropdown = (e) => {
    if (!e.target.closest(".menu-item")) {
      setIsDropdownOpen(false);
      setActiveDropdown("");
    }
  };

  useEffect(() => {
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
        <span
          className="nav-link"
          onClick={() => toggleDropdown("programs")}
        >
          비교과프로그램
        </span>
        {isDropdownOpen && activeDropdown === "programs" && (
          <ul className="submenu">
            <li>
              <Link to="/stu/programlistpage" className="submenu-link">
                비교과프로그램 목록
              </Link>
            </li>
            <li>
              <Link to="/stu/programapplication" className="submenu-link">
                비교과프로그램 신청 목록
              </Link>
            </li>
            <li>
              <Link to="/stu/programmyinfopage" className="submenu-link">
                비교과프로그램 참여 목록
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* 구제 프로그램 */}
      <Link to="/stu/reliefprogrampage" className="nav-link">
        구제 프로그램
      </Link>

      {/* MYDEX 온도 포인트 드롭다운 */}
      <div className="menu-item">
        <span
          className="nav-link"
          onClick={() => toggleDropdown("mydex")}
        >
          MYDEX 온도포인트
        </span>
        {isDropdownOpen && activeDropdown === "mydex" && (
          <ul className="submenu">
            <li>
              <Link to="/stu/loanapplicationpage" className="submenu-link">
                포인트 대출
              </Link>
            </li>
            <li>
              <Link to="/stu/mydexpointapplication" className="submenu-link">
                MYDEX 온도 포인트 장학금
              </Link>
            </li>
            <li>
              <Link to="/stu/mydexpointtablepage" className ="submenu-link" >MYDEX 온도 포인트 거래내역</Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default NavBar;
