import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './RecommendDetailPage.css';

const RecommendDetail = () => {

  const location = useLocation();
  const graduate = location.state?.graduate;  

  const [studentInfo, setStudentInfo] = useState([]);

  const [loading, setLoading] = useState(true);

  const isMounted = useRef(false); // 마운트 상태를 확인할 Ref
  useEffect(() => {
    if (isMounted.current) return; // 마운트된 이후에는 실행 안 함
    isMounted.current = true;

    const fetchStudentInfo = async () => {
      const stu_id = graduate?.stu_id;
      try {
        // 백엔드 API 호출
        const response = await axios.post('http://100.94.142.127:3000/portfolios/selectprogram',
          {
            stu_id: stu_id,
          }
        );

        console.log(response.data);
        setStudentInfo(response.data);
      } catch (error) {
        console.error('학생 정보를 가져오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, [graduate]);

  return (
    <div className="prorecommendation-container">
      {/* 상단 상세 정보 */}
      {graduate && (
        <div className="prograduate-detail">
          <div className="pro-graduate-header">
            <h1>우수졸업생 상세정보</h1>
          </div>
          <div className="prograduate-info">
            <div className="proinfo-section">
              <h2 className="info-title">우수 졸업생 기본 정보</h2>
              <p><strong>학번:</strong> {graduate.stu_id || '정보 없음'}</p>
              <p><strong>이름:</strong> {graduate.stu_name || '정보 없음'}</p>
              <p><strong>소속:</strong> {graduate.department_name || '정보 없음'}</p>
              {graduate.graduate_school_admission === 1 && graduate.field_of_study ? (
                <p><strong>대학원:</strong> {graduate.field_of_study}</p>
              ) : (
                graduate.company_name && <p><strong>회사:</strong> {graduate.company_name}</p>
              )}
              <div className="prospecialization-section">
              <h2 className="den-info-title">전문 분야</h2>
              <div className="tags">
                {(graduate.tags || []).map((tag, index) => (
                  <span className="tag" key={index}>#{tag}</span>
                ))}
              </div>          
              <h2 >포트폴리오</h2>
              <p><a href={graduate.portfolio_documents || '#'} target="_blank" rel="noopener noreferrer">{graduate.portfolio_documents  ? '포트폴리오 보기' : '링크 없음'}</a></p>    

            </div>

            </div>


          </div>
        </div>
      )}

      <div className="prorecommendation-header">
        <h2>추천 비교과 프로그램</h2>
      </div>

      {/* 프로그램 리스트 */}
      {studentInfo.map((program, index) => (
        <div className="proprogram-item" key={index}>
          <div className="prostu-program-title">
            <h3>
              {index + 1}. {program.program_name}
            </h3>
          </div>
          <div className="prostu-program-content">
            <span className="proprogram-label">프로그램 내용</span>
            <p>{program.program_description}</p>
          </div>
          <div className="proprogram-feedback">
            <span className="profeedback-icon">💬</span>
            <div className="profeedback-text">{program.comment}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendDetail;





// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// import './RecommendDetailPage.css';

// const RecommendDetail = () => {

//   const location = useLocation();
//   const graduate = location.state?.graduate;  

//   const [studentInfo, setStudentInfo] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [programs] = useState([
//     {
//       title: 'BDAD 학습 공동체 (2024)',
//       content: '튜티와 튜터가 학습공동체 팀을 이뤄 한 가지 주제를 중심으로 함께 학습하는 스터디그룹',
//       feedback: 'BDAD 학습 공동체에서 튜터와 함께 주제를 깊이 있게 배우면서 서로의 의견을 나누고 협력해 나가는 과정이 정말 뜻깊었고, 많은 것을 배우는 시간이었습니다!',
//     },
//     {
//       title: '독서토론회 (2024)',
//       content: '제시된 책과 주제에 대하여 2인 1조 팀별 예선, 본선을 통한 토너먼트 방식의 CEDA 토론 진행',
//       feedback: '독서토론회를 통해 다양한 의견을 나누며 책에 대한 깊은 이해를 얻었고, 디지털 시대의 독서 방식에 대해 긍정적으로 생각해볼 수 있는 기회가 정말 소중했습니다!',
//     },
//     {
//       title: '창의적 생활코딩 수강 수기 공모전 (2024)',
//       content: '“창의적 생활코딩 1, 2” 수강 관련하여 개인 소감문 작성',
//       feedback: '수업과 연계해 자신이 배웠던 교과목에 대한 소감문을 작성하면서 배웠던 내용들을 다시한번 상기 시킬 수 있어 좋았습니다!',
//     },
//   ]);


//   const isMounted = useRef(false); // 마운트 상태를 확인할 Ref
//   useEffect(() => {
//     if (isMounted.current) return; // 마운트된 이후에는 실행 안 함
//     isMounted.current = true;


//     const fetchStudentInfo = async () => {
//       const stu_id = graduate.stu_id
//       try {
//         // 백엔드 API 호출
//         const response = await axios.post('http://100.94.142.127:3000/portfolios/selectprogram',
//           {
//             stu_id: stu_id,
//           }
//         );

//         console.log(response.data)
//         setStudentInfo(response.data);
//       } catch (error) {
//         console.error('학생 정보를 가져오는 중 오류 발생:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchStudentView = async () => {
//       try {
//         const stu_id = graduate.stu_id
//         // 백엔드 API 호
//         const response = await axios.post('http://100.94.142.127:3000/bestinfo/view',
//           {
//             stu_id: stu_id,
//           }
//         );
//         console.log(response.data)

//       } catch (error) {
//         console.error('학생 정보를 가져오는 중 오류 발생:', error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchStudentInfo();
//     fetchStudentView();
//   }, []);

//   return (
//     <div className="recommendation-container">
//       <div className="recommendation-header">
//         <h2>추천 비교과 프로그램</h2>
//       </div>

//         {/* 학생 정보 카드 */}
//         {graduate ? (
//         <div className="student-card">
//           <h3>{graduate.stu_name || '학생 이름 없음'}</h3>
//           <p>학과: {graduate.department_name || '학과 정보 없음'}</p>
//           <p>학번: {graduate.stu_id || '학번 정보 없음'}</p>
//         </div>
//       ) : (
//         <div>학생 정보를 불러올 수 없습니다.</div>
//       )}

//       {/* 프로그램 리스트 */}
//       {studentInfo.map((program, index) => (
//         <div className="program-item" key={index}>
//           <div className="stu-program-title">
//             <h3>
//               {index + 1}. {program.program_name}
//             </h3>
//           </div>
//           <div className="stu-program-content">
//             <span className="program-label">프로그램 내용</span>
//             <p>{program.program_description}</p>
//           </div>
//           <div className="program-feedback">
//             <span className="feedback-icon">💬</span>
//             <div className="feedback-text">{program.comment}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default RecommendDetail;

// // import React, { useEffect, useState, useRef } from 'react';
// // import axios from 'axios';
// // import { useLocation } from 'react-router-dom';
// // import './Recommendation.css';

// // const Recommendation = () => {

// //   const location = useLocation();
// //   const graduate = location.state?.graduate;  
// //   const [studentInfo, setStudentInfo] = useState(null); // 학생 정보를 저장할 상태
// //   const [loading, setLoading] = useState(true);
// //   const [programs] = useState([
// //     {
// //       title: 'BDAD 학습 공동체 (2024)',
// //       content: '튜티와 튜터가 학습공동체 팀을 이뤄 한 가지 주제를 중심으로 함께 학습하는 스터디그룹',
// //       feedback: 'BDAD 학습 공동체에서 튜터와 함께 주제를 깊이 있게 배우면서 서로의 의견을 나누고 협력해 나가는 과정이 정말 뜻깊었고, 많은 것을 배우는 시간이었습니다!',
// //     },
// //     {
// //       title: '독서토론회 (2024)',
// //       content: '제시된 책과 주제에 대하여 2인 1조 팀별 예선, 본선을 통한 토너먼트 방식의 CEDA 토론 진행',
// //       feedback: '독서토론회를 통해 다양한 의견을 나누며 책에 대한 깊은 이해를 얻었고, 디지털 시대의 독서 방식에 대해 긍정적으로 생각해볼 수 있는 기회가 정말 소중했습니다!',
// //     },
// //     {
// //       title: '창의적 생활코딩 수강 수기 공모전 (2024)',
// //       content: '“창의적 생활코딩 1, 2” 수강 관련하여 개인 소감문 작성',
// //       feedback: '수업과 연계해 자신이 배웠던 교과목에 대한 소감문을 작성하면서 배웠던 내용들을 다시한번 상기 시킬 수 있어 좋았습니다!',
// //     },
// //   ]);


// //   const isMounted = useRef(false); // 마운트 상태를 확인할 Ref
// //   useEffect(() => {
// //     if (isMounted.current) return; // 마운트된 이후에는 실행 안 함
// //     isMounted.current = true;


// //     const fetchStudentInfo = async () => {
// //       const stu_id = graduate.stu_id
// //       try {
// //         // 백엔드 API 호출
// //         const response = await axios.post('http://100.94.142.127:3000/portfolios/selectprogram',
// //           {
// //             stu_id: stu_id,
// //           }
// //         );

// //         console.log(response.data)
// //         setStudentInfo(response.data);
// //       } catch (error) {
// //         console.error('학생 정보를 가져오는 중 오류 발생:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     const fetchStudentView = async () => {
// //       try {
// //         const stu_id = graduate.stu_id
// //         // 백엔드 API 호
// //         const response = await axios.post('http://100.94.142.127:3000/bestinfo/view',
// //           {
// //             stu_id: stu_id,
// //           }
// //         );
// //         console.log(response.data)

// //       } catch (error) {
// //         console.error('학생 정보를 가져오는 중 오류 발생:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     fetchStudentInfo();
// //     fetchStudentView();
// //   }, []);

// //   return (
// //     <div className="recommendation-container">
// //       <div className="recommendation-header">
// //         <h2>추천 비교과 프로그램</h2>
// //       </div>

// //         {/* 학생 정보 카드 */}
// //         {graduate ? (
// //         <div className="student-card">
// //           <h3>{graduate.stu_name || '학생 이름 없음'}</h3>
// //           <p>학과: {graduate.department_name || '학과 정보 없음'}</p>
// //           <p>학번: {graduate.stu_id || '학번 정보 없음'}</p>
// //           <p>추천 이유: {'이 학생은 우수한 성과를 거둔 졸업생입니다.'}</p>
// //         </div>
// //       ) : (
// //         <div>학생 정보를 불러올 수 없습니다.</div>
// //       )}

// //       {/* 프로그램 리스트 */}
// //       {programs.map((program, index) => (
// //         <div className="program-item" key={index}>
// //           <div className="program-title">
// //             <h3>
// //               {index + 1}. {program.title}
// //             </h3>
// //           </div>
// //           <div className="program-content">
// //             <span className="program-label">프로그램 내용</span>
// //             <p>{program.content}</p>
// //           </div>
// //           <div className="program-feedback">
// //             <span className="feedback-icon">💬</span>
// //             <div className="feedback-text">{program.feedback}</div>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default Recommendation;
