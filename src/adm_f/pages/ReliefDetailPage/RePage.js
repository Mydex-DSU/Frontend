import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './repage.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import EvaluationPopup from '../../component/detailcomponent/EvaluationPopup';
import AuditPopup from '../../component/detailcomponent/AuditPopup';

const RePage = () => {
  const navigate = useNavigate();
  const [application, setApplication] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showAuditPopup, setShowAuditPopup] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    fetchApplicationList();
  }, []);

  const fetchApplicationList = async () => {
    try {
      const adminString = sessionStorage.getItem('admin');
      const admin = JSON.parse(adminString);
      const response = await axios.get(`http://100.94.142.127:3000/remedialprogram`, {
        params: { adm_id: admin.adm_id },
      });
      setApplication(response.data.remedial_program_application_list);
    } catch (error) {
      console.error('구제 프로그램 신청 목록을 가져오는 데 실패했습니다:', error);
    }
  };

  const handleBack = () => {
    navigate('/adm/admmainpage');
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
      detail: '최고의 기준 향상도',
      points: [
        '300점 이상 학생 - 5포인트',
        '250점 이상 학생 - 4포인트',
        '200점 이상 학생 - 3포인트',
        '150점 이상 학생 - 2포인트',
        '100점 이상 학생 - 1포인트'
      ],
      note: '향상 전 CBT 최고점이 300점 미만인 학생 제외'
    },
    {
      category: '봉사',
      detail: '낙동강/소록도/해비타트',
      points: '각 2포인트',
      note: '전공 관련 봉사는 학습 포인트 지급 하지 않음'
    },
    {
      category: '자원봉사',
      detail: '외부기관 자원봉사',
      points: '시간과 관계 없이 회당 1포인트(학기당 10회만 인정)',
      note: '자원봉사는 형태와 기관이 달라도 학기당 10회만 인정함 (학점 부여 없는  활동만 해당) 재학 기간 중 최대 20점'
    },
    {
      category: '기타 서포터즈',
      detail: '교내.외 서포터즈 활동',
      points: '3포인트',
      note: '학기당 1회만 인정'
    },
    {
      category: '금연 클리닉',
      detail: '보건소 금연클리닉 6개월 성공 수료증',
      points: '3포인트',
      note: '보건소 발급(재학 기간 중 1회 한정)'
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
      category: '동서글로벌 프로그램 참여',
      detail: '직전학기 평점 3.5 이상',
      points: '3포인트',
      note: ''
    },
    {
      category: '동서스피치장학',
      detail: '직전학기 평점 3.8 이상',
      points: '5포인트',
      note: ''
    }
  ];

  // 페이지네이션 로직
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = application.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="adm_relief-program">
      <h2>구제 프로그램 신청 목록</h2>
      <table className="adm_program-table">
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
      <button className="adm_back-button" onClick={handleBack}>뒤로가기</button>
      <div className="adm_application-list">
        <h2>신청학생 목록</h2>
        <table className="adm_re-table">
          <thead>
            <tr>
              <th>구제프로그램 이름</th>
              <th>학생학번</th>
              <th>학생이름</th>
              <th>신청날짜</th>
              <th>자격증명서류</th>
              <th>처리결과</th>
              <th>처리날짜</th>
              <th>심사내용</th>
              <th>평가</th>
            </tr>
          </thead>
          <tbody>
            {currentItems && currentItems.length > 0 ? (
              currentItems.map((app, index) => (
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
                    {app.processing_result === 1 ? '승인' : app.processing_result === 0 ? '거절' : ''}
                  </td>
                  <td>{app.processing_datetime ? formatDate(app.processing_datetime) : ''}</td>
                  <td>
                    {app.processing_result !== null ? (
                      <button className="adm_view-details-button" onClick={() => handleViewDetails(app)}>상세보기</button>
                    ) : (
                      app.rejection_reason || ''
                    )}
                  </td>
                  <td>
                    {app.processing_result === null ? (
                      <button className="adm_evaluate-button" onClick={() => handleEvaluate(app)}>평가하기</button>
                    ) : (
                      '평가 완료'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="adm_pagination">
  <button 
    className="adm_arrow-button"
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
  >
    &lt;
  </button>
  {Array.from({ length: Math.ceil(application.length / itemsPerPage) }, (_, i) => (
    <button
      key={i}
      onClick={() => paginate(i + 1)}
      className={`adm_page-button ${currentPage === i + 1 ? 'adm_active' : ''}`}
    >
      {i + 1}
    </button>
  ))}
  <button 
    className="adm_arrow-button"
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === Math.ceil(application.length / itemsPerPage)}
  >
    &gt;
  </button>
</div>

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
