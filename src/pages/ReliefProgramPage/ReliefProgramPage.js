import React,{useState, useEffect} from "react";
import "./ReliefProgramPage.css";
import axios from "axios";
import RemedialProgramPopup from "../../../components/RemedialProgramPopup/RemedialProgramPopup"; 

function ReliefProgramPage() {
    
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [applicationHistory, setApplicationHistory] = useState([]);

    const stuId = sessionStorage.getItem("stu_id");

    console.log(stuId);

    const fetchApplicationHistory = async () => {
        try {
          const response = await axios.post(
            "http://100.94.142.127:3000/remedialprogram/select",
            { stu_id: stuId }
          );

          setApplicationHistory(response.data.remedialprogramapplicationlist
            || []);
        } catch (error) {
          console.error("구제프로그램 불러오는데 에러 뜸:", error);
        }
      };

      console.log(applicationHistory)


  useEffect(() => {
    fetchApplicationHistory();
  }, []);

  const formatDateTime = (dateTime) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
    return new Date(dateTime).toLocaleString("ko-KR", options);
  };

  const reliefPrograms = [
    {
      category: "CBT 향상도",
      details: "최고점 기준 향상도",
      criteria: [
        "300점 이상 향상 = 5포인트",
        "250점 이상 향상 = 4포인트",
        "200점 이상 향상 = 3포인트",
        "150점 이상 향상 = 2포인트",
        "100점 이상 향상 = 1포인트",
      ],
      notes: [
        "향상 전 CBT 최고점이 300점 미만인 학생 제외",
        "졸업 인증, 특별 CBT 성적 제외",
      ],
    },
    {
      category: "봉사",
      details: "낮은점/소득분위/학비특례",
      criteria: ["각 2포인트"],
      notes: ["적금 관련 봉사는 학습 포인트 지급 하지 않음"],
    },
    {
      category: "자원봉사",
      details: "외부기관 자원봉사",
      criteria: ["시간과 관계없이 회당 1포인트 (학기당 10회만 인정)"],
      notes: [
        "자원봉사는 형태와 기관이 달라도 학기당 10회만 인정",
        "재학 기간 중 최대 20점",
      ],
    },
    {
      category: "기타 서포터즈",
      details: "교내·외 서포터즈 활동",
      criteria: ["3포인트"],
      notes: ["학기당 1회만 인정"],
    },
    {
      category: "급여 클리닉",
      details: "보건소 금연클리닉 6개월 성공 수료증",
      criteria: ["3포인트"],
      notes: ["보건소 발급 (재학 기간 중 1회 한정)"],
    },
    {
      category: "외국어자격증",
      details: "3. 외국어 자격증 표 참조",
      criteria: ["3포인트"],
      notes: [],
    },
    {
      category: "전공 자격증",
      details: "4. 전공 자격증 표 참조",
      criteria: ["3포인트"],
      notes: [],
    },
    {
      category: "모범장학",
      details:
        "직전학기 평점 3.5이상, 이수학점 15학점이상(4학년 9학점이상), 학부별 자체선발 기준",
      criteria: ["5포인트"],
      notes: ["1학년 2학기부터 수혜 가능"],
    },
    {
      category: "동서글로벌 프로그램 장학",
      details: "직전학기 평점 3.5 이상",
      criteria: ["3포인트"],
      notes: [],
    },
    {
      category: "동서스피치장학",
      details: "직전학기 평점 3.8 이상",
      criteria: ["5포인트"],
      notes: [],
    },
  ];

  return (
    <div className="relief-program-page">
      {/* 상단 설명 */}
      <header className="relief-header">
        <h1>구제 프로그램 목록</h1>
        <p>구제 프로그램 관련 내용</p>
        <ul>
          <li>Mydex 온도 포인트가 5점 미만일 때만 신청 가능합니다.</li>
          <li>구제 프로그램을 신청할 시 자격을 증명할 수 있는 서류를 같이 제출합니다.</li>
        </ul>
      </header>

      {/* 구제 프로그램 목록 테이블 */}
      <section className="relief-program-section">
        <table className="relief-program-table">
          <thead>
            <tr>
              <th>항목</th>
              <th>세부 사항</th>
              <th>각 배점 기준</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {reliefPrograms.map((program, index) => (
              <tr key={index}>
                <td>{program.category}</td>
                <td>{program.details}</td>
                <td>
                  {program.criteria.map((criterion, idx) => (
                    <div key={idx}>{criterion}</div>
                  ))}
                </td>
                <td>
                  {program.notes.length > 0
                    ? program.notes.map((note, idx) => (
                        <div key={idx}>{note}</div>
                      ))
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 구제 프로그램 신청 버튼 */}
      <div className="apply-button-container">
      <button className="apply-button" onClick={() => setIsPopupOpen(true)}>구제 프로그램 신청</button>
      {isPopupOpen && (
        <RemedialProgramPopup onClose={() => setIsPopupOpen(false)} />
      )}
      </div>
      {/* 신청 내역 */}
      <section className="application-history">
        <h2>구제 프로그램 신청 내역</h2>
        {applicationHistory.length > 0 ? (
          <table className="application-history-table">
            <thead>
              <tr>
                <th>신청 날짜</th>
                <th>구제 프로그램 이름</th>
                <th>지급된 포인트</th>
                <th>제출 서류</th>
                <th>처리 결과</th>
                <th>거절 내용</th>
              </tr>
            </thead>
            <tbody>
              {applicationHistory.map((item) => (
                <tr key={item.remedialprogram_application_id}>
                  <td>{formatDateTime(item.remedialprogram_application_datetime)}</td>
                  <td>{item.remedialprogram_name}</td>
                  <td>{item.granted_mydex_points || 0}점</td>
                  <td>
                    <a
                    //   href={`http://100.94.142.127:3000/${item.qualification_documents}`}
                      href={`${item.qualification_documents}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      서류 보기
                    </a>
                  </td>
                  <td>{item.processing_result === 1 ? "승인" : "거절"}</td>
                  <td>{item.rejection_reason || "없음"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>신청 내역이 없습니다.</p>
        )}
      </section>


    </div>
  );
}

export default ReliefProgramPage;
