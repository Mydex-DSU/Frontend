import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../../../context/userDataContext";
import "./MainPage.css";
import LoginPopup from "../../components/LoginPopup/LoginPopup";
import NavBar from "../../components/NavBar/NavBar";
import MydexPoints from "../../components/MydexPoints/MydexPoints";
import WarningAlert from "../../components/WarningAlert/WarningAlert";
import LoanTemperaturePoint from "../../components/LoanTempPoint/LoanTempPoint";
import ReliefProgram from "../../components/ReliefProgram/ReliefProgram";
import ParticipatingPrograms from "../../components/ParticipatingPrograms/ParticipatingPrograms";
import NoshowList from "../../components/NoshowList/Noshowlist";
import GraduateCardSlider from "../../components/GraduateCard/GraduateCardSlider";
import DepartReTempPoint from "../../components/DepartReTempPoints/DepartReTempPoints";
import ParticipatingProgramsHeader from "../../components/ParticipatingProgramsHeader/ParticipatingProgramsHeader";
import GraduateCardHeader from "../../components/GraduateCardHeader/GraduateCardHeader";
import NoShowHeader from "../../components/NoShowHeader/NoShowHeader";
import axios from "axios";

function MainPage() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(""); // "student" or "professor"
  const { userData, setUserData } = useContext(UserDataContext);
  const [userPrograms, setUserPrograms] = useState([]);
  const [noShowHistory, setNoShowHistory] = useState([]);
  const [departReTemp, setDepartReTemp] = useState([]);

  const fetchUserData = useCallback(async (stuId) => {
    try {
      const response = await axios.post("http://100.94.142.127:3000/profile", { stu_id: stuId });
      setUserData(response.data.student_profile);
    } catch (error) {
      console.error("사용자 데이터를 가져오는 데 실패했습니다:", error);
    }
  }, [setUserData]);

  const fetchUserProgram = async (stuId) => {
    try {
      const response = await axios.post("http://100.94.142.127:3000/stuprogram", { stu_id: stuId });
      setUserPrograms(response.data.student_join_programs || []);
    } catch (error) {
      console.error("프로그램 데이터를 가져오는 데 실패했습니다:", error);
    }
  };

  const fetchNoShowHistory = async (stuId) => {
    try {
      const response = await axios.post("http://100.94.142.127:3000/profile/noshowhistory", { stu_id: stuId });
      setNoShowHistory(response.data.studentnoshowhistory || []);
    } catch (error) {
      console.error("노쇼 데이터를 가져오는 데 실패했습니다:", error);
    }
  };

  const fetchDepartReTemp = async (stuId) => {
    try {
      const response = await axios.post("http://100.94.142.127:3000/profile/remainfacultypoints", { stu_id: stuId });
      setDepartReTemp(response.data.facultyInfo || []);
    } catch (error) {
      console.error("학부 온도 데이터를 가져오는 데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    const stuId = sessionStorage.getItem("stu_id");
    if (stuId) {
      setIsLoggedIn(true);
      setUserType("student");
      fetchUserData(stuId);
      fetchUserProgram(stuId);
      fetchDepartReTemp(stuId);
      fetchNoShowHistory(stuId);
    }
  }, [fetchUserData]);

  const handleLogout = () => {
    sessionStorage.removeItem("stu_id");
    sessionStorage.removeItem("pro_id");
    setIsLoggedIn(false);
    setUserType("");
    setUserData(null);
    setUserPrograms([]);
    setNoShowHistory([]);
    setDepartReTemp([]);
  };

  const handleLoginSuccess = (type, id) => {
    setIsLoggedIn(true);
    setUserType(type);
    if (type === "student") {
      sessionStorage.setItem("stu_id", id);
      fetchUserData(id);
      fetchUserProgram(id);
      fetchDepartReTemp(id);
      fetchNoShowHistory(id);
    } else if (type === "professor") {
      sessionStorage.setItem("pro_id", id);
      navigate("/pro/promainpage"); // Redirect to ProMainPage
    }
  };

  const goToAdmMainPage = () => {
    navigate("/adm/admMainPage"); // Navigate to admin main page
  };

  return (
    <div className="main-container">
      <div className="auth-button-container">
        {!isLoggedIn ? (
          <button className="auth-button" onClick={() => setIsPopupOpen(true)}>
            로그인
          </button>
        ) : (
          <button className="auth-button" onClick={handleLogout}>
            로그아웃
          </button>
        )}
        <button className="auth-button adm-login-btn" onClick={goToAdmMainPage}>
          관리자 로그인
        </button>
        <button className="auth-button prof-login-btn" onClick={() => setIsPopupOpen(true)}>
          교수 로그인
        </button>
      </div>
      {isPopupOpen && (
        <LoginPopup
          onClose={() => setIsPopupOpen(false)}
          onLoginSuccess={handleLoginSuccess} // Pass login success callback
        />
      )}
      <NavBar />
      {isLoggedIn && userType === "student" && userData && (
        <>
          <div className="profile-component">
            <MydexPoints userData={userData} />
            <WarningAlert userData={userData} />
          </div>
          <div className="horizontal-container">
            <LoanTemperaturePoint
              userData={userData}
              onLoanClick={() => navigate("/loan-application")} // Navigate to loan application page
            />
            <ReliefProgram userData={userData} />
          </div>
          <ParticipatingProgramsHeader />
          <ParticipatingPrograms userPrograms={userPrograms} />
          <NoShowHeader />
          <NoshowList noShowHistory={noShowHistory} />
          <GraduateCardHeader />
          <GraduateCardSlider />
          <DepartReTempPoint departReTemp={departReTemp} />
        </>
      )}
    </div>
  );
}

export default MainPage;



