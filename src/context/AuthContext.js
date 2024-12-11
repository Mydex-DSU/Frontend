import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [isProfessorLoggedIn, setIsProfessorLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [renderKey, setRenderKey] = useState(0); // 페이지 재랜더링 트리거 키

  useEffect(() => {
    // sessionStorage에서 로그인 상태 복원
    const studentLoggedIn = sessionStorage.getItem("stu_id");
    const professorLoggedIn = sessionStorage.getItem("pro_id");
    const adminLoggedIn = sessionStorage.getItem("adm_id");

    if (studentLoggedIn) setIsStudentLoggedIn(true);
    if (professorLoggedIn) setIsProfessorLoggedIn(true);
    if (adminLoggedIn) setIsAdminLoggedIn(true);
  }, []);

  const triggerRender = () => {
    setRenderKey((prevKey) => prevKey + 1); // 키 값을 변경하여 재랜더링 트리거
  };

  const login = (type, id) => {
    if (type === "student") {
      setIsStudentLoggedIn(true);
      sessionStorage.setItem("stu_id", id);
    } else if (type === "professor") {
      setIsProfessorLoggedIn(true);
      sessionStorage.setItem("pro_id", id);
    } else if (type === "admin") {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem("admin", id);
    }
    triggerRender();
  };

  const logout = (type) => {
    if (type === "student") {
      setIsStudentLoggedIn(false);
      sessionStorage.removeItem("stu_id");
    } else if (type === "professor") {
      setIsProfessorLoggedIn(false);
      sessionStorage.removeItem("pro_id");
    } else if (type === "admin") {
      setIsAdminLoggedIn(false);
      sessionStorage.removeItem("admin");
    }
    triggerRender();
  };

  return (
    <AuthContext.Provider
      value={{
        isStudentLoggedIn,
        isProfessorLoggedIn,
        isAdminLoggedIn,
        login,
        logout,
        renderKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
