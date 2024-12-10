import React from "react";
import Slider from "react-slick";
import "./GraduateCardSlider.css";

const graduates = [
  { stu_id: 1, depart_name: "소프트웨어학과", name: "대인수", fidld_of_study: "AI", views: 250 },
  { stu_id: 2, depart_name: "디자인학과", name: "소인수", fidld_of_study: "디자인", views: 180 },
  { stu_id: 3, depart_name: "경제학과", name: "중인수", fidld_of_study: "경제", views: 320 },
  { stu_id: 4, depart_name: "디자인학과", name: "점오인수", fidld_of_study: "UI 디자인", views: 150 },
  { stu_id: 5, depart_name: "소프트웨어학과", name: "악인수", fidld_of_study: "소프트웨어", views: 200 },
];

// 개별 카드 컴포넌트
const GraduateCard = ({ graduate }) => (
  <div className="graduate-card">
    <div className="graduate-header">
      <h3>{graduate.depart_name}</h3>
      <span className="graduate-views">{graduate.views} views</span>
    </div>

    <div className="graduate-body">
      <p> {graduate.name}</p>
      <p><strong>전공:</strong> {graduate.fidld_of_study}</p>
      
    </div>
  </div>
);

// 슬라이더 컴포넌트
const GraduateCardSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="graduate-slider">
      <Slider {...settings}>
        {graduates.map((graduate) => (
          <GraduateCard key={graduate.id} graduate={graduate} />
        ))}
      </Slider>
    </div>
  );
};

export default GraduateCardSlider;
