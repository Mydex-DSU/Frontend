import React from "react";
import { Link } from 'react-router-dom';
import './Nav.css';

function Nav() {
  return (
    <div>
      <header>
        <ul className="main-menu">
          <li className="item">
            <div className="item__name">마이페이지</div>
            <div className="item__contents">
              <div className="contents__menu">
                <ul className="inner">
                  <li>
                    <ul>
                      <li><Link to="/mypage">마이페이지</Link></li>
                      <li><Link to="/study-info">학습정보</Link></li>
                      <li><Link to="/study-points">학습포인트</Link></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </li>

          <li className="item">
            <div className="item__name">비교과프로그램</div>
            <div className="item__contents">
              <div className="contents__menu">
                <ul className="inner">
                  <li>
                    <ul>
                      <li><Link to="/extracurricular/intro">비교과프로그램 소개</Link></li>
                      <li><Link to="/extracurricular/application">프로그램 신청현황</Link></li>
                      <li><Link to="/extracurricular/participation">프로그램 참여현황</Link></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </li>

          <li className="item">
            <div className="item__name">동서고금</div>
            <div className="item__contents">
              <div className="contents__menu">
                <ul className="inner">
                  <li>
                    <ul>
                      <li><Link to="/east-west/intro">동서고금 소개</Link></li>
                      <li><Link to="/east-west/list">동서고금 목록</Link></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </li>

          <li className="item">
            <div className="item__name">진단검사</div>
            <div className="item__contents">
              <div className="contents__menu">
                <ul className="inner">
                  <li>
                    <ul>
                      <li><Link to="/core-competency/intro">핵심역량 소개</Link></li>
                      <li><Link to="/core-competency/diagnosis">핵심역량 진단</Link></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </header>
    </div>
  );
}

export default Nav;