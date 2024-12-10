import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './evaluationdetail.css';

const EvaluationDetail = () => {
    const [student, setStudent] = useState(null);
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pointsInput, setPointsInput] = useState('');
    const { programId, studentId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentDetail = async () => {
            try {
                const userString = sessionStorage.getItem('user');
                const user = JSON.parse(userString);

                if (!user || !user.adm_id) {
                    throw new Error('관리자 정보가 없습니다.');
                }

                const response = await axios.post('http://100.94.142.127:3000/programs/fin/detail', {
                    program_id: parseInt(programId),
                    adm_id: user.adm_id,
                    stu_id: parseInt(studentId)
                });

                if (response.data.programs && response.data.programs.length > 0) {
                    setProgram(response.data.programs[0]);
                    const studentData = response.data.program_student.find(
                        s => s.stu_id === parseInt(studentId)
                    );
                    setStudent(studentData);
                }
            } catch (error) {
                setError(error.message || '데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetail();
    }, [programId, studentId]);

    const handleConfirm = async () => {
        try {
            if (!pointsInput) {
                alert('포인트를 입력해주세요.');
                return;
            }

            const userString = sessionStorage.getItem('user');
            const user = JSON.parse(userString);

            await axios.post('http://100.94.142.127:3000/programs/fin/evaluation', {
                program_id: parseInt(programId),
                stu_id: parseInt(studentId),
                stu_give_mydex_points: parseInt(pointsInput)
            });

            navigate(`/adm/completedetail/${programId}`);
        } catch (error) {
            alert('평가 저장에 실패했습니다.');
        }
    };

    if (loading) return <div className="loading">로딩 중...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!student) return <div className="no-data">학생 정보가 없습니다.</div>;

    return (
        <div className="evaluation-container">
            <h1 className="evaluation-title">학생 평가하기 상세</h1>
            
            <div className="notification-box">
                <div className="icon-text">
                    <span className="bell-icon">🔔</span>
                    <div className="notification-text">
                    <div className="notification-text">
                            <p>이 비교과 프로그램의 종류는 {program.programtype_name}입니다.</p>
                            <p>학생의 출석률({student.attendance_rate || '0'}%)로 비교과 참여여부를 판단하세요.</p>
                            <p>이 비교과프로그램에서 학생에게 부여할 포인트는 {program.program_mydex_points}점입니다.</p>
                            <p>그러므로 출석률 {program.attendance_criteria || '50'}%가 노쇼 기준 입니다.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="points-info">
                <p>학생에게 부여할 수 있는 포인트는 -{program.program_mydex_points},~{program.program_mydex_points}점 입니다.</p>
            </div>

            <div className="student-info">
                <table>
                    <thead>
                        <tr>
                            <th>학생 학번</th>
                            <th>학생 이름</th>
                            <th>출석률</th>
                            <th>수상여부</th>
                            <th>보고서 제출 여부</th>
                            <th>참여여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{student.stu_id}</td>
                            <td>{student.stu_name}</td>
                            <td>{student.attendance_rate || '-'}%</td>
                            <td>{student.award_status || '-'}</td>
                            <td>{student.report_submission_status || '-'}</td>
                            <td>{student.participation_status ? '1' : '-'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="points-input">
                <h3>학생이 받을 Mydex 온도 포인트 부여</h3>
                <input 
                    type="text" 
                    placeholder="Mydex 온도 포인트를 부여해주세요."
                    className="points-input-field"
                    value={pointsInput}
                    onChange={(e) => setPointsInput(e.target.value)}
                />
            </div>

            <div className="modal-content">
                <button 
                    className="confirm-button"
                    onClick={handleConfirm}
                >
                    확인
                </button>
            </div>
        </div>
    );
};

export default EvaluationDetail;