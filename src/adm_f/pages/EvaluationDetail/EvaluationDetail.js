import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './evaluationdetail.css';

const EvaluationDetail = () => {
    const [student, setStudent] = useState(null);
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pointsInput, setPointsInput] = useState('');
    const location = useLocation();
    const { programId, studentId } = location.state || {};
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentDetail = async () => {
            try {
                const response = await axios.post('http://100.94.142.127:3000/programs/fin/detail', {
                    program_id: parseInt(programId)
                });

                if (response.data.programs && response.data.programs.length > 0) {
                    console.log(response.data.programs[0])
                    setProgram(response.data.programs[0]);
                    const studentData = response.data.program_student.find(
                        s => s.stu_id === parseInt(studentId)
                    );
                    if (studentData) {
                        console.log(studentData)
                        setStudent(studentData);
                        setPointsInput(studentData.stu_give_mydex_points?.toString() || '');
                    }
                }
            } catch (error) {
                setError(error.message || '데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (programId && studentId) {
            fetchStudentDetail();
        } else {
            setError('프로그램 ID 또는 학생 ID가 없습니다.');
            setLoading(false);
        }
    }, [programId, studentId]);

    const handleConfirm = async () => {
        try {
            if (!pointsInput) {
                alert('포인트를 입력해주세요.');
                return;
            }

            const response = await axios.post('http://100.94.142.127:3000/programs/fin/evaluation', {
                program_id: parseInt(programId),
                stu_id: parseInt(studentId),
                stu_give_mydex_points: parseInt(pointsInput)
            });

            alert(response.data.message);
            navigate('/adm/completedetail', { state: { programId } });
        } catch (error) {
            alert('평가 저장에 실패했습니다.');
        }
    };
    const getProgramTypeInfo = () => {
        if (!program || !student) return null;
    
        switch (program.programtype_name) {
            case '특강': // 출석률 기반 프로그램
                let pointsDescription = "";
                const maxPoints = program.program_mydex_points;
                const attendanceRate = student.attendance_rate || 0;
            
                // 출석률에 따른 실제 포인트 계산 로직
                const calculateAttendancePoints = (rate, max) => {
                    if (rate < 10) return -max;
                    if (rate < 20) return -max + 1;
                    if (rate < 30) return -max + 2;
                    if (rate < 40) return -max + 3;
                    if (rate < 50) return -max + 4;
                    if (rate < 60) return 1;
                    if (rate < 70) return 2;
                    if (rate < 80) return 3;
                    if (rate < 90) return 4;
                    return max;
                };
            
                const actualPoints = calculateAttendancePoints(attendanceRate, maxPoints);
                
                // 포인트 설명 로직 (이전과 동일)
                switch (maxPoints) {
                    case 1:
                        pointsDescription = `출석률이 50% 미만인 경우 -1점\n출석률이 50% 이상인 경우 1점`;
                        break;
                    case 2:
                        pointsDescription = `출석률이 25% 미만인 경우 -2점\n출석률이 25% 이상 50% 미만인 경우 -1점\n출석률이 50% 이상 75% 미만인 경우 1점\n출석률이 75% 이상인 경우 2점`;
                        break;
                    case 3:
                        pointsDescription = `출석률이 16.67% 미만인 경우 -3점\n출석률이 16.67% 이상 33.33% 미만인 경우 -2점\n출석률이 33.33% 이상 50% 미만인 경우 -1점\n출석률이 50% 이상 66.67% 미만인 경우 1점\n출석률이 66.67% 이상 83.33% 미만인 경우 2점\n출석률이 83.33% 이상인 경우 3점`;
                        break;
                    case 4:
                        pointsDescription = `출석률이 12.5% 미만인 경우 -4점\n출석률이 12.5% 이상 25% 미만인 경우 -3점\n출석률이 25% 이상 37.5% 미만인 경우 -2점\n출석률이 37.5% 이상 50% 미만인 경우 -1점\n출석률이 50% 이상 62.5% 미만인 경우 1점\n출석률이 62.5% 이상 75% 미만인 경우 2점\n출석률이 75% 이상 87.5% 미만인 경우 3점\n출석률이 87.5% 이상인 경우 4점`;
                        break;
                    case 5:
                        pointsDescription = `출석률이 10% 미만인 경우 -5점\n출석률이 10% 이상 20% 미만인 경우 -4점\n출석률이 20% 이상 30% 미만인 경우 -3점\n출석률이 30% 이상 40% 미만인 경우 -2점\n출석률이 40% 이상 50% 미만인 경우 -1점\n출석률이 50% 이상 60% 미만인 경우 1점\n출석률이 60% 이상 70% 미만인 경우 2점\n출석률이 70% 이상 80% 미만인 경우 3점\n출석률이 80% 이상 90% 미만인 경우 4점\n출석률이 90% 이상인 경우 5점`;
                        break;
                    default:
                        pointsDescription = `출석률에 따라 -${maxPoints}점 ~ ${maxPoints}점`;
                }
                return (
                    <>
                        <p>학생의 출석률({student.attendance_rate || '0'}%)로 비교과 참여여부를 판단하세요.</p>
                        <p>이 프로그램의 노쇼 기준은 {program.attendance_criteria || '50'}% 이하 입니다.</p>
                        <p>학생에게 부여할 Mydex 온도 포인트는 {actualPoints}점 입니다.</p>
                        <p>Mydex 온도 포인트 부여 기준:</p>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{pointsDescription}</pre>
                    </>
                );
            case '학습공동체활동': // 보고서 제출 기반 프로그램
                const reportPoints = student.report_submission_status === 1 ? program.program_mydex_points : -program.program_mydex_points;
                return (
                    <>
                        <p>이 프로그램은 보고서 제출 여부로 평가합니다.</p>
                        <p>학생의 보고서 제출 상태: {student.report_submission_status === 1 ? '제출' : '미제출'}</p>
                        <p>학생에게 부여할 Mydex 온도 포인트는: {reportPoints}점 입니다.</p>
                    </>
                );
            case '캠프및워크숍':
            case '클리닉참여':
            case '견학': // 참여 여부 기반 프로그램
                const participationPoints = student.participation_status === 1 ? program.program_mydex_points : -program.program_mydex_points;
                return (
                    <>
                        <p>이 프로그램은 참여 여부로 평가합니다.</p>
                        <p>학생의 참여 상태: {student.participation_status === 1 ? '참여' : '미참여'}</p>
                        <p>학생에게 부여할 Mydex 온도 포인트는: {participationPoints}점 입니다.</p>
                    </>
                );
            default:
                return <p>프로그램 유형을 확인할 수 없습니다.</p>;
        }
    };

    if (loading) return <div className="loading">로딩 중...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!student) return <div className="no-data">학생 정보가 없습니다.</div>;

    return (
        <div className="adm_evaluation-container">
            <h1 className="adm_evaluation-title">학생 평가하기 상세</h1>
            
            <div className="adm_notification-box">
                <div className="adm_icon-text">
                    <span className="adm_bell-icon">🔔</span>
                    <div className="adm_notification-text">
                        <p>이 비교과 프로그램의 이름은 {program.program_name}입니다.</p>
                        {getProgramTypeInfo()}
                    </div>
                </div>
            </div>

            <div className="adm_student-info">
            <table class="adm_table">
                            <thead>
                                <tr>
                                <th class="adm_student_id">학생 학번</th>
                                <th class="adm_student_name">학생 이름</th>
                                <th class="adm_attendance_rate">출석률</th>
                                <th class="adm_report_submission">보고서 제출 여부</th>
                                <th class="adm_participation">참여여부</th>
                                </tr>
                            </thead>
                            <tbody>
                        <tr>
                            <td>{student.stu_id}</td>
                            <td>{student.stu_name}</td>
                            <td>{student.attendance_rate !== null ? `${student.attendance_rate}%` : ''}</td>
                            <td>{student.report_submission_status !== null ? (student.report_submission_status ? '제출' : '미제출') : ''}</td>
                            <td>{student.participation_status !== null ? (student.participation_status ? '참여완료' : '미완료') : ''}</td>

                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="adm_points-input">
                <h3>학생이 받을 Mydex 온도 포인트 부여</h3>
                <input 
                    type="text" 
                    placeholder="Mydex 온도 포인트를 부여해주세요."
                    className="adm_points-input-field"
                    value={pointsInput}
                    onChange={(e) => setPointsInput(e.target.value)}
                />
            </div>

            <div className="adm_modal-content">
                <button 
                    className="confirm-button"
                    onClick={handleConfirm}>
                    확인
                </button>
            </div>
        </div>
    );
};

export default EvaluationDetail;
