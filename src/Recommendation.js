import React from 'react';
import './Recommendation.css';

const Recommendation = () => {
  const programs = [
    {
      title: 'BDAD 학습 공동체 (2024)',
      content: '튜티와 튜터가 학습공동체 팀을 이뤄 한 가지 주제를 중심으로 함께 학습하는 스터디그룹',
      feedback: 'BDAD 학습 공동체에서 튜터와 함께 주제를 깊이 있게 배우면서 서로의 의견을 나누고 협력해 나가는 과정이 정말 뜻깊었고, 많은 것을 배우는 시간이었습니다!',
    },
    {
      title: '독서토론회 (2024)',
      content:
        '제시된 책과 주제에 대하여 2인 1조 팀별 예선, 본선을 통한 토너먼트 방식의 CEDA 토론 진행',
      feedback: '독서토론회를 통해 다양한 의견을 나누며 책에 대한 깊은 이해를 얻었고, 디지털 시대의 독서 방식에 대해 긍정적으로 생각해볼 수 있는 기회가 정말 소중했습니다!',
    },
    {
      title: '창의적 생활코딩 수강 수기 공모전 (2024)',
      content: '“창의적 생활코딩 1, 2” 수강 관련하여 개인 소감문 작성',
      feedback: '수업과 연계해 자신이 배웠던 교과목에 대한 소감문을 작성하면서 배웠던 내용들을 다시한번 상기 시킬 수 있어 좋았습니다!',
    },
  ];

  return (
    <div className="recommendation-container">
      <div className="recommendation-header">
        <h2>추천 비교과 프로그램</h2>
      </div>
      {programs.map((program, index) => (
        <div className="program-item" key={index}>
          <div className="program-title">
            <h3>{index + 1}. {program.title}</h3>
          </div>
          <div className="program-content">
            <span className="program-label">프로그램 내용</span>
            <p>{program.content}</p>
          </div>
          <div className="program-feedback">
            <span className="feedback-icon">💬</span>
            <div className="feedback-text">{program.feedback}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendation;
