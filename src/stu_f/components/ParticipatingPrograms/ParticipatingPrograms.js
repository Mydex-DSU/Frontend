import React from "react";
import Slider from "react-slick";
import ProgramCard from "../programCard/ProgramCard";
import "./ParticipatingPrograms.css";

function ParticipatingPrograms({ userPrograms }) {
  // 슬라이더 설정
  const settings = {
    dots: false,
    infinite: userPrograms.length > 4, // 4개 이상일 때 무한 슬라이드 활성화
    speed: 500,
    slidesToShow: Math.min(userPrograms.length, 4), // 표시할 카드 수
    slidesToScroll: 1,
    arrows: userPrograms.length > 4, // 4개 이상일 때만 화살표 표시
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(userPrograms.length, 3),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(userPrograms.length, 2),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
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
      {userPrograms.length === 1 ? (
        <div className="single-program">
          <ProgramCard program={userPrograms[0]} />
        </div>
      ) : (
        <Slider {...settings}>
          {userPrograms.map((program, index) => (
            <ProgramCard key={index} program={program} />
          ))}
        </Slider>
      )}
    </div>
  );
}

export default ParticipatingPrograms;
