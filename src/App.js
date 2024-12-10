import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import MainPage from "./pages/MainPage";
import ProgramListPage from "./pages/ProgramListPage";
import ProgramDetailPage from "./pages/ProgramDetailPage";
import { UserDataContext } from "./context/userDataContext"; // UserDataContext 가져오기
import axios from "axios";
import ReliefProgramPage from "./pages/ReliefProgramPage/ReliefProgramPage";
import LoanApplicationPage from "./pages/LoanApplicationPage/LoanApplicationPage";

function AppContent() {
  const location = useLocation();

  // 특정 경로에서 NavBar 숨기기
  const showNavBar = location.pathname !== "/";

  return (
    <>
      {showNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/program-list" element={<ProgramListPage />} />
        <Route path="/program-detail" element={<ProgramDetailPage />} />
        <Route path="/relief-programs" element={<ReliefProgramPage />} />
        <Route path="/loan-application" element={<LoanApplicationPage/>} />
      </Routes>
    </>
  );
}

function App() {
  const { setUserData } = useContext(UserDataContext);

  useEffect(() => {
    const stuId = sessionStorage.getItem("stu_id");
    if (stuId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.post("http://100.94.142.127:3000/profile", { stu_id: stuId });
          setUserData(response.data.student_profile);
        } catch (error) {
          console.error("사용자 데이터를 가져오는 데 실패했습니다:", error);
        }
      };

      fetchUserData();
    }
  }, [setUserData]);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
