import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './proRegPage.css'

function ProRegPage() {
  const [portfolio, setPortfolio] = useState(null); // Start with an empty list
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state
  const [selectedFile, setSelectedFile] = useState(null); // Selected file state

  const [RegPageData, setFormData] = useState({
    programs: [''], // 첫 번째 항목은 항상 존재
    comments: [''], // 첫 번째 코멘트도 항상 존재
    categories: [''], // 세부 분야 선택
    detailedCategories: [''], // 세부 분야 선택 //////////
    graduate: { major: '' },//////////////////
  });

  const stu_id = sessionStorage.getItem('stu_id');
  const sessionData = JSON.parse(sessionStorage.getItem('stu_info')); // 세션 데이터
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
    // 파일 선택 핸들러
    const handleFileChange = (e) => {
      setSelectedFile(e.target.files[0]);
    };

    
    // 포트폴리오 추가 핸들러
    const handleAddPortfolio = () => {
      if (!selectedFile) {
        alert("파일을 선택하세요.");
        return;
      }
      setPortfolio(selectedFile); // 파일 이름 추가
      setSelectedFile(null); // 선택된 파일 초기화
      setShowPopup(false); // 팝업 닫기
    };
  
    // 포트폴리오 삭제 핸들러
    const handleDeletePortfolio = () => {
      if (portfolio) {
        setPortfolio(null); // 포트폴리오 초기화
      } else {
        alert('삭제할 포트폴리오가 없습니다.');
      }
    };

  // 비교과 프로그램 및 카테고리 목록 가져오기
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.post(
          'http://100.94.142.127:3000/recommend/graduateapplicationfin',
          {
            params: { status: 'completed' },
            stu_id: stu_id,
          }
        );
        if (response.status === 200) {
          setAvailablePrograms(response.data.graduateapplicationfin || []);
        } else {
          console.error('프로그램 목록 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('프로그램 목록 가져오기 오류:', error.message || error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://100.94.142.127:3000/categoris');
        if (response.status === 200) {
          console.log(response.data)
          setCategories(response.data || []);
        } else {
          console.error('카테고리 목록 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('카테고리 목록 가져오기 오류:', error.message || error);
      }
    };
    fetchPrograms();
    fetchCategories();
  }, [stu_id]);

  const handleProgramChange = (index, program_name) => {
    const updatedPrograms = [...RegPageData.programs];
    updatedPrograms[index] = program_name;

    if (program_name && index === updatedPrograms.length - 1 && updatedPrograms.length < 3) {
      updatedPrograms.push('');
      RegPageData.comments.push('');
    }

    setFormData({ ...RegPageData, programs: updatedPrograms });
  };
  const handleCommentChange = (index, comment) => {
    const updatedComments = [...RegPageData.comments];
    updatedComments[index] = comment;
    setFormData({ ...RegPageData, comments: updatedComments });
  };

  const handleCategoryChange = (category) => {
    setFormData({ ...RegPageData, category, detailedCategory: '' });
  };

