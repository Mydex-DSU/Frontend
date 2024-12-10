import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RegPage.css';

function RegPage() {
  const [RegPageData, setFormData] = useState({
    programs: [''], // 첫 번째 항목은 항상 존재
    comments: [''], // 첫 번째 코멘트도 항상 존재
    // employment: { company: '', field1: '', field2: '' },
    category: '',
    detailedCategory: '',
    graduate: { major: '' },
  });

  const stu_id = sessionStorage.getItem('stu_id');
  const sessionData = JSON.parse(sessionStorage.getItem('stu_info')); // 세션 데이터
  console.log('Parsed Data:', sessionData);

  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 비교과 프로그램 목록 가져오기
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.post(
          'http://192.168.0.123:3000/recommend/graduateapplicationfin',
          {
            params: { status: 'completed' },
            stu_id: stu_id,
          }
        );
        if (response.status === 200) {
          console.log(response.data);
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
        const response = await axios.get(
          'http://192.168.0.123:3000/categoris'
        );
        if (response.status === 200) {
          console.log(response.data);
          setCategories(response.data || []);
        } else {
          console.error('카테고리 목록 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('카테고리 목록 가져오기 오류:', error.message || error);
      }
    };
    fetchCategories();
    
  }, [stu_id]);

  // 프로그램 선택 핸들러
  const handleProgramChange = (index, program_name) => {
    const updatedPrograms = [...RegPageData.programs];
    updatedPrograms[index] = program_name;

    // 새로운 선택 항목 추가 (최대 3개까지만 추가)
    if (program_name && index === updatedPrograms.length - 1 && updatedPrograms.length < 3) {
      updatedPrograms.push('');
      RegPageData.comments.push('');
    }

    setFormData({ ...RegPageData, programs: updatedPrograms });
  };

  // 코멘트 입력 핸들러
  const handleCommentChange = (index, comment) => {
    const updatedComments = [...RegPageData.comments];
    updatedComments[index] = comment;
    setFormData({ ...RegPageData, comments: updatedComments });
  };

    // 전문분야 선택 핸들러
    const handleCategoryChange = (category) => {
      setFormData({ ...RegPageData, category, detailedCategory: '' });
    };
  
    const handleDetailedCategoryChange = (detailedCategory) => {
      setFormData({ ...RegPageData, detailedCategory });
    };
  
    // 필터링된 세부 카테고리 가져오기
    const getDetailedCategories = () => {
      return categories.filter((item) => item.category_name === RegPageData.category);
    };

  // 항목 삭제 핸들러 (두 번째 이후만 삭제 가능)
  const handleDelete = (index) => {
    const updatedPrograms = [...RegPageData.programs];
    const updatedComments = [...RegPageData.comments];

    updatedPrograms.splice(index, 1);
    updatedComments.splice(index, 1);

    setFormData({ ...RegPageData, programs: updatedPrograms, comments: updatedComments });
  };

  // 사용 가능한 옵션 필터링
  const getFilteredOptions = (index) => {
    const selectedProgramNames = RegPageData.programs.filter((_, i) => i !== index);
    return availablePrograms.filter(
      (program) => !selectedProgramNames.includes(program.program_name)
    );
  };

  const handleSubmit = async () => {
    // 선택된 program_name을 program_id로 매핑하고 select_programs 배열 생성
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

      const dataToSubmit = {
        stu_id,
        select_programs: selectPrograms,
        category: RegPageData.category,
        detailed_category: RegPageData.detailedCategory,
        ...extraData,
      };

    // 조건에 따라 추가할 데이터를 결정
    // const extraData =
    //   sessionData.employmentStatus === 'Y' && sessionData.graduateStudy === 'N'
    //     ? { major: RegPageData.graduate.major || '미입력' }
    //     : sessionData.employmentStatus === 'N' && sessionData.graduateStudy === 'Y'
    //     ? { major: RegPageData.graduate.major || '미입력' }
    //     : {};

    // const dataToSubmit = {
    //   stu_id,
    //   select_programs: selectPrograms, // programs와 comments를 묶은 배열
    //   specialcategory: RegPageData.employment.field1 || '미선택',
    //   specialcategorydetail: RegPageData.employment.field2 || '미선택',
    //   ...extraData, // 조건에 따른 데이터 추가
    // };

    console.log('보낼 데이터:', JSON.stringify(dataToSubmit, null, 2));

    try {
      const response = await axios.post(
        'http://192.168.0.123:3000/bestinfo',
        dataToSubmit,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        alert('등록이 성공적으로 완료되었습니다.');
      } else {
        alert(`등록에 실패했습니다. 상태 코드: ${response.status}`);
      }
    } catch (error) {
      console.error('등록 중 오류 발생:', error.response?.data || error.message);
      alert('등록 중 문제가 발생했습니다. 관리자에게 문의하세요.');
    }
  };

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
                  {index < RegPageData.comments.length && (
                    <textarea
                      placeholder="코멘트를 입력하세요"
                      value={RegPageData.comments[index]}
                      onChange={(e) => handleCommentChange(index, e.target.value)}
                    ></textarea>
                  )}
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
          <select
            value={RegPageData.detailedCategory}
            onChange={(e) => handleDetailedCategoryChange(e.target.value)}
            disabled={!RegPageData.category}
          >
            <option value="">세부 분야 선택</option>
            {getDetailedCategories().map((item) => (
              <option key={item.detailed_category_name} value={item.detailed_category_name}>
                {item.detailed_category_name}
              </option>
            ))}
          </select>
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
      </section>
      {/* <section className="specialization-section">
        <h2 className="specialization-title">전문분야/전공분야를 입력해주세요</h2> */}

        {/* <div className="specialization-inputs">
          <select
            onChange={(e) =>
              setFormData({
                ...RegPageData,
                employment: { ...RegPageData.employment, field1: e.target.value },
              })
            }
          >
            <option value="">전문분야 1 선택</option>
            <option value="IT 및 소프트웨어 개발">IT 및 소프트웨어 개발</option>
            <option value="빅데이터 분석">빅데이터 분석</option>
            <option value="AI 연구">AI 연구</option>
          </select>
          <select
            onChange={(e) =>
              setFormData({
                ...RegPageData,
                employment: { ...RegPageData.employment, field2: e.target.value },
              })
            }
          >
            <option value="">전문분야 2 선택</option>
            <option value="웹 개발">웹 개발</option>
            <option value="모바일 앱 개발">모바일 앱 개발</option>
            <option value="데이터 엔지니어링">데이터 엔지니어링</option>
          </select>
        </div> */}

 
      {/* </section> */}

      {/* 하단 버튼 */}
      <div className="footer-buttons">
        <button className="cancel-btn" onClick={handleCancel}>
          취소
        </button>
        <button className="submit-btn" onClick={handleSubmit}>
          등록
        </button>
      </div>
    </div>
  );
}

export default RegPage;

