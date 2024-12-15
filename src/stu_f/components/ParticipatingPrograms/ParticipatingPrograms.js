import React, { useState } from "react";
import ProgramCard from "../programCard/ProgramCard";
import "./ParticipatingPrograms.css";

function ParticipatingPrograms({ userPrograms }) {
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 카드 시작 인덱스
  const cardsPerPage = 4; // 한 번에 보여줄 카드 수

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      Math.max(0, prevIndex - cardsPerPage)
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(userPrograms.length - cardsPerPage, prevIndex + cardsPerPage)
    );
  };

  if (!Array.isArray(userPrograms) || userPrograms.length === 0) {
    return (
      <div className="participating-programs">
        <div className="no-programs">참여 중인 프로그램이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="participating-programs">
      <div className="programs-header">
        
      </div>
      <div className="program-carousel">
        {currentIndex > 0 && (
          <button className="carousel-button prev-button" onClick={handlePrev}>
            &lt;
          </button>
        )}
        <div className="program-card-row">
          {userPrograms
            .slice(currentIndex, currentIndex + cardsPerPage)
            .map((program, index) => (
              <ProgramCard key={index} program={program} />
            ))}
        </div>
        {currentIndex + cardsPerPage < userPrograms.length && (
          <button className="carousel-button next-button" onClick={handleNext}>
            &gt;
          </button>
        )}
      </div>
    </div>
  );
}

export default ParticipatingPrograms;