//////////////////////
  const handleDetailedCategoryChange = (index, detailedCategory) => {
    const updatedDetailedCategories = [...RegPageData.detailedCategories];
    updatedDetailedCategories[index] = detailedCategory;

    if (
      detailedCategory &&
      index === updatedDetailedCategories.length - 1 &&
      updatedDetailedCategories.length < 3
    ) {
      updatedDetailedCategories.push('');
    }

    setFormData({ ...RegPageData, detailedCategories: updatedDetailedCategories });
  };
  // const handleDetailedCategoryChange = (detailedCategory) => {
  //   setFormData({ ...RegPageData, detailedCategory });
  // };

  // const getDetailedCategories = () => {
  //   return categories.filter((item) => item.category_name === RegPageData.category);
  // };
  const getDetailedCategories = (index) => {
    const selectedCategories = RegPageData.detailedCategories.filter((_, i) => i !== index);
    return categories.filter(
      (item) =>
        item.category_name === RegPageData.category &&
        !selectedCategories.includes(item.detailed_category_name)
    );
  };

  ////////////
  const handleDelete = (index) => {
    const updatedPrograms = [...RegPageData.programs];
    const updatedComments = [...RegPageData.comments];

    updatedPrograms.splice(index, 1);
    updatedComments.splice(index, 1);

    setFormData({ ...RegPageData, programs: updatedPrograms, comments: updatedComments });
  };

  const getFilteredOptions = (index) => {
    const selectedProgramNames = RegPageData.programs.filter((_, i) => i !== index);
    return availablePrograms.filter(
      (program) => !selectedProgramNames.includes(program.program_name)
    );
  };

  const handleSubmit = async () => {
    const selectPrograms = RegPageData.programs
      .filter((program_name) => program_name !== '')
      .map((program_name, index) => {
        const program = availablePrograms.find((p) => p.program_name === program_name);
        return {
          program_id: program?.program_id,
          comment: RegPageData.comments[index],
        };
      });
  
    const extraData =
      sessionData.employmentStatus === 'Y' && sessionData.graduateStudy === 'N'
        ? { major: RegPageData.graduate.major || '미입력' }
        : sessionData.employmentStatus === 'N' && sessionData.graduateStudy === 'Y'
        ? { major: RegPageData.graduate.major || '미입력' }
        : {};
  
    const formData = new FormData();
    formData.append('stu_id', stu_id);
    formData.append('select_programs', JSON.stringify(selectPrograms));
    formData.append('category', RegPageData.category || null);
    formData.append('detailed_category', RegPageData.detailedCategory || null);
    formData.append('employmentStatus', sessionData.employmentStatus || null);
    formData.append(
      'detailed_categories',
      JSON.stringify(RegPageData.detailedCategories.filter((category) => category !== ''))
    );
    formData.append('graduate', JSON.stringify(RegPageData.graduate || {}));
  
    // Add extraData to FormData
    Object.entries(extraData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  
    // Add portfolio to FormData
    if (portfolio) {
      formData.append('pdf_gradutestudent', portfolio);
    }

  
    try {
      const response = await axios.post('http://100.94.142.127:3000/bestinfo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data);
      if (response.status === 200) {
        alert('등록이 성공적으로 완료되었습니다.');
        navigate('/pro/promainpage');
      } else {
        alert(`등록에 실패했습니다. 상태 코드: ${response.status}`);
      }
    } catch (error) {
      console.error('등록 중 오류 발생:', error);
      alert('등록 중 문제가 발생했습니다. 관리자에게 문의하세요.');
    }
  };
  

  // const handleSubmit = async () => {
  //   // const selectPrograms = RegPageData.programs.map((program_name, index) => {
  //     // if (!program_name) {
  //   //     // 프로그램 이름이 null 또는 빈 문자열이면 program_id와 comment를 null로 설정
  //   //     return {
  //   //       program_id: null,
  //   //       comment: null,
  //   //     };
  //   //   }
    
  //   //   const program = availablePrograms.find((p) => p.program_name === program_name);
  //   //   return {
  //   //     program_id: program?.program_id || null, // program_id가 없으면 null로 설정
  //   //     comment: RegPageData.comments[index] || null, // 해당 index의 comment가 없으면 null로 설정
  //   //   };
  //   // });

  //   const selectPrograms = RegPageData.programs
  //     .filter((program_name) => program_name !== '')
  //     .map((program_name, index) => {
  //       const program = availablePrograms.find((p) => p.program_name === program_name);
  //       return {
  //         program_id: program?.program_id,
  //         comment: RegPageData.comments[index],
  //       };
  //     });

  //   const extraData =
  //     sessionData.employmentStatus === 'Y' && sessionData.graduateStudy === 'N'
  //       ? { major: RegPageData.graduate.major || '미입력' }
  //       : sessionData.employmentStatus === 'N' && sessionData.graduateStudy === 'Y'
  //       ? { major: RegPageData.graduate.major || '미입력' }
  //       : {};

  //   const employmentStatus = sessionData.employmentStatus;

  //   // console.log(selectedFile)
  //   console.log(portfolios)
  //   const dataToSubmit = {
  //     stu_id,
  //     select_programs: selectPrograms,
  //     category: RegPageData.category,
  //     ...extraData,
  //     employmentStatus,
  //     detailed_categories: RegPageData.detailedCategories.filter((category) => category !== ''), ///////////
  //     graduate: RegPageData.graduate,/////////
  //   };

  //   try {
  //     const response = await axios.post(
  //       'http://100.94.142.127:3000/bestinfo',
  //       dataToSubmit,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       alert('등록이 성공적으로 완료되었습니다.');
  //       navigate('/pro/promainpage'); // 성공 시 StudentManagement 페이지로 이동
  //     } else {
  //       alert(`등록에 실패했습니다. 상태 코드: ${response.status}`);
  //     }
  //   } catch (error) {
  //     console.error('등록 중 오류 발생:', error.response?.data || error.message);
  //     alert('등록 중 문제가 발생했습니다. 관리자에게 문의하세요.');
  //   }
  // };

  const handleCancel = () => {
    console.log('취소 버튼 클릭됨');
  };

  return (
    <div className="reg-page">
      <div className="banner">우수 졸업생으로 선정되신 것을 축하드립니다.</div>
      <h2 className="page-title">비교과 프로그램 추천 및 전문분야 등록</h2>


      {/* 비교과 프로그램 추천 섹션 */}
      <section className="programs-section">
        <h2 className="section-title">비교과 프로그램을 추천해주세요</h2>

        {/* 비교과 프로그램 선택 */}
        <div className="program-row">
          <label>비교과 프로그램명</label>
          <div className="program-inputs">
            {loading ? (
              <p>프로그램 목록을 불러오는 중...</p>
            ) : (
              RegPageData.programs.map((program, index) => (
                <div key={index} className="program-select-row">
                {/* 프로그램 선택 */}
                <select
                  value={program}
                  onChange={(e) => handleProgramChange(index, e.target.value)}
                >
                  <option value="">프로그램 선택</option>
                  {getFilteredOptions(index).map((program) => (
                    <option key={program.program_id} value={program.program_name}>
                      {program.program_name}
                    </option>
                  ))}
                </select>
                   {/* 코멘트 작성 */}
                {index < RegPageData.comments.length && (
                  <textarea
                    placeholder="코멘트를 입력하세요"
                    value={RegPageData.comments[index]}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                  ></textarea>
                )}
                          {/* 삭제 버튼 */}
                {index > 0 && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(index)}
                  >
                    삭제하기
                  </button>
                )}
</div>
              ))
            )}
          </div>
        </div>

        
      </section>

     
           {/* 전문분야/전공분야 섹션 */}
           <section className="specialization-section">
        <h2 className="specialization-title">전문분야/전공분야를 입력해주세요</h2>

        <div className="specialization-inputs">
          <select
            value={RegPageData.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">전문분야 선택</option>
            {[...new Set(categories.map((item) => item.category_name))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {RegPageData.detailedCategories.map((detailedCategory, index) => (
            <div key={index} className="detailed-category-row">
              <select
                value={detailedCategory}
                onChange={(e) => handleDetailedCategoryChange(index, e.target.value)}
              >
                <option value="">세부 분야 선택</option>
                {getDetailedCategories(index).map((item) => (
                  <option key={item.detailed_category_name} value={item.detailed_category_name}>
                    {item.detailed_category_name}
                  </option>
                ))}
              </select>
            </div>
          ))}



          
        </div>
        <div className="specialization-row">
          <label>
            {sessionData.employmentStatus === 'Y' && sessionData.graduateStudy === 'N'
              ? '취업'
              : sessionData.employmentStatus === 'N' && sessionData.graduateStudy === 'Y'
              ? '대학원'
              : '전공'}
          </label>
          <div className="specialization-inputs">
            <input
              type="text"
              placeholder={
                sessionData.employmentStatus === 'Y' && sessionData.graduateStudy === 'N'
                  ? '회사명을 입력하세요'
                  : sessionData.employmentStatus === 'N' && sessionData.graduateStudy === 'Y'
                  ? '대학원명을 입력하세요'
                  : '전공명을 입력하세요'
              }
              onChange={(e) =>
                setFormData({
                  ...RegPageData,
                  graduate: { ...RegPageData.graduate, major: e.target.value },
                })
              }
            />
          </div>
        </div>

        <div className="pro-RegPagepoppup-portfolio-section">
          <h3>외부 포트폴리오 서류</h3>
          <ul className="portfolio-list">
          {portfolio ? (
          <div className="portfolio-item">
            <span>{portfolio.name}</span>
            <button className="delete-btn" onClick={handleDeletePortfolio}>
              삭제
            </button>
          </div>
        ) : (
          <p>추가된 포트폴리오가 없습니다.</p>
        )}
        </ul>

        {/* <ul className="portfolio-list">
            {portfolios.map((portfolio, index) => (
              <li key={index} className="portfolio-item">
                <span>{portfolio}</span>
                <button
                  className="pro-RegPagepoppup-delete-btn"
                  onClick={() => handleDeletePortfolio(index)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul> */}



          <div className="pro-RegPagepoppup-button-row">
            <button className="pro-RegPagepoppup-add-btn" onClick={() => setShowPopup(true)}>
              추가
            </button>
          </div>
        </div>
      </section>

          {showPopup && (
      <div className="pro-RegPagepoppup-popup-overlay">
        <div className="pro-RegPagepoppup-content">
          <h4 className="pro-RegPagepoppup-popup-title"> 포트폴리오 서류 추가</h4>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.hwp"
            onChange={handleFileChange}
          />
          <div className="pro-RegPagepoppup-buttons">
            <button className="pro-RegPagepoppup-cancel-button-popuop" onClick={() => setShowPopup(false)}>
              취소
            </button>
            <button className="pro-RegPagepoppup-confirm-button" onClick={handleAddPortfolio}>
              저장
            </button>
          </div>
        </div>
      </div>
    )}



      

      {/* 하단 버튼 */}
      <div className="footer-buttons">
        <button className="pro-RegPagepoppup-cancel-btn" onClick={handleCancel}>
          취소
        </button>
        <button className="pro-RegPagepoppup-submit-btn" onClick={handleSubmit}>
          등록
        </button>
      </div>
    </div>
  );
}

export default ProRegPage;
