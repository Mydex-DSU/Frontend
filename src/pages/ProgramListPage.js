import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserDataContext } from "../context/userDataContext";
import MydexPoints from "../components/MydexPoints/MydexPoints";
import ProgramCard from "../components/programCard/ProgramCard";
import "./ProgramListPage.css"; // 스타일

function ProgramListPage() {
  const { userData } = useContext(UserDataContext);
  const [programs, setPrograms] = useState([]); // 전체 프로그램 데이터
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [filteredPrograms, setFilteredPrograms] = useState([]); // 검색 결과
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const programsPerPage = 8; // 페이지당 표시할 프로그램 수

  // 데이터 가져오기
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get("http://100.94.142.127:3000/profile/program");
        const allPrograms = response.data?.all_program || [];
        setPrograms(allPrograms);
        console.log("프로그램 목록들 데이터 :",response.data?.all_program)
        setFilteredPrograms(allPrograms); // 초기 필터링 데이터
      } catch (error) {
        console.error("비교과 프로그램 데이터를 가져오지 못했습니다:", error);
      }
    };

    fetchProgramData();
  }, []);

  // 검색어로 프로그램 필터링

  useEffect(() => {
    const filtered = programs.filter((program) =>
      program.program_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrograms(filtered);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  }, [searchTerm, programs]);

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  // 페이지네이션 데이터 계산
  const indexOfLastProgram = currentPage * programsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
  const currentPrograms = filteredPrograms.slice(indexOfFirstProgram, indexOfLastProgram);

  // 페이지 변경 핸들러
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="program-list-page">
      {/* 사용자 정보 표시 */}
      <div>
        {userData ? (
          <MydexPoints userData={userData} />
        ) : (
          <p>사용자 데이터를 로드할 수 없습니다.</p>
        )}
      </div>

      {/* 검색창 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="비교과 프로그램을 검색하세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 프로그램 카드 */}
      <div className="program-card-container">
        {currentPrograms.length > 0 ? (
          currentPrograms.map((program) => (
            <ProgramCard
              key={program.program_id}
              program={{
                program_id: program.program_id,
                program_mydex_points: program.program_mydex_points,
                program_poster_image: program.program_poster_image,
                program_name: program.program_name,
                applicationPeriod: `${formatDate(
                  program.program_application_start_time
                )} ~ ${formatDate(program.program_application_end_time)}`,
                operationPeriod: `${formatDate(
                  program.program_operation_start_time
                )} ~ ${formatDate(program.program_operation_end_time)}`,
                stu_program_status: program.program_status,
              }}
            />
          ))
        ) : (
          <p>검색된 프로그램이 없습니다.</p>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredPrograms.length / programsPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default ProgramListPage;
