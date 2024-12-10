import React from 'react';
import './card.css'

const Card = ({ title, image, operationPeriod, surveyPeriod, status, likeCount, onClick }) => {
    return (
      <div className="program-card" onClick={onClick} style={{cursor: 'pointer'}}>
        <div className="card-image" style={{ backgroundImage: `url(${image})` }}>
            <button className="like-button" onClick={(e) => e.stopPropagation()}>
                <span className="like-icon-wrapper">
                ♡
                <span className="like-count">{likeCount}</span>
                </span>
            </button>
        </div>
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          <div className="period-info">
            <p>운영 - {operationPeriod}</p>
            <p>설문 - {surveyPeriod}</p>
          </div>
          <button className={`status-button ${status}`} onClick={(e) => e.stopPropagation()}>
            {status}
          </button>
        </div>
      </div>
    );
  };

export default Card;