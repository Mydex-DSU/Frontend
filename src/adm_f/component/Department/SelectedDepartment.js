// SelectedDepartment.jsx
import React, { useState, useEffect } from 'react';
import './selectedDepartment.css';
import axios from 'axios';

const SelectedDepartment = () => {
  const [programData, setProgramData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://100.94.142.127:3000/programs/noshowgraph/detail', {
          program_id: 18
        });
        setProgramData(response.data.noshowGraph.programData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="adm_budget-container">
      <h2 className='adm_header_name'>프로그램별 노쇼 상세</h2>   
      <div className="adm_controls-wrapper">
        <div className="adm_table-container">
          <table>
            <thead>
              <tr>
                <th>프로그램 이름</th>
                <th>수용 인원</th>
                <th>참여 인원</th>
                <th>노쇼 인원</th>
                <th>노쇼비율</th>
                <th>상세보기</th>
              </tr>
            </thead>
            <tbody>
              {programData && (
                <tr>
                  <td>{programData.program_description}</td>
                  <td>{programData.program_max_participants}</td>
                  <td>{programData.전체_참여_인원}명</td>
                  <td>{programData.노쇼_인원}</td>
                  <td>{`${(Number(programData.노쇼_인원) / programData.전체_참여_인원 * 100).toFixed(2)}%`}</td>
                  <td><button className='adm_detail_btn'>상세보기</button></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SelectedDepartment;
