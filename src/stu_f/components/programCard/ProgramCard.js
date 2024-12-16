import React from 'react';
import TempPoint from './TempPoint';
import ActionButton from './ActionButton';
import './ProgramCard.css';
import {useNavigate } from 'react-router-dom';

function ProgramCard({ program }) {

  const navigate = useNavigate();

  const handleClick = () => {
    console.log("보내느 프로그램 아이디 값:", program.program_id);
    navigate("/stu/programdetailpage", { state: { programId: program.program_id } });
  };



  return (
    <div className="program-card-v1" onClick={handleClick}>
      {/* 상단 포인트 */}
      <div className="program-card-header-v1">
        <TempPoint points={program.program_mydex_points} /> {/* 마이덱스 포인트 */}
      </div>

      {/* 이미지 */}
      <img
        src={program.program_poster_image} /* 서버 이미지 URL */
        alt={program.program_name}
        className="program-image-v1"
      />

      {/* 내용 */}
      <div className="program-content-v1">
        <h3 className="program-title-v1">{program.program_name}</h3> {/* 프로그램 이름 */}
        <p className="program-dates-v1">접수 기간: {program.applicationPeriod}</p> {/* 접수 기간 */}
        <p className="program-dates-v1">운영 기간: {program.operationPeriod}</p> {/* 운영 기간 */}
      </div>

      {/* 하단 버튼 */}
      <div className="program-card-footer-v1">
        <ActionButton label={program.stu_program_status} /> {/* 상태를 버튼 텍스트로 */}
      </div>
    </div>
  );
}

export default ProgramCard;
