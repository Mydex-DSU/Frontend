import React, { useState, useEffect } from "react";
import Card from "../../component/Card/Card";
import './programlist.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ProgramList = () => {
    const [programs, setPrograms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();

    const itemsPerPage = 12;

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const adminString = sessionStorage.getItem('admin');
            const admin = JSON.parse(adminString);

            const response = await axios.get(`http://100.94.142.127:3000/programs`, {
                params: { adm_id: admin.adm_id },
            });
            setPrograms(response.data.programs);
        } catch (error) {
            console.error('프로그램 신청 목록을 가져오는 데 실패했습니다:', error);
        }
    };

    const handleCardClick = (programId) => {
        navigate('/adm/applicationprogram', { state: { programId } });
    };

    const handleBack = () => {
        navigate('/adm/admmainpage');
    };

    const handleProgramRegistration = () => {
        navigate('/adm/programregistration');
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredPrograms = programs.filter(program => {
        const nameMatch = program.program_name.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === 'all' ? true : program.program_status === statusFilter;
        return nameMatch && statusMatch;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

    return (
        <div className="adm_program-list-container">
            <h2 className="adm_list-title">프로그램 목록</h2>
            <div>
                <button onClick={handleProgramRegistration} className="adm_register-button1">프로그램 등록</button>
            </div>
            <div className="adm_filter-container">
                <div className="adm_search-container">
                    <input
                        type="text"
                        placeholder="프로그램 검색하기"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="adm_search-input"
                    />
                </div>
                
                <div className="adm_status-filter">
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="adm_status-select"
                    >
                        <option value="all">전체</option>
                        <option value="대기중">대기중</option>
                        <option value="모집중">모집중</option>
                        <option value="모집완료">모집완료</option>
                    </select>
                </div>
            </div>

            <div className="adm_program-grid">
                {currentItems.map(program => (
                    <Card
                        key={program.program_id}
                        title={program.program_name}
                        image={program.program_poster_image}
                        operationPeriod={`${new Date(program.program_operation_start_time).toLocaleDateString()} ~ ${new Date(program.program_operation_end_time).toLocaleDateString()}`}
                        surveyPeriod={`${new Date(program.program_survey_start_time).toLocaleDateString()} ~ ${new Date(program.program_survey_end_time).toLocaleDateString()}`}
                        status={program.program_status}
                        likeCount={program.program_mydex_points}
                        onClick={() => handleCardClick(program.program_id)}
                    />
                ))}
            </div>

            <div className="adm_pagination">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="adm_pagination-arrow"
                >
                    &lt;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`adm_pagination-button ${currentPage === number ? 'active' : ''}`}
                    >
                        {number}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="adm_pagination-arrow"
                >
                    &gt;
                </button>
            </div>

            <button onClick={handleBack} className="adm_back-button">뒤로가기</button>
        </div>
    );
}

export default ProgramList;