// import React, { useState, useEffect, useContext, useCallback  } from "react";
// import { UserDataContext } from "../../../context/userDataContext";
// import { useNavigate } from "react-router-dom";
// import "./MainPage.css";
// import MydexPoints from "../../components/MydexPoints/MydexPoints";
// import WarningAlert from "../../components/WarningAlert/WarningAlert";
// import LoanTemperaturePoint from "../../components/LoanTempPoint/LoanTempPoint";
// import ReliefProgram from "../../components/ReliefProgram/ReliefProgram";
// import ParticipatingPrograms from "../../components/ParticipatingPrograms/ParticipatingPrograms";
// import NoshowList from "../../components/NoshowList/Noshowlist";
// import GraduateCardSlider from "../../components/GraduateCard/GraduateCardSlider";
// import DepartReTempPoint from "../../components/DepartReTempPoints/DepartReTempPoints";
// import LoginPopup from "../../components/LoginPopup/LoginPopup";
// import axios from "axios";
// import NavBar from "../../components/NavBar/NavBar";
// import ParticipatingProgramsHeader from "../../components/ParticipatingProgramsHeader/ParticipatingProgramsHeader";
// import GraduateCardHeader from "../../components/GraduateCardHeader/GraduateCardHeader";
// import NoShowHeader from "../../components/NoShowHeader/NoShowHeader";

// function MainPage() {
//   const navigate = useNavigate();
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const { userData, setUserData } = useContext(UserDataContext);
//   const [userPrograms, setUserPrograms] = useState([]);
//   const [noShowHistory, setNoShowHistory] = useState([]);
//   const [departReTemp, setDepartReTemp] = useState([]);


 

//   const fetchUserData = useCallback(async (stuId) => {
//     try {
//       const response = await axios.post("http://100.94.142.127:3000/profile", { stu_id: stuId });
//       setUserData(response.data.student_profile);
//     } catch (error) {
//       console.error("사용자 데이터를 가져오는 데 실패했습니다:", error);
//     }
//   }, [setUserData]);

//   const fetchUserProgram = async (stuId) => {
//     try {
//       const response = await axios.post("http://100.94.142.127:3000/stuprogram", { stu_id: stuId });
//       setUserPrograms(response.data.student_join_programs || []);
//     } catch (error) {
//       console.error("프로그램 데이터를 가져오는 데 실패했습니다:", error);
//     }
//   };

//   const fetchNoShowHistory = async (stuId) => {
//     try {
//       const response = await axios.post(
//         "http://100.94.142.127:3000/profile/noshowhistory",
//         { stu_id: stuId }
//       );
//       setNoShowHistory(response.data.studentnoshowhistory || []);
//     } catch (error) {
//       console.error("노쇼 데이터를 가져오는 데 실패했습니다:", error);
//     }
//   };

//   const fetchDepartReTemp = async (stuId) => {
//     try {
//       const response = await axios.post(
//         "http://100.94.142.127:3000/profile/remainfacultypoints",
//         { stu_id: stuId }
//       );
//       setDepartReTemp(response.data.facultyInfo || []);
//     } catch (error) {
//       console.error("학부 온도 데이터를 가져오는 데 실패했습니다:", error);
//     }
//   };

//   useEffect(() => {
//     const stuId = sessionStorage.getItem("stu_id");
//     if (stuId) {
//       setIsLoggedIn(true);
//       fetchUserData(stuId);
//       fetchUserProgram(stuId);
//       fetchDepartReTemp(stuId);
//       fetchNoShowHistory(stuId);
//     }
//   }, []);

//   const handleLogout = () => {
//     sessionStorage.removeItem("stu_id");
//     setIsLoggedIn(false);
//     setUserData(null);
//     setUserPrograms([]);
//     setNoShowHistory([]);
//     setDepartReTemp([]);
//   };

//   const goToadmMainPage= () => {
//     navigate("/adm/admMainPage"); // 관리자 메인페이지 이동
//   };
  

//   return (
//     <div className="main-container">
//       <div className="auth-button-container">
//         {!isLoggedIn ? (
//           <button className="auth-button" onClick={() => setIsPopupOpen(true)}>
//             로그인
//           </button>
//         ) : (
//           <button className="auth-button" onClick={handleLogout}>
//             로그아웃
//           </button>
//         )}


//         <button className="auth-button adm-login-btn" onClick={goToadmMainPage}>관리자 로그인</button>
      

//       </div>
//       {isPopupOpen && (
//         <LoginPopup
//           onClose={() => setIsPopupOpen(false)}
//           onLoginSuccess={() => {
//             setIsLoggedIn(true);
//             const stuId = sessionStorage.getItem("stu_id");
//             fetchUserData(stuId);
//             fetchUserProgram(stuId);
//             fetchDepartReTemp(stuId);
//           }}
//         />
//       )}
//       <NavBar />
//       {isLoggedIn && userData && (
//         <>
//           <div className="profile-component">
//             <MydexPoints userData={userData} />
//             <WarningAlert userData={userData} />
//           </div>
//           <div className="horizontal-container">
//             <LoanTemperaturePoint userData={userData} 
//               onLoanClick={() => navigate("/loan-application")} // 온도 대출 버튼 클릭 시 이동
//             />
//             <ReliefProgram userData={userData} />
//           </div>
//           <ParticipatingProgramsHeader/>
//           <ParticipatingPrograms userPrograms={userPrograms} />
//           <NoShowHeader />
//           <NoshowList noShowHistory={noShowHistory} />
//           <GraduateCardHeader/>
//           <GraduateCardSlider />
//           <DepartReTempPoint departReTemp={departReTemp} />
//         </>
//       )}
//     </div>
//   );
// }

// export default MainPage;
