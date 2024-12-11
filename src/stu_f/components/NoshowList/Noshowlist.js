import React from "react";
import "./Noshowlist.css";

function NoShowList({ noShowHistory }) {
  return (
    <div className="noshow-container">
      {noShowHistory.length > 0 ? (
        <div className="noshow-table-container">
          <table className="noshow-table">
            <thead>
              <tr>
                <th>노쇼 횟수</th>
                <th>노쇼 횟수 변경 날짜</th>
                <th>노쇼 부여 사유</th>
              </tr>
            </thead>
            <tbody>
              {noShowHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.noshowhistory_recv_count}</td>
                  <td>{item.noshowhistory_change_date}</td>
                  <td>{item.noshowhistory_reason_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="noshow-empty-message">
          <p>노쇼 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
}

export default NoShowList;