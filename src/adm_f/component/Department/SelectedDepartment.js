import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './selectedDepartment.css';
import axios from 'axios';

const SelectedDepartment = () => {
  const [programsData, setProgramsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://100.94.142.127:3000/programs/noshowgraph/list');
        if (response.data && response.data.programlist) {
          setProgramsData(response.data.programlist);
        } else {
          setError('데이터 형식이 올바르지 않습니다.');
        }
      } catch (error) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDetailClick = (programId) => {
    navigate('/adm/noshowdetail', { state: { programId } });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = programsData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(programsData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="adm_budget-container">
      <h2 className='adm_header_name'>프로그램별 노쇼 상세</h2>   
      <div className="adm_controls-wrapper">
        <div className="adm_table-container">
          {isLoading && <p>데이터를 불러오는 중입니다...</p>}
          {error && <p>{error}</p>}
          {!isLoading && !error && programsData.length > 0 && (
            <>
              <table className="adm_table1">
                <thead className="adm_thead">
                  <tr className="adm_tr">
                    <th className="adm_th">프로그램 이름</th>
                    <th className="adm_th">수용 인원</th>
                    <th className="adm_th">참여 인원</th>
                    <th className="adm_th">노쇼 설문조사 인원</th>
                    <th className="adm_th">노쇼비율</th>
                    <th className="adm_th">상세보기</th>
                  </tr>
                </thead>
                <tbody className="adm_tbody">
                  {currentItems.map((program) => (
                    <tr key={program.program_id} className="adm_tr">
                      <td className="adm_td">{program.program_name}</td>
                      <td className="adm_td">{program.program_max_participants}</td>
                      <td className="adm_td">{program.total_program_count}명</td>
                      <td className="adm_td">{program.no_show_count}</td>
                      <td className="adm_td">
                        {program.no_show_rate}
                        {/* {program.no_show_rate > 0
                          ? `${(Number(program.no_show_student) / program.total_program_links * 100).toFixed(2)}%`
                          : '0%'} */}
                      </td>
                      <td className="adm_td">
                        <button 
                          className='adm_detail_btn' 
                          onClick={() => handleDetailClick(program.program_id)}
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {programsData.length > itemsPerPage && (
                <div className="adm_pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`adm_pagination_btn ${currentPage === pageNumber ? 'adm_active' : ''}`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedDepartment;
