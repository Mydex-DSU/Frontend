import React from 'react';
import './card.css'

const Card = ({ title, image, operationPeriod, surveyPeriod, status, likeCount, onClick }) => {
    return (
      <div className="adm_program-card" onClick={onClick} style={{cursor: 'pointer'}}>
        <div className="adm_card-image" style={{ backgroundImage: `url(${image})` }}>
            <button className="adm_like-button" onClick={(e) => e.stopPropagation()}>
                <span className="adm_like-icon-wrapper">
                ♡
                <span className="adm_like-count">{likeCount}</span>
                </span>
            </button>
        </div>
        <div className="adm_card-content">
          <h3 className="adm_card-title">{title}</h3>
          <div className="adm_period-info">
            <p>운영 - {operationPeriod}</p>
            <p>설문 - {surveyPeriod}</p>
          </div>
          <button className={`adm_status-button ${status}`} onClick={(e) => e.stopPropagation()}>
            {status}
          </button>
        </div>
      </div>
    );
  };

export default Card;