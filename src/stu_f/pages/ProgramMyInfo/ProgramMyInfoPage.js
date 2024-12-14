import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgramMyInfoPage.css';

const SurveyPopup = ({ onClose, onSubmit, programId }) => {
  const [responses, setResponses] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
    question6: '',
    feedback: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setResponses((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('설문조사 결과:', responses);
    onSubmit(programId, responses);
    onClose();
  };

  return (
    <div className="pro3popup-overlay">
      <div className="pro3popup-content">
        <h2>설문조사</h2>
        <p>프로그램 ID: {programId}</p>
        <table className="pro3survey-table">
          <thead>
            <tr>
              <th>설문 문항</th>
              <th>전혀 그렇지 않다</th>
              <th>그렇지 않다</th>
              <th>보통이다</th>
              <th>그렇다</th>
              <th>매우 그렇다</th>
            </tr>
          </thead>
          <tbody>
            {['question1', 'question2', 'question3', 'question4', 'question5', 'question6'].map((question, index) => (
              <tr key={question}>
                <td>{`${index + 1}. ${['본 프로그램이 도움이 되었다.', '다른 사람에게도 추천하겠다.', '다음에도 참여하겠다.'][index % 3]}`}</td>
                {[1, 2, 3, 4, 5].map((value) => (
                  <td key={value}>
                    <input
                      type="radio"
                      name={question}
                      value={value}
                      onChange={handleChange}
                      checked={responses[question] === value.toString()}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pro3feedback-section">
          <label>개선해야 할 점이 있다면 작성해주세요:</label>
          <textarea
            name="feedback"
            placeholder="여기에 입력하세요..."
            value={responses.feedback}
            onChange={handleChange}
          />
        </div>
        <div className="pro3popup-actions">
          <button className="pro3submit-button" onClick={handleSubmit}>
            완료
          </button>
          <button className="pro3cancel-button" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

const NoShowPopup = ({ onClose, onSubmit, programId }) => {
  const [selectedReason, setSelectedReason] = useState('');

  const [reasons, setReasons] = useState([]);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const response = await axios.get('http://100.94.142.127:3000/survey/noshowreasoncategory');
        console.log(response.data)
        if (response.data ) {
          setReasons(response.data.noshow_reason_category);
        } else {
          console.error('유효하지 않은 응답 데이터:', response.data);
        }
      } catch (error) {
        console.error('노쇼 사유를 불러오는 데 실패했습니다.', error);
      }
    };

    fetchReasons();
  }, []);

  const userId = sessionStorage.getItem("stu_id");

  const handleSubmit = async() => {
    if (!selectedReason) {
      alert('노쇼 사유를 선택해주세요.');
      return;
    }
    try {
      const response = await axios.post('http://100.94.142.127:3000/survey/noshow', {
        noshowreasoncategories_id: selectedReason,
        stu_id: userId,
        program_id: programId,
      });
      console.log('노쇼 조사 API 응답 반환값:', response.data);


      onSubmit(programId, { noshowreasoncategories_id: selectedReason });

      // Update participation status to "참여 완료" and enable 상세 정보 보기
      setReasons((prevReasons) =>
        prevReasons.map((reason) =>
          reason.program_id === programId
            ? { ...reason, no_show_reason_response_status: 1, noshowreasoncategories_name: '참여 완료' }
            : reason
        )
      );

      onClose();
    } catch (error) {
      console.error('노쇼 응답 제출에 실패했습니다.', error);
      alert('노쇼 응답 제출에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="pro3popup-overlay">
      <div className="pro3popup-content">
        <h2>노쇼 사유</h2>
        <p>아래 카테고리 중 하나를 선택해주세요.</p>
        <table className="pro3noshow-table">
          <tbody>
            {reasons.map((reason) => (
              <tr key={reason.noshowreasoncategories_id}>
                <td>{reason.noshowreasoncategories_name}</td>
                <td>
                  <input
                    type="radio"
                    name="noshow-reason"
                    value={reason.noshowreasoncategories_id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pro3popup-actions">
          <button className="pro3submit-button" onClick={handleSubmit}>
            완료
          </button>
          <button className="pro3cancel-button" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};


const DetailPopup = ({ onClose, reason }) => {
  return (
    <div className="pro3popup-overlay">
      <div className="pro3popup-content">
        <h2>노쇼 상세</h2>
        <p>{reason}</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

const MyDexInfo = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [popupProgramId, setPopupProgramId] = useState(null);
  const [popupType, setPopupType] = useState(null); // "survey" or "noshow"
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detailReason, setDetailReason] = useState('');

  const userId = sessionStorage.getItem("stu_id");
  console.log(userId)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post('http://100.94.142.127:3000/profile/participation/programlist', {
          stu_id: userId,
        });

        console.log(response.data)

        if (response.data && response.data.participationProgramList) {
          setData(response.data.participationProgramList);
        } else {
          setError('데이터가 없습니다.');
        }
      } catch (error) {
        setError('데이터를 불러오는 데 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPrograms = data.filter((item) =>
    item.program_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const openPopup = (programId, type, reason = '') => {
    setPopupProgramId(programId);
    setPopupType(type);
    if (type === 'detail') {
      setDetailReason(reason);
    }
  };

  const closePopup = () => {
    setPopupProgramId(null);
    setPopupType(null);
    setDetailReason('');
  };

  const handleSurveySubmit = (programId, responses) => {
    console.log('설문조사 결과:', responses);
    // 설문 제출 API 호출 추가 가능
  };

  const handleNoShowSubmit = (programId, responses) => {
    console.log('노쇼 조사 결과:', responses);
    // 노쇼 조사 제출 API 호출 추가 가능
  };

  return (
    <div className="pro3mydex-container">
      <div className="pro3notice-header">
        <h1 className="pro3header-title">MyDex 온도 포인트 지급 범위 안내</h1>
      </div>

      <section className="pro3notice-content">
        <div className="pro3notice-item">
          <p className="pro3notice-title">설문조사 미참여 시 포인트 미지급</p>
          <p>설문조사를 참여하지 않을 경우 MyDex 온도 포인트를 받지 못합니다.</p>
        </div>
        <div className="pro3notice-item">
          <p className="pro3notice-title">노쇼 조사 참여 시 부여된 마이너스 포인트에서 1점 차감</p>
          <p>프로그램 참여도가 낮아 MyDex 온도 포인트가 차감될 경우 노쇼조사 참여 시 차감된 포인트에서 1점이 제외됩니다.</p>
        </div>
        <div className="pro3notice-item">
          <p className="pro3notice-title">경고 회수</p>
          <p>학생의 경고 회수가 1회 이상일 때 프로그램 참여도가 낮아 마이너스 포인트를 받을 경우 1점이 더 차감됩니다.</p>
        </div>
      </section>

      <h2 className="pro3title">학생 비교과 프로그램 참여 목록</h2>

      <div className="pro3search-container">
        <input
          type="text"
          placeholder="프로그램 이름을 검색하세요"
          value={searchQuery}
          onChange={handleSearchChange}
          className="pro3search-input"
        />
      </div>

      {loading && <p>로딩 중...</p>}
      {error && <p className="pro3error-message">{error}</p>}

      <table className="pro3points-table">
        <thead>
          <tr>
            <th>프로그램 이름</th>
            <th>종류</th>
            <th>출석률</th>
            <th>참여여부</th>
            <th>보고서 제출</th>
            <th>수상 성적</th>
            <th>참여상태</th>
            <th>최종 부여받은 온도 포인트</th>
            <th>설문조사</th>
            <th>노쇼조사</th>
            <th>운영상태</th>
            <th>상세 정보</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <tr key={index}>
                <td>{item.program_name}</td>
                <td>{item.programtype_name}</td>
                <td>{item.attendance_rate || ''}%</td>
                <td>{item.participation_status || ''}</td>
                <td>{item.report_submission_status ? '완료' : '미완료'}</td>
                <td>{item.awardStatus || '없음'}</td>
                <td>{item.participation_status || '참여중'}</td>
                <td>
                  {item.response_status_change_mydex_points !== null
                    ? `${item.response_status_change_mydex_points} 포인트`
                    : '대기중'}
                  </td>
                <td>
                  {item.program_status === '설문조사' && item.stu_give_mydex_points >= 0 && item.survey_response_status !== 1 ? (
                    <button
                      className="pro3survey-button"
                      onClick={() => openPopup(item.program_id, 'survey')}
                    >
                      설문조사
                    </button>
                  ): item.survey_response_status === 1 ? (
                    <span>참여 완료</span>
                  ) : item.program_status === '종료' && item.survey_response_status === 0 ? (
                    <span>미참여</span>
                  ):('')}
                </td>
                <td>
                  {item.program_status === '설문조사' && item.stu_give_mydex_points < 0 ? (
                    <button
                      className="pro3noshow-button"
                      onClick={() => openPopup(item.program_id, 'noshow')}
                    >
                      노쇼조사
                    </button>
                  ) : item.no_show_reason_response_status === 1 ? (
                    <span>참여 완료</span>
                  ) : item.program_status === '종료' && item.no_show_reason_response_status === 0 ?(
                    <span>미참여</span>
                  ): ('')}
                </td>
                <td>{item.program_status}</td>
                <td>
                  {item.program_status === '종료' && item.noshowreasoncategories_name && (
                    <button
                      onClick={() => openPopup(item.program_id, 'detail', item.noshowreasoncategories_name)}
                    >
                      보기
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12">등록된 프로그램이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />

      {popupType === 'survey' && popupProgramId && (
        <SurveyPopup
          programId={popupProgramId}
          onClose={closePopup}
          onSubmit={handleSurveySubmit}
        />
      )}

      {popupType === 'noshow' && popupProgramId && (
        <NoShowPopup
          programId={popupProgramId}
          onClose={closePopup}
          onSubmit={handleNoShowSubmit}
        />
      )}

      {popupType === 'detail' && detailReason && (
        <DetailPopup
          reason={detailReason}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

const Pagination = ({ totalPages, currentPage, handlePageChange }) => (
  <div className="pro3pagination">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => handlePageChange(index + 1)}
        className={currentPage === index + 1 ? 'active' : ''}
      >
        {index + 1}
      </button>
    ))}
  </div>
);

export default MyDexInfo;
