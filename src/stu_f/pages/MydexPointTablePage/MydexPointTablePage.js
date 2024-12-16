import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MydexPointTablePage.css';
import MydexPoints from '../../components/MydexPoints/MydexPoints';

const MydexPointTable = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체 보기'); // 선택된 카테고리
  const [data, setData] = useState([]); // API에서 가져온 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [userData,setUserData] = useState([]);

  // 카테고리 목록 (API 값과 정확히 일치하도록 설정)
  const categories = ['전체 보기', '온도 포인트 장학금', '비교과프로그램', '구제프로그램'];

  // 학생 아이디를 localStorage에서 가져오기
  const stuId = sessionStorage.getItem('stu_id');

  // 카테고리 변경 핸들러
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(()=>{
    const fetchUserData = async() =>{
        try{
          const response = await axios.post('http://100.94.142.127:3000/profile',{
            stu_id: stuId
          })
          setUserData(response.data.student_profile);
        }catch{
          console.log("프로필 에러")
        };
  
      };
      fetchUserData();

  },[])



  // API 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (!stuId) {
        setError('학생 아이디가 없습니다. 로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(
          'http://100.94.142.127:3000/mydexscholarshipapplication/detail',
          { stu_id: stuId }, // sessionStorage에서 가져온 학생 ID 전달
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('API Response:', response.data);

        if (response.data && Array.isArray(response.data.mydexscholarshipdetail)) {
          // 데이터 설정
          setData(response.data.mydexscholarshipdetail);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stuId]);

  return (
    <div className="page-background-stu">
      <div className="table-container-stu">
        {/* 사용자 정보 표시 */}
      <div>
        {userData ? (
          <MydexPoints userData={userData} />
        ) : (
          <p>사용자 데이터를 로드할 수 없습니다.</p>
        )}
      </div>

        <h1 className="table-title-stu">Mydex 온도 포인트 거래 내역</h1>

        {/* 승인 구분 카테고리 */}
        <div className="category-container-stu">
          <label htmlFor="category-select-stu" className="category-label-stu">
            승인 구분 카테고리:
          </label>
          <select
            id="category-select-stu"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-select-stu"
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* 로딩 및 에러 처리 */}
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <table className="mydex-point-table-stu">
            <thead>
              <tr>
                <th>학생 학번</th>
                <th>승인 구분</th>
                <th>승인 금액</th>
                <th>내역 처리 날짜</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter(
                  (item) =>
                    selectedCategory === '전체 보기' || item.mydexpointshistory_reason_name === selectedCategory
                )
                .map((item) => (
                  <tr key={item.mydexpointshistory_id}>
                    <td>{item.stu_id}</td> {/* 학생 학번 */}
                    <td>{item.mydexpointshistory_reason_name}</td> {/* 승인 구분 */}
                    <td>{item.mydexpointshistory_recv_count} 포인트</td> {/* 승인 금액 */}
                    <td>{new Date(item.mydexpointshistory_change_date).toLocaleString('ko-KR')}</td> {/* 내역 처리 날짜 */}
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MydexPointTable;
