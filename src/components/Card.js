import React from "react";
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Card.css';

// 개별 카드 컴포넌트
function Card({ imgSrc, title, description, link }) {
  return (
    <div className="card-image-wrap">
      <span className="type2">모집중</span>
      <Link to={link} className="card-image">
        <img src={imgSrc} alt={title} />
      </Link>
      <div className="card-overlay">
        <text>{title}</text>
        <p>{description}</p>
        <p>1</p>
        <p>2</p>
        <p>3</p>
      </div>
      <div className="card-info"> {/* 새로운 정보 영역 추가 */}
        <div>온라인접수중0/6</div>
      </div>
    </div>
  );
}

function SimpleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  // 슬라이더에 들어갈 카드 데이터 (이미지, 제목, 설명, 링크)
  const cardData = [
    { imgSrc: "https://codingapple1.github.io/shop/shoes1.jpg", title: "1", description: "Description 1", link: "/link1" },
    { imgSrc: "https://codingapple1.github.io/shop/shoes2.jpg", title: "2", description: "Description 2", link: "/link2" },
    { imgSrc: "https://codingapple1.github.io/shop/shoes3.jpg", title: "3", description: "Description 3", link: "/link3" },
    { imgSrc: "https://codingapple1.github.io/shop/shoes4.jpg", title: "4", description: "Description 4", link: "/link4" },
    { imgSrc: "https://codingapple1.github.io/shop/shoes5.jpg", title: "5", description: "Description 5", link: "/link5" },
  ];

  return (
    <div className="slider-container">
      <h2> Single Item</h2>
      <Slider {...settings}>
        {/* 카드 데이터를 반복하여 슬라이더에 렌더링 */}
        {cardData.map((card, index) => (
          <Card
            key={index}
            imgSrc={card.imgSrc}
            title={card.title}
            description={card.description}
            link={card.link}  // 링크 prop 추가
          />
        ))}
      </Slider>
    </div>
  );
}

export default SimpleSlider;