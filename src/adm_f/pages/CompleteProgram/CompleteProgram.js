import React, { useState, useEffect } from 'react';
import Card from '../../component/Card/Card';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './completeprogram.css';

const CompleteProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 8;

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const userString = sessionStorage.getItem('admin');
      const user = JSON.parse(userString);

      if (!user || !user.adm_id) {
        console.error('관리자 정보가 없습니다.');
        return;
      }

      const response = await axios.get('http://100.94.142.127:3000/programs/fin', {
        params: { adm_id: user.adm_id }
      });
      setPrograms(response.data.programs);
      setLoading(false);
    } catch (error) {
      console.error('완료된 프로그램 목록을 가져오는데 실패했습니다:', error);
      setError('데이터를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredPrograms = programs.filter(program =>
    program.program_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  const handleProgramClick = (programId) => {
    navigate('/adm/completedetail', { state: { programId } });
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="adm_complete-list-container">
      <h2 className="adm_list-title">비교과 프로그램 완료 목록</h2>
      
      <div className="adm_search-container">
        <input
          type="text"
          placeholder="비교과프로그램 검색하기"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="adm_program-grid">
        {currentItems.map((program) => (
          <Card
            key={program.program_id}
            title={program.program_name}
            image={program.program_poster_image}
            operationPeriod={`${new Date(program.program_operation_start_time).toLocaleDateString()} ~ ${new Date(program.program_operation_end_time).toLocaleDateString()}`}
            surveyPeriod={`${new Date(program.program_survey_start_time).toLocaleDateString()} ~ ${new Date(program.program_survey_end_time).toLocaleDateString()}`}
            status={program.program_status}
            likeCount={program.program_mydex_points}
            onClick={() => handleProgramClick(program.program_id)}
          />
        ))}
      </div>

      <div className="adm_pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
      </div>

      <button onClick={() => navigate(-1)} className="adm_back-button">뒤로가기</button>
    </div>
  );
};

export default CompleteProgram;
