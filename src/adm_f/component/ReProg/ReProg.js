import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './reprog.css'

const ReProg = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplicationList();
  }, []);

  const fetchApplicationList = async () => {
    try {
      const adminString = sessionStorage.getItem('admin');
      const admin = JSON.parse(adminString);

      console.log(adminString)
      console.log(admin)
      // if (!admin || !admin.adm_id) {
      //   console.error('사용자 정보가 없습니다.');
      //   return;
      // }

      const response = await axios.get(`http://100.94.142.127:3000/remedialprogram`, {
        params: { adm_id: admin.adm_id },
      });
      
      // 평가가 필요한 신청(processing_result가 null인 경우)만 필터링
      const pendingApplications = response.data.remedial_program_application_list.filter(
        app => app.processing_result === null
      );
      setApplications(pendingApplications);
    } catch (error) {
      console.error('구제 프로그램 신청 목록을 가져오는 데 실패했습니다:', error);
    }
  };

  return (
    <div className="adm_mydex-container">
      <div className="adm_program-container">
        <div className="adm_program-header">구제프로그램 신청 목록</div>
        <table className="adm_mydex-table">
          <thead>
            <tr>
              <th>구제프로그램 이름</th>
              <th>학번</th>
              <th>이름</th>
              <th>승인</th>
            </tr>
          </thead>
          <tbody>
            {applications.slice(0, 4).map((app, index) => (
              <tr key={index}>
                <td>{app.remedialprogram_name}</td>
                <td>{app.stu_id}</td>
                <td>{app.stu_name}</td>
                <td>평가하기</td>
              </tr>
            ))}
          </tbody>
        </table>
        <a href="/adm/reliefprogram" className="adm_more-link">구제프로그램 신청 목록 ＞</a>
      </div>
    </div>
  );
};

export default ReProg;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../css/reprog.css'

// const ReProg = () => {
//   const [applications, setApplications] = useState([]);

//   useEffect(() => {
//     fetchApplicationList();
//   }, []);

//   const fetchApplicationList = async () => {
//     try {
//       const userString = sessionStorage.getItem('user');
//       const user = JSON.parse(userString);

//       if (!user || !user.adm_id) {
//         console.error('사용자 정보가 없습니다.');
//         return;
//       }

//       const response = await axios.get(`http://100.94.142.127:3000/remedialprogram`, {
//         params: { stu_id: user.stu_id },
//       });
//       setApplications(response.data.remedialprogramapplicationlist);
//     } catch (error) {
//       console.error('구제 프로그램 신청 목록을 가져오는 데 실패했습니다:', error);
//     }
//   };

//   return (
//     <div className="mydex-container">
//       <div className="program-container">
//         <div className="program-header">구제프로그램 신청 목록</div>
//         <table className="mydex-table">
//           <thead>
//             <tr>
//               <th>구제프로그램 이름</th>
//               <th>학번</th>
//               <th>이름</th>
//               <th>승인</th>
//             </tr>
//           </thead>
//           <tbody>
//             {applications.slice(0, 5).map((app, index) => (
//               <tr key={index}>
//                 <td>{app.remedialprogram_name}</td>
//                 <td>{app.stu_id}</td>
//                 <td>{app.stu_name}</td>
//                 <td>
//                   {app.processing_result === null ? '평가하기' : '평가 완료'}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <a href="/repage" className="more-link">구제프로그램 신청 목록 ＞</a>
//       </div>
//     </div>
//   );
// };

// export default ReProg;