import React, { useState, useEffect } from "react";
import Card from "../../component/Card/Card";
import './programlist.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ProgramList = () => {
    const [programs, setPrograms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const adminString = sessionStorage.getItem('admin');
            const admin= JSON.parse(adminString);

            if (!admin || !admin.adm_id) {
                console.error('사용자 정보가 없습니다.');
                return;
            }

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
        navigate(-1);
    };

    return (
        <div className="adm_program-list-container">
            <h2>프로그램 목록</h2>
            <div className="adm_program-list">
                {programs.map(program => (
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
            <button onClick={handleBack}>뒤로가기</button>
        </div>
    );
}

export default ProgramList;