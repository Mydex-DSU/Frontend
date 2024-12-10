import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserDataContext } from "../../../context/userDataContext";
import ApplyPopup from "../../../components/ApplyPopup/ApplyPopup";
import "./ProgramDetailPage.css";
import axios from "axios";

function ProgramDetailPage() {
  const location = useLocation();
  const programId = location.state?.programId || null;
  const { userData } = useContext(UserDataContext);
  const [programDetail, setProgramDetail] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [eligibilityMessage, setEligibilityMessage] = useState("");
  const [isEligible, setIsEligible] = useState(false); // 신청 가능 여부
  const [participatedProgramIds, setParticipatedProgramIds] = useState([]); // 신청/참여 프로그램 ID 목록

  useEffect(() => {
    if (programId) {
      fetchProgramDetail(programId);
      fetchParticipatedPrograms();
    } else {
      console.error("Program ID is missing");
    }
  }, [programId]);

  useEffect(() => {
    if (userData && programDetail) {
      checkEligibility();
    }
  }, [userData, programDetail, participatedProgramIds]);

  const fetchProgramDetail = async (id) => {
    try {
      const response = await axios.post(
        "http://100.94.142.127:3000/profile/program/detail",
        { program_id: id }
      );
      setProgramDetail(response.data.program_detail_all[0]);
    } catch (error) {
      console.error("Error fetching program details:", error.response?.data || error.message);
    }
  };

  const fetchParticipatedPrograms = async () => {
    const stuId = sessionStorage.getItem("stu_id");
    try {
      const response = await axios.post("http://100.94.142.127:3000/stuprogram", {
        stu_id: stuId,
      });
      const programIds = response.data.student_join_programs.map(
        (program) => program.program_id
      );
      setParticipatedProgramIds(programIds); // 학생의 신청/참여 프로그램 ID 목록 저장
    } catch (error) {
      console.error("Error fetching participated programs:", error.response?.data || error.message);
    }
  };

  const checkEligibility = () => {
    const now = new Date();
    const applicationStart = new Date(programDetail.program_application_start_time);
    const applicationEnd = new Date(programDetail.program_application_end_time);

    const isWithinApplicationPeriod = now >= applicationStart && now < applicationEnd;
    const isUnderCapacity =
      programDetail.program_application_student < programDetail.program_max_participants;
    const hasEnoughPoints =
      userData.stu_current_mydex_points >= programDetail.program_mydex_points;

    const isAlreadyParticipating = participatedProgramIds.includes(programId);

    // 경고 횟수 처리
    let warningMessage = "";
    let warningEligible = true; // 기본적으로 신청 가능

    if (userData.stu_current_warning_count === 1) {
      warningMessage = "현재 경고 횟수가 1회입니다.";
    } else if (userData.stu_current_warning_count === 2) {
      warningMessage = "현재 경고 횟수가 2회입니다.";
    } else if (userData.stu_current_warning_count >= 3) {
      warningMessage = "경고 횟수가 초과되어 신청할 수 없습니다.";
      warningEligible = false; // 신청 불가능
    }

    // 최종 신청 가능 여부 계산
    const canApply =
      isWithinApplicationPeriod &&
      isUnderCapacity &&
      hasEnoughPoints &&
      warningEligible &&
      !isAlreadyParticipating;

    setIsEligible(canApply); // 신청 가능 여부 업데이트

    // 메시지 설정
    if (isAlreadyParticipating) {
      setEligibilityMessage("신청 완료한 프로그램입니다.");
    } else if (!isWithinApplicationPeriod) {
      setEligibilityMessage("신청 기간이 아닙니다.");
    } else if (!isUnderCapacity) {
      setEligibilityMessage("신청 인원이 초과되었습니다.");
    } else if (!hasEnoughPoints) {
      setEligibilityMessage("MyDex 온도 포인트가 부족합니다.");
    } else {
      setEligibilityMessage(warningMessage || "프로그램을 신청하시겠습니까?");
    }
  };

  const handleApply = () => {
    setShowPopup(true);
  };

  return (
    <div className="program-detail-page">
      <div className="detail-header">
        <h1>{programDetail.program_name}</h1>
      </div>
      <div className="detail-container">
        <div className="detail-image">
          <img
            src={programDetail.program_poster_image}
            alt={programDetail.program_name}
          />
        </div>
        <div className="detail-info">
          <p><strong>프로그램 이름:</strong> {programDetail.program_name || "정보 없음"}</p>
          <p><strong>프로그램 설명:</strong> {programDetail.program_description || "정보 없음"}</p>
          <p><strong>담당자 이름:</strong> {programDetail.adm_name || "정보 없음"}</p>
          <p><strong>담당자 번호:</strong> {programDetail.adm_phone || "정보 없음"}</p>
          <p><strong>신청 기간:</strong> {`${programDetail.program_application_start_time} ~ ${programDetail.program_application_end_time}`}</p>
          <p><strong>운영 일시:</strong> {`${programDetail.program_operation_start_time} ~ ${programDetail.program_operation_end_time}`}</p>
          <p><strong>MyDex 온도 포인트:</strong> {programDetail.program_mydex_points || "정보 없음"}점</p>
          <p><strong>프로그램 수용 인원:</strong> {programDetail.program_max_participants || "정보 없음"}명</p>
          <p><strong>프로그램 신청 인원:</strong> {programDetail.program_application_student || 0}명</p>
        </div>
      </div>
      <div className="detail-buttons">
        <button className="back-button" onClick={() => window.history.back()}>
          목록으로
        </button>
        <button className="apply-button" onClick={handleApply}>
          프로그램 신청
        </button>
      </div>
      {showPopup && (
        <ApplyPopup
          programId={programId}
          userData={userData}
          programDetail={programDetail}
          isEligible={isEligible} // 신청 가능 여부 전달
          eligibilityMessage={eligibilityMessage}
          onCancel={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default ProgramDetailPage;
