import React, { useState, useEffect } from "react";
import axios from "axios";
import CardList from "../CardList/CardList";
import { Link } from 'react-router-dom';
import './program.css';

const Program = () => {
    const [pro, setPro] = useState([]);

    useEffect(() => {
        fetchApplicationList();
    }, []);

    const fetchApplicationList = async () => {
        try {
            const userString = sessionStorage.getItem('user');
            const user = JSON.parse(userString);

            if (!user || !user.adm_id) {
                console.error('사용자 정보가 없습니다.');
                return;
            }

            const response = await axios.get(`http://100.94.142.127:3000/programs/fin`, {
                params: { adm_id: user.adm_id },
            });
            console.log('API 응답:', response.data);
            console.log(sessionStorage.getItem('user'));
            setPro(response.data.programs);
        } catch (error) {
            console.error('프로그램 목록을 가져오는 데 실패했습니다:', error);
        }
    };

    return (
        <div className="program-container">
            <h2 className="program-title">비교과 프로그램 관리</h2>
            <table className="program-table">
                <thead>
                    <tr>
                        <th>프로그램 이름</th>
                        <th>설문조사 기간</th>
                        <th>운영 기간</th>
                        <th>프로그램 상태</th>
                    </tr>
                </thead>
                <tbody>
                    {pro.map((program, index) => (
                        <tr key={index}>
                            <td>{program.program_name}</td>
                            <td>{`${new Date(program.program_survey_start_time).toLocaleDateString()} - ${new Date(program.program_survey_end_time).toLocaleDateString()}`}</td>
                            <td>{`${new Date(program.program_operation_start_time).toLocaleDateString()} - ${new Date(program.program_operation_end_time).toLocaleDateString()}`}</td>
                            <td>
                                <button>{program.program_status}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="program-links">
                <Link to="/adm/completeprogram" className="more-link">프로그램 완료 목록 보러 가기 ＞</Link>
            </div>

            <CardList/>
        </div>
    );
};

export default Program;