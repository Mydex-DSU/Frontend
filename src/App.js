import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { UserDataContext } from "./context/userDataContext.js"; // UserDataContext 가져오기
import axios from "axios";

//학생관련

import MainPage from "./stu_f/pages/MainPage/MainPage";
import ProgramListPage from "./stu_f/pages/ProgramListPage/ProgramListPage";
import ProgramDetailPage from "./stu_f/pages/ProgramDetailPage/ProgramDetailPage";
import ReliefProgramPage from "./stu_f/pages/ReliefProgramPage/ReliefProgramPage";
import LoanApplicationPage from "./stu_f/pages/LoanApplicationPage/LoanApplicationPage";
import AdmNavBar from "./adm_f/component/admNav/admNav.js";
import StudentNavBar from "./stu_f/components/NavBar/NavBar"


//관리자

import AdmMainPage from "./adm_f/pages/admMainPage.js";
import CompleteDetail from "./adm_f/pages/CompleteDetail/CompleteDetail.js"
import CompleteProgram from "./adm_f/pages/CompleteProgram/CompleteProgram.js";
import ApplicationProgram from "./adm_f/pages/ApplicationProgram/ApplicationProgram.js";
import EvaluationDetail from "./adm_f/pages/EvaluationDetail/EvaluationDetail.js";
import ProgramList from "./adm_f/pages/ProgramList/ProgramList.js";
import ProgramRegistration from "./adm_f/pages/ProgramRegistration/ProgramRegistration.js";
import ReliefProgram from "./adm_f/pages/ReliefDetailPage/RePage.js";


// 교수

import ProMainPage from "./pro_f/pages/MainPage/proMainPage.js";
import ProRecommendPage from "./pro_f/pages/RecommendPage/proRecommend.js"
import ProRegPage from "./pro_f/pages/RegPage/proRegPage.js";
import RecommendDetail from "./stu_f/pages/RecommendDetailPage/RecommendDetailPage.js";





function AppContent() {
  const location = useLocation();

  // 특정 경로마다 보여지는 네비바가 다르게 해줍니다. 참고하세요.
  const showNavBar = location.pathname !== "/";
  const isAdminPage = location.pathname.startsWith("/adm");
  const isStudentPage = location.pathname.startsWith("/stu");

  return (
    <>
      {showNavBar && (
        <>
          {isAdminPage && <AdmNavBar/>}
          {isStudentPage && <StudentNavBar/>}
        </>
      )}
      <Routes>
          {/* 학생 라우트  */}
        <Route path="/" element={<MainPage/>} />
        <Route path="/stu/programlistpage" element={<ProgramListPage/>}/>
        <Route path="/stu/programdetailpage" element={<ProgramDetailPage/>}/>
        <Route path="/stu/loanapplicationpage" element={<LoanApplicationPage/>}/>
        <Route path="/stu/reliefprogrampage" element={<ReliefProgramPage/>}/>


        {/* 관리자 라우트 */}
      <Route path="/adm/admmainpage" element={<AdmMainPage/>}/>
      <Route path="/adm/completedetail" element={<CompleteDetail/>}/>
      <Route path="/adm/completeprogram" element={<CompleteProgram/>}/>
      <Route path="/adm/applicationprogram" element={<ApplicationProgram/>}/>
      <Route path="/adm/evaluationdetail" element={<EvaluationDetail />}/>
      <Route path="/adm/programregistration" element={<ProgramRegistration/>}/>
      <Route path="/adm/reliefprogram" element={<ReliefProgram/>}/>
      <Route path="/adm/programlist" element={<ProgramList/>}/>

        {/* 교수 라우트 */}
      <Route path="/pro/promainpage" element={<ProMainPage/>}/>
      <Route path="/pro/prorecommendpage" element={<ProRecommendPage/>}/>
      <Route path="/pro/proregpage" element={<ProRegPage/>}/>
      <Route path="/pro/prorecommenddetailpage" element={<RecommendDetail/>}/>



      </Routes>
    </>
  );
}



function App(){
  const{setUserData} = useContext(UserDataContext);

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


  return(
    <Router>
      <AppContent/>
    </Router>


  );
}

export default App;



