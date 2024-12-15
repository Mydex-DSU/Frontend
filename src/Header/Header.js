import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import LoginPopup from "../stu_f/components/LoginPopup/LoginPopup";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const {
    login,
    logout,
    isStudentLoggedIn,
    isProfessorLoggedIn,
    isAdminLoggedIn,
  } = useContext(AuthContext);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupUserType, setPopupUserType] = useState("student");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("stu_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const openLoginPopup = (type) => {
    setPopupUserType(type);
    setIsPopupOpen(true);
  };

  const handleLoginSuccess = (type, id) => {
    login(type, id);
    setIsPopupOpen(false);
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
      <div className="sw-user-info">
        {isStudentLoggedIn && userId && (
          <a className="sw-user-id" href="/">{`ID: ${userId}`}</a>
        )}
      </div>
      <div className="sw-first-header-title">DSU</div>
      <div className="sw-all-auth-section">
        {/* 학생 로그인/로그아웃 버튼 */}
        {!isStudentLoggedIn ? (
          <button
            className="f1-student-auth-button"
            onClick={() => openLoginPopup("student")}
          >
            학생 로그인
          </button>
        ) : (
          <button
            className="f1-student-auth-button"
            onClick={() => {
              logout("student");
              navigate("/");
            }}
          >
            학생 로그아웃
          </button>
        )}

        {/* 교수 로그인/로그아웃 버튼 */}
        {!isProfessorLoggedIn ? (
          <button
            className="f1-prof-auth-button"
            onClick={() => openLoginPopup("professor")}
          >
            교수 로그인
          </button>
        ) : (
          <button
            className="f1-prof-auth-button"
            onClick={() => {
              logout("professor");
              navigate("/");
            }}
          >
            교수 로그아웃
          </button>
        )}

        {/* 관리자 로그인/로그아웃 버튼 */}
        {!isAdminLoggedIn ? (
          <button
            className="f1-admin-auth-button"
            onClick={() => openLoginPopup("admin")}
          >
            관리자 로그인
          </button>
        ) : (
          <button
            className="f1-admin-auth-button"
            onClick={() => {
              logout("admin");
              navigate("/");
            }}
          >
            관리자 로그아웃
          </button>
        )}
      </div>

      {/* 관리자/교수 페이지 링크 */}
      <div className="sw-admin-prof-links">
        {isAdminLoggedIn && (
          <a href="/adm/admmainpage" className="sw-admin-link">
            관리자 페이지
          </a>
        )}
        {isProfessorLoggedIn && (
          <a href="/pro/promainpage" className="sw-prof-link">
            교수 메인페이지
          </a>
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
