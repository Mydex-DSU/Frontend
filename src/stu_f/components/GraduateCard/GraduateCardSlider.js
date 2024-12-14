import Slider from "react-slick";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./GraduateCardSlider.css";
import { useNavigate } from 'react-router-dom';

// 개별 카드 컴포넌트
const GraduateCard = ({ graduate, globalIndex, recommendationNumber }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/pro/prorecommenddetailpage', { state: { graduate } });
  };

  return (
    <div className="graduate-card" onClick={handleClick}>
      <div
        className={`graduate-header ${
          globalIndex === 0
            ? 'medal-1'
            : globalIndex === 1
            ? 'medal-2'
            : globalIndex === 2
            ? 'medal-3'
            : ''
        }`}
      >
        {globalIndex === 0
          ? '🏅'
          : globalIndex === 1
          ? '🥈'
          : globalIndex === 2
          ? '🥉'
          : ''}
        {`제 ${recommendationNumber}회 우수 졸업생`}
      </div>
      <div className="graduate-views">
        조회수 {graduate.views?.toLocaleString() || '0'}
      </div>
      {/* employment_status에 따라 표시할 내용 */}
      <h3 className="graduate-company">
        {graduate.employment_status === 0
          ? graduate.field_of_study || '진학 정보 없음'
          : graduate.company_name || '회사 정보 없음'}
      </h3>
      <h4 className="graduate-name">{graduate.stu_name || '이름 없음'}</h4>
      <div className="graduate-department">
        {graduate.department_name || '학과 정보 없음'}
      </div>
      <div className="graduate-tags">
        {(graduate.tags || []).map((tag, index) => (
          <span className="tag" key={index}>
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};


const GraduatesCarousel = ({
  graduates,
  startIndex,
  handlePrev,
  handleNext,
}) => {
  const visibleGraduates = graduates.slice(startIndex, startIndex + 4);

  const isLeftHidden = startIndex === 0;
  const isRightHidden = startIndex + 4 >= graduates.length;

  return (
    <div className="carousel">
      {!isLeftHidden && (
        <button
          className="carousel-arrow left-arrow"
          onClick={handlePrev}
        >
          &#8249;
        </button>
      )}
      <div className="graduates-cards">
        {visibleGraduates.map((graduate, index) => (
          <GraduateCard
            key={index}
            graduate={graduate}
            globalIndex={startIndex + index}
            recommendationNumber={graduate.recommendationNumber}
          />
        ))}
      </div>
      {!isRightHidden && (
        <button
          className="carousel-arrow right-arrow"
          onClick={handleNext}
        >
          &#8250;
        </button>
      )}
    </div>
  );
};


// 슬라이더 컴포넌트
const GraduateCardSlider = () => {
  const [graduates, setGraduates] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraduates = async () => {
      try {
        const response = await axios.get('http://100.94.142.127:3000/portfolios');
    
        console.log('API 응답 데이터:', response.data);
    
        // 데이터 그룹화 및 번호 매기기
        const groupedByYear = {};
        response.data.forEach((graduate) => {
          if (!groupedByYear[graduate.year_of_recommendation]) {
            groupedByYear[graduate.year_of_recommendation] = [];
          }
          groupedByYear[graduate.year_of_recommendation].push(graduate);
        });
    
        const processedGraduates = [];
        Object.keys(groupedByYear)
          .sort((a, b) => a - b) // 연도 순으로 정렬
          .forEach((year, index) => {
            const recommendationNumber = index + 1;
            groupedByYear[year].forEach((graduate) => {
              processedGraduates.push({
                ...graduate,
                recommendationNumber,
                tags: graduate.detailed_category_names
                  ? graduate.detailed_category_names.split(',')
                  : [], // , 기준으로 분리하여 tags 생성
              });
            });
          });

        // graduate.views 내림차순 정렬
        const sortedGraduates = processedGraduates.sort(
          (a, b) => b.views - a.views
        );
    
        setGraduates(processedGraduates);
      } catch (error) {
        console.error('데이터 가져오기 오류:', error.message);
        setError(
          `데이터를 가져오는 중 오류가 발생했습니다. (${error.message})`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGraduates();
  }, []);

  const handlePrev = () => {
    setStartIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, graduates.length - 4) : prevIndex - 4
    );
  };

  const handleNext = () => {
    setStartIndex((prevIndex) =>
      prevIndex + 4 >= graduates.length ? 0 : prevIndex + 4
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (graduates.length === 0) {
    return <div>우수 졸업생 데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="graduates-container">
      <GraduatesCarousel
        graduates={graduates}
        startIndex={startIndex}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </div>
  );
};

export default GraduateCardSlider;
