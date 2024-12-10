import React from 'react';
import './TempPoint.css';

//지금은 아이콘인데 나중에 image로 point별로 적용시켜서 보여줄 예정 크기조절은...gpt한테 맡겨보자 ㅎㅎ
function TempPoint({ points }) {
  return (
    <div className="temp-point">
      <span className="temp-icon">❤️</span>
      <span className="temp-points">{points}</span>
    </div>
  );
}

export default TempPoint;
