import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './repage.css';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import EvaluationPopup from '../../../detailcomponent/EvaluationPopup';
import AuditPopup from '../../../detailcomponent/AuditPopup';

const RePage = () => {
  const navigate = useNavigate();
  const [application, setApplication] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showAuditPopup, setShowAuditPopup] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    fetchApplicationList();
  }, []);

  const fetchApplicationList = async () => {
    try {
      const userString = sessionStorage.getItem('user');
      const user = JSON.parse(userString);

      if (!user || !user.adm_id) {
        console.error('사용자 정보가 없습니다.');
        return;
      }

      const response = await axios.get(`http://100.94.142.127:3000/remedialprogram`, {
        params: { stu_id: user.stu_id },
      });
      setApplication(response.data.remedialprogramapplicationlist);
    } catch (error) {
      console.error('구제 프로그램 신청 목록을 가져오는 데 실패했습니다:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '처리 안 됨';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const handleEvaluate = (app) => {
    setCurrentApp(app);
    setIsEvaluating(true);
    setShowPopup(true);
  };

  const handleViewDetails = (app) => {
    setCurrentApp(app);
    setShowAuditPopup(true);
  };

  const handleEvaluationSubmit = async (isApproved, points, rejectionReason) => {
    try {
      const endpoint = 'http://100.94.142.127:3000/remedialprogram/application';
      const payload = {
        stu_id: currentApp.stu_id,
        remedialprogram_application_id: currentApp.remedialprogram_application_id,
        processing_result: isApproved ? 1 : 0,
        granted_mydex_points: isApproved ? parseInt(points) : 0
      };

      if (!isApproved) {
        payload.rejection_reason = rejectionReason;
      }

      const response = await axios.post(endpoint, payload);
      alert(response.data.message);
      await fetchApplicationList();
    } catch (error) {
      console.error('평가 제출 중 오류 발생:', error);
    }
    setShowPopup(false);
    setIsEvaluating(false);
  };

  const programData = [
    {
      category: 'CBT 합성도',
      detail: '최고의 기준 합성도',
      points: [
        '300점 이상 학생 - 5포인트',
        '250점 이상 학생 - 4포인트',
        '200점 이상 학생 - 3포인트',
        '150점 이상 학생 - 2포인트',
        '100점 이상 학생 - 1포인트'
      ],
      note: '평상 전 CBT 최고점이 300점 미만인 학생 제외'
    },
    {
      category: '봉사',
      detail: '노블리지/스폰트/레버리티',
      points: '각 2포인트',
      note: '전공 관련 봉사는 학습 포인트 지급 하지 않음'
    },
    {
      category: '자원봉사',
      detail: '외부기관 자원봉사',
      points: '시간과 관계 없이 하루 1포인트(학기당 10회만 인정)',
      note: '자원봉사는 행대와 기관이 달라도 학기당 10회만 인정함 (정해 들어 있는 활동만 인정) 지원 기간 중 최대 20회'
    },
    {
      category: '기타 서포터즈',
      detail: '교내외 서포터즈 활동',
      points: '3포인트',
      note: '학기당 1회만 인정'
    },
    {
      category: '금연 클리닉',
      detail: '보건소 금연클리닉 6개월 성공 수료증',
      points: '3포인트',
      note: '보건소 발급(지원 기간 중 1회 한정)'
    },
    {
      category: '외국어자격증',
      detail: '3. 외국어 자격증 표 참조',
      points: '3포인트',
      note: ''
    },
    {
      category: '전공 자격증',
      detail: '4. 전공 자격증 표 참조',
      points: '3포인트',
      note: ''
    },
    {
      category: '모범장학',
      detail: '직전학기 평점 3.50이상, 이수학점 15학점이상 (4학년 9학점이상), 학부별 자체선발 기준 (1학년 2학기부터 수혜 가능',
      points: '5포인트',
      note: ''
    },
    {
      category: '통서글로벌 프로그램 참여',
      detail: '직전학기 평점 3.5 이상',
      points: '3포인트',
      note: ''
    },
    {
      category: '특성화파견장학',
      detail: '직전학기 평점 3.8 이상',
      points: '5포인트',
      note: ''
    }
  ];

  return (
    <div className="relief-program">
      <h2>구제 프로그램 신청 목록</h2>
      <table>
        <thead>
          <tr>
            <th>항목</th>
            <th>세부 사항</th>
            <th>각 배점 기준</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {programData.map((item, index) => (
            <tr key={index}>
              <td>{item.category}</td>
              <td>{item.detail}</td>
              <td>{Array.isArray(item.points) ? 
                item.points.map((point, idx) => (
                  <div key={idx}>{point}</div>
                )) : item.points}
              </td>
              <td>{item.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleBack}>뒤로가기</button>
      <div>
        <h2>신청학생 목록</h2>
        <table className="re-table">
          <thead>
            <tr>
              <th>구제프로그램 이름</th>
              <th>학생학번</th>
              <th>학생이름</th>
              <th>신청날짜</th>
              <th>자격증명서류</th>
              <th>처리결과</th>
              {/* <th>온도포인트</th> */}
              <th>처리날짜</th>
              <th>심사내용</th>
              <th>평가</th>
            </tr>
          </thead>
          <tbody>
            {application && application.length > 0 ? (
              application.map((app, index) => (
                <tr key={index}>
                  <td>{app.remedialprogram_name}</td>
                  <td>{app.stu_id}</td>
                  <td>{app.stu_name}</td>
                  <td>{formatDate(app.remedialprogram_application_datetime)}</td>
                  <td>
                    {app.qualification_documents ? (
                      <a href={app.qualification_documents} target="_blank" rel="noopener noreferrer">
                        PDF 보기
                      </a>
                    ) : (
                      '없음'
                    )}
                  </td>
                  <td>
                    {app.processing_result === 1
                      ? '승인'
                      : app.processing_result === 0
                      ? '거절'
                      : ''}
                  </td>
                  {/* <td>{app.granted_mydex_points || '미부여'}</td> */}
                  <td>{app.processing_datetime ? formatDate(app.processing_datetime) : ''}</td>
                  <td>
                    {app.processing_result !== null ? (
                      <button onClick={() => handleViewDetails(app)}>상세보기</button>
                    ) : (
                      app.rejection_reason || ''
                    )}
                  </td>
                  <td>
                    {app.processing_result === null ? (
                      <button onClick={() => handleEvaluate(app)}>평가하기</button>
                    ) : (
                      '평가 완료'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showPopup && isEvaluating && (
        <EvaluationPopup
          onClose={() => {
            setShowPopup(false);
            setIsEvaluating(false);
          }}
          onSubmit={handleEvaluationSubmit}
          currentApp={currentApp}
        />
      )}
      {showAuditPopup && (
        <AuditPopup
          onClose={() => setShowAuditPopup(false)}
          application={currentApp}
        />
      )}
    </div>
  );
};

export default RePage;