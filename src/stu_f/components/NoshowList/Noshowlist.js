import React, { useState } from "react";
import "./Noshowlist.css";

function NoShowList({ noShowHistory }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 날짜 순 정렬 (최신 데이터가 맨 위로 오게)
  const sortedHistory = [...noShowHistory].sort((a, b) =>
    new Date(b.noshowhistory_change_date) - new Date(a.noshowhistory_change_date)
  );

  // 페이지네이션 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedHistory.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "정보 없음";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="noshow-container">
      {sortedHistory.length > 0 ? (
        <>
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
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.noshowhistory_recv_count}</td>
                    <td>{formatDate(item.noshowhistory_change_date)}</td>
                    <td>{item.history_reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 페이지네이션 */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="noshow-empty-message">
          <p>노쇼 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
}

export default NoShowList;
