import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FacultyTransactionPage.css';

const FacultyTransaction = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('소프트웨어융합대학');
  const [selectedFacultyId, setSelectedFacultyId] = useState(4);
  const [years, setYears] = useState([]);
  const [programName, setProgramName] = useState('');
  const [selectedOption, setSelectedOption] = useState('비교과 프로그램 개설');
  const [budgetData, setBudgetData] = useState([]);
  const [allUseBudgetData, setAllUseBudgetData] = useState(null);
  const [allRemainBudgetData, setallRemainBudgetData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchFacultyList = async () => {
      try {
        const response = await axios.get('http://100.94.142.127:3000/faculty');
        setFacultyList(response.data.faculty || []);
      } catch (error) {
        console.error('Faculty list fetch error:', error);
      }
    };

    fetchFacultyList();
  }, []);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const url = selectedOption === 'Mydex 온도 포인트 장학금'
          ? 'http://100.94.142.127:3000/faculty/transactions/mydexpoint/detail'
          : 'http://100.94.142.127:3000/faculty/transactions/program/detail';

        const response = await axios.post(url, {
          faculty_id: selectedFacultyId
        });

        const transactionData = response.data.transaction || [];
        const useProgramMoney = response.data.transaction_use_money[0] || { faculty_type_sum: 0 };
        const remainProgramMoney = response.data.transaction_remian_money[0] || { faculty_budget_amount: 0 };

        const sortedTransactionData = transactionData.sort((a, b) => new Date(b.faculty_payment_date) - new Date(a.faculty_payment_date));

        setBudgetData(sortedTransactionData);
        setFilteredData(sortedTransactionData);
        setAllUseBudgetData(useProgramMoney);
        setallRemainBudgetData(remainProgramMoney);

        const extractedYears = Array.from(new Set(sortedTransactionData.map(item => new Date(item.faculty_payment_date).getFullYear())));
        setYears(extractedYears.sort((a, b) => b - a));
      } catch (error) {
        console.error('Budget data fetch error:', error);
      }
    };

    fetchBudgetData();
  }, [selectedFacultyId, selectedOption]);

  const handleSearch = () => {
    const filtered = budgetData.filter(item =>
      item.department_name && item.department_name.includes(programName)
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleFacultyChange = (event) => {
    const selectedFaculty = facultyList.find(faculty => faculty.faculty_name === event.target.value);
    setSelectedDepartment(event.target.value);
    setSelectedFacultyId(selectedFaculty ? selectedFaculty.faculty_id : null);
  };

  // 페이지네이션 관련 로직
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="adm_faculty_budget_container_money">
      <h2>학부별 예산 처리 거래 내역</h2>

      <div className="adm_controls_wrapper_money">
        <div className="adm_faculty_select_wrapper_money">
          <select 
            value={selectedDepartment}
            onChange={handleFacultyChange}
            className="adm_faculty_department_select_money"
          >
            {facultyList.map((faculty) => (
              <option key={faculty.faculty_id} value={faculty.faculty_name}>{faculty.faculty_name}</option>
            ))}
          </select>

          <select 
            value={selectedOption} 
            onChange={(e) => setSelectedOption(e.target.value)}
            className='adm_department_select_money'>
            <option>비교과 프로그램</option>
            <option>Mydex 온도 포인트 장학금</option>
          </select>
        </div>

        <div className="adm_faculty_budget_info_money">
          <div className="adm_faculty_budget_amounts_money">
            <span>총 남은 금액: {parseInt(allRemainBudgetData?.faculty_budget_amount || 0).toLocaleString()}원</span>
            <span>
              {selectedOption === 'Mydex 온도 포인트 장학금' ? '장학금 사용 금액 합계: ' : '비교과 프로그램 사용 금액 합계: '}
              {parseInt(allUseBudgetData?.faculty_type_sum || 0).toLocaleString()}원
            </span>
          </div>
        </div>
        <div className="adm_faculty_period_select_money">
          <input 
            type="text"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            placeholder={selectedOption === 'Mydex 온도 포인트 장학금' ? '이름으로 검색' : '학과 이름으로 검색'}
            className="adm_faculty_department_select_search_money"
          />
          <button className="adm_faculty_department_search_btn_119_money" onClick={handleSearch}>검색</button>
        </div>

        <div className="adm_faculty_table_container_money">
          <table>
            <thead>
              <tr>
                {selectedOption === 'Mydex 온도 포인트 장학금' ? (
                  <>
                    <th>학과</th>
                    <th>학번</th>
                    <th>이름</th>
                    <th>받은 Mydex 온도 포인트 장학금</th>
                    <th>예산 결제 날짜</th>
                  </>
                ) : (
                  <>
                    <th>학과</th>
                    <th>비교과 프로그램 번호</th>
                    <th>비교과 프로그램 이름</th>
                    <th>거래 금액</th>
                    <th>Mydex 온도 포인트</th>
                    <th>예산 결제 날짜</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  {selectedOption === 'Mydex 온도 포인트 장학금' ? (
                    <>
                      <td>{item.department_name}</td>
                      <td>{item.stu_id}</td>
                      <td>{item.stu_name}</td>
                      <td>{item.requested_scholarship_points}</td>
                      <td>{item.faculty_payment_date.split('T')[0]}</td>
                    </>
                  ) : (
                    <>
                      <td>{item.department_name}</td>
                      <td>{item.program_id}</td>
                      <td>{item.program_name}</td>
                      <td className={item.faculty_used_budget < 0 ? 'adm_negative_money' : 'adm_positive_money'}>
                        {item.faculty_used_budget > 0 ? '+' : ''}{item.faculty_used_budget.toLocaleString()}원
                      </td>
                      <td>{item.program_mydex_points}</td>
                      <td>{item.faculty_payment_date.split('T')[0]}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 검색 안내 메시지 */}
        <div className="adm_faculty_search_wrapper_money">
          <p className="adm_faculty_point_notice_money">Mydex 온도 포인트는 1점 당 5000원 입니다.</p>
        </div>

        {/* 페이지네이션 */}
        <div className="adm_pagination_money">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="adm_pagination_arrow_money">
            &lt;
          </button>
          {pageNumbers.map(number => (
            <button key={number} onClick={() => paginate(number)} className={`adm_pagination_button_money ${currentPage === number ? 'adm_active_money' : ''}`}>
              {number}
            </button>
          ))}
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length} className="adm_pagination_arrow_money">
            &gt;
          </button>
        </div>

      </div>
    </div>
  );
};

export default FacultyTransaction;
