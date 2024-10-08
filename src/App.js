import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import head from "./image/head.png";
import main from './image/main.png';
import Nav from "./components/Nav";
import Mypage from './page/mypage';
import MainBody from './page/mainBody';
import Login from './page/Login';
import './App.css';
 
function App() {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>
            <img 
              src={head} 
              alt="head icon"
              style={{ cursor: "pointer" }}
              onClick={() => navigate('/')}
            />
          </h1>
        </div>
        <button className="login-button" onClick={openLoginModal}>로그인</button>
      </header>
      <Nav />
      <div className='main-image'>
        <img src={main} alt="main icon"/>
      </div>
      <main>
        <MainBody/>
      </main>
      <Routes>
        <Route path="/mypage" element={<Mypage />} />
        {/* 여기에 다른 라우트들을 추가하세요 */}
      </Routes>
      <Login isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
}

export default App;