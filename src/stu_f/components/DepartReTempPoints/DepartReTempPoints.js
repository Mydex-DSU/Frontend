import React from 'react';
import './DepartReTempPoints.css'; // 스타일링 파일

function DepartReTempPoint({departReTemp}) {
    return (
        <div className='depart-re-temp-point'>
            <div className='department-title-box'>
                <h2 className='department-title'>{departReTemp.department_name}</h2>
            </div>
            <div className='point-container'>
                <div className='remain-point-box'>
                    <h2>{departReTemp.faculty_mydex_points}</h2>
                </div>
                <div className="go-to-scholarship-application">
                    <a href="#scholarship">장학금 신청하러가기</a>
                </div>
            </div>
        </div>
    );
}

export default DepartReTempPoint;
