import React from 'react';
import { useLocation } from 'react-router-dom';  // URL에서 쿼리 파라미터를 가져오기 위한 훅

function Dashboard() {
  const location = useLocation();
  
  // URLSearchParams를 사용하여 쿼리 파라미터에서 pro_id를 추출
  const params = new URLSearchParams(location.search);
  const proId = params.get('pro_id');  // URL에서 pro_id 추출

  return (
    <div>
      <h2>대시보드</h2>
      <p>교수 ID: {proId}</p> {/* pro_id를 화면에 표시 */}
    </div>
  );
}

export default Dashboard;
