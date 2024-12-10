import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TopGraduates.css';

const GraduateCard = ({ graduate, globalIndex }) => {
  return (
    <div className="graduate-card">
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
        제 1회 우수 졸업생
      </div>
      <div className="graduate-views">조회수 {graduate.views?.toLocaleString() || 0}</div>
      <h3 className="graduate-company">{graduate.company_name || '회사 정보 없음'}</h3>
      <h4 className="graduate-name">{graduate.stu_name || '이름 없음'}</h4>
      <div className="graduate-department">{graduate.department_name || '학과 정보 없음'}</div>
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

const GraduatesCarousel = ({ graduates, startIndex, handlePrev, handleNext }) => {
  const visibleGraduates = graduates.slice(startIndex, startIndex + 4);

  return (
    <div className="carousel">
      <button className="carousel-arrow left-arrow" onClick={handlePrev}>
        &#8249;
      </button>
      <div className="graduates-cards">
        {visibleGraduates.map((graduate, index) => (
          <GraduateCard
            key={index}
            graduate={graduate}
            globalIndex={startIndex + index}
          />
        ))}
      </div>
      <button className="carousel-arrow right-arrow" onClick={handleNext}>
        &#8250;
      </button>
    </div>
  );
};

const TopGraduates = () => {
  const [graduates, setGraduates] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraduates = async () => {
      try {
        const response = await axios.post('http://192.168.0.123:3000/portfolios', {
          stu_id: 'example_student_id', // 필요한 경우 수정
        });

        console.log('API 응답 데이터:', response.data);

        if (response.data && Array.isArray(response.data.stu_portfolios)) {
          setGraduates(response.data.stu_portfolios);
        } else {
          console.error('Unexpected data format:', response.data);
          setError('서버에서 받은 데이터 형식이 올바르지 않습니다.');
        }
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
        setError('데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchGraduates();
  }, []);

  const handlePrev = () => {
    setStartIndex((prevIndex) =>
      prevIndex === 0 ? graduates.length - 4 : prevIndex - 4
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
      <h1>우수 졸업생 추천 리스트</h1>
      <GraduatesCarousel
        graduates={graduates}
        startIndex={startIndex}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </div>
  );
};

export default TopGraduates;
