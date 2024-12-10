import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // react-router-dom import 추가
import StudentManagement from './StudentManagement'; // StudentManagement 컴포넌트 import
import RecommendPage from './RecommendPage'; // RecommendPage 컴포넌트 import
import Loginpage from './Loginpage';
import RegPage from './RegPage'; // RegPage 컴포넌트 import
import MydexPoints from './MydexPoints';
import LoanPointHistory from './LoanPointHistory';
import TopGraduates from './TopGraduates';
import Recommendation from './Recommendation'; // Recommendation 컴포넌트 import

function App() {
  return (
    <Router> {/* 라우터로 감싸기 */}
      <div className="App">
        <Routes>
        <Route path="/" element={<Loginpage />} /> {/* 루트 경로에 로그인 페이지 설정 */}
        <Route path="/student-management" element={<StudentManagement />} /> {/* 학생 관리 페이지 */}
        <Route path="/recommend" element={<RecommendPage />} /> {/* 추천 페이지 */}
        <Route path="/regpage" element={<RegPage />} /> {/* 프로그램 등록 페이지 */}
        <Route path="/mydex" element={<MydexPoints />} /> {/* Mydex 페이지 추가 */}
        <Route path="/point" element={<LoanPointHistory />} /> {/* 대출 신청 페이지 추가 */}
        <Route path="/portfolios" element={<TopGraduates />} /> {/* 우수졸업생 카드 페이지 */}
        <Route path="/recommendation" element={<Recommendation />} /> {/* 우수졸업생 상세 페이지 */}
        </Routes>
        
      </div>
      
    </Router>
  );
}

export default App;
