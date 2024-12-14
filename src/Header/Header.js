import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import LoginPopup from "../stu_f/components/LoginPopup/LoginPopup";
import { useNavigate } from "react-router-dom";
import "./Header.css"

function Header() {
  const {
    login,
    logout,
    isStudentLoggedIn,
    isProfessorLoggedIn,
    isAdminLoggedIn,
  } = useContext(AuthContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupUserType, setPopupUserType] = useState("student"); // 기본 사용자 유형은 학생
  const navigate = useNavigate();

  const openLoginPopup = (type) => {
    setPopupUserType(type);
    setIsPopupOpen(true);
  };

  const handleLoginSuccess = (type, id) => {
    login(type, id); // AuthContext에서 상태 업데이트
    setIsPopupOpen(false); // 팝업 닫기
    if (type === "student") {
      navigate("/");
    } else if (type === "professor") {
      navigate("/pro/promainpage");
    } else if (type === "admin") {
      navigate("/adm/admmainpage");
    }
  };

  return (
    <header className="sw-first-header">
      <div className="sw-first-header-title">DSU</div>
      <div className="sw-all-auth-section">
        {isStudentLoggedIn && (
          <button
            className="f1-student-auth-button"
            onClick={() => {
              logout("student");
              navigate("/"); // 로그아웃 후 메인 페이지로 이동
            }}
          >
            학생 로그아웃
          </button>
        )}
        {isProfessorLoggedIn && (
          <button
            className="f1-prof-auth-button"
            onClick={() => {
              logout("professor");
              navigate("/"); // 로그아웃 후 메인 페이지로 이동
            }}
          >
            교수 로그아웃
          </button>
        )}
        {isAdminLoggedIn && (
          <button
            className="f1-admin-auth-button"
            onClick={() => {
              logout("admin");
              navigate("/"); // 로그아웃 후 메인 페이지로 이동
            }}
          >
            관리자 로그아웃
          </button>
        )}
        {!isStudentLoggedIn && (
          <button
            className="f1-student-auth-button"
            onClick={() => openLoginPopup("student")}
          >
            학생 로그인
          </button>
        )}
        {!isProfessorLoggedIn && (
          <button
            className="f1-prof-auth-button"
            onClick={() => openLoginPopup("professor")}
          >
            교수 로그인
          </button>
        )}
        {!isAdminLoggedIn && (
          <button
            className="f1-admin-auth-button"
            onClick={() => openLoginPopup("admin")}
          >
            관리자 로그인
          </button>
        )}
      </div>

      {isPopupOpen && (
        <LoginPopup
          onClose={() => setIsPopupOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          initialUserType={popupUserType}
        />
      )}
    </header>
  );
}

export default Header;
