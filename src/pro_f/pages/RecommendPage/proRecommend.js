import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 추가
import axios from 'axios';

import './proRecommend.css';
import ProHeaderAndButtons from '../../component/proHeaderAndButtons';

function ProRecommendPage() {
  const navigate = useNavigate(); // useNavigate 훅 초기화

  const pro_id = sessionStorage.getItem('pro_id');
  const [formData, setFormData] = useState({
    studentId: '',
    department: '',
    year: '',
    name: '',
    phone: { part1: '', part2: '', part3: '' },
    employmentStatus: 'N',
    graduateStudy: 'N',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    let dataToSubmit = {
      ...formData,
      stu_id: formData.studentId,
      pro_id: pro_id,
    };

    console.log('서버로 보내는 데이터:', JSON.stringify(dataToSubmit, null, 2));

    try {
      const pro_name = sessionStorage.getItem('pro_name');
      dataToSubmit = {
        ...dataToSubmit,
        pro_name,
      };
      const response = await axios.post('http://100.94.142.127:3000/recommend', dataToSubmit);
      sessionStorage.setItem('stu_id', formData.studentId);
      sessionStorage.setItem('stu_info', JSON.stringify(dataToSubmit));
      console.log('here', dataToSubmit);
      console.log('서버 응답 데이터:', response.data);
      if (response.status === 200) {
        alert('추천이 성공적으로 등록되었습니다.');
        // 등록 후 RegPage로 이동
        navigate('/pro/proregpage');
      }
    } catch (error) {
      console.error('등록 중 오류 발생:', error.message);

      if (error.response) {
        console.error('서버 응답 오류 데이터:', error.response.data);
      } else if (error.request) {
        console.error('요청 오류:', error.request);
      }

      alert('추천 등록 중 문제가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    console.log('취소 버튼 클릭됨');
  };

  const renderInputField = (label, id, placeholder = '', type = 'text', extraClass = '') => (
    <div className="form-group styled-group pro1">
      <label htmlFor={id} className="styled-label pro1">{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        value={formData[id] || ''}
        onChange={handleChange}
        className={`${extraClass} pro1`}
        placeholder={placeholder}
      />
    </div>
  );

  const renderSelectField = (label, id, options) => (
    <div className="form-group pro1">
      <label htmlFor={id} className="styled-label pro1">{label}</label>
      <select id={id} name={id} value={formData[id]} onChange={handleChange} className="pro1">
        {options.map((option, index) => (
          <option key={index} value={option.value} className="pro1">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="recommend-container pro1">
      <ProHeaderAndButtons onCancel={handleCancel} onSubmit={handleSubmit} />
      <h2 className="recommend-list-title-pro1">우수 졸업생 추천 목록</h2>
      <div className="proheader-pro1">우수 졸업생 정보</div>
  
        <form className="recommend-form pro1">
          {renderInputField('년도', 'year', '')}
          {renderInputField('학번', 'studentId', '')}
          {renderInputField('학과', 'department', '', 'text', 'wide-input')}
          {renderInputField('이름', 'name', '')}
          <div className="form-group pro1">
            <label htmlFor="employmentStatus" className="styled-label pro1">취업여부</label>
            <div className="inline-group pro1">
              <select
                id="employmentStatus"
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                className="pro1"
              >
                <option value="Y" className="pro1">Y</option>
                <option value="N" className="pro1">N</option>
              </select>
            </div>
          </div>
          {renderSelectField('대학원 진학여부', 'graduateStudy', [
            { value: 'Y', label: 'Y' },
            { value: 'N', label: 'N' },
          ])}
        </form>
      </div>
  
  );
}

export default ProRecommendPage;



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // useNavigate 훅 추가
// import axios from 'axios';

// import './proRecommend.css';
// import ProHeaderAndButtons from '../../component/proHeaderAndButtons';

// function ProRecommendPage() {
//   const navigate = useNavigate(); // useNavigate 훅 초기화

//   const pro_id = sessionStorage.getItem('pro_id');
//   const [formData, setFormData] = useState({
//     studentId: '',
//     department: '',
//     year: '',
//     name: '',
//     phone: { part1: '', part2: '', part3: '' },
//     employmentStatus: 'N',
//     graduateStudy: 'N',
//   });

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     let dataToSubmit = {
//       ...formData,
//       stu_id: formData.studentId,
//       pro_id: pro_id,
//     };

//     console.log('서버로 보내는 데이터:', JSON.stringify(dataToSubmit, null, 2));

//     try {
//       const pro_name = sessionStorage.getItem('pro_name');
//       dataToSubmit = {
//         ...dataToSubmit,
//         pro_name,
//       };
//       const response = await axios.post('http://100.94.142.127:3000/recommend', dataToSubmit);
//       sessionStorage.setItem('stu_id', formData.studentId);
//       sessionStorage.setItem('stu_info', JSON.stringify(dataToSubmit));
//       console.log('here', dataToSubmit);
//       console.log('서버 응답 데이터:', response.data);
//       if (response.status === 200) {
//         alert('추천이 성공적으로 등록되었습니다.');
//         // 등록 후 RegPage로 이동
//         navigate('/pro/proregpage');
//       }
//     } catch (error) {
//       console.error('등록 중 오류 발생:', error.message);

//       if (error.response) {
//         console.error('서버 응답 오류 데이터:', error.response.data);
//       } else if (error.request) {
//         console.error('요청 오류:', error.request);
//       }

//       alert('추천 등록 중 문제가 발생했습니다.');
//     }
//   };

//   const handleCancel = () => {
//     console.log('취소 버튼 클릭됨');
//   };

//   const renderInputField = (label, id, placeholder = '', type = 'text', extraClass = '') => (
//     <div className="form-group styled-group pro1">
//       <label htmlFor={id} className="styled-label pro1">{label}</label>
//       <input
//         type={type}
//         id={id}
//         name={id}
//         value={formData[id] || ''}
//         onChange={handleChange}
//         className={`${extraClass} pro1`}
//         placeholder={placeholder}
//       />
//     </div>
//   );

//   const renderSelectField = (label, id, options) => (
//     <div className="form-group pro1">
//       <label htmlFor={id} className="styled-label pro1">{label}</label>
//       <select id={id} name={id} value={formData[id]} onChange={handleChange} className="pro1">
//         {options.map((option, index) => (
//           <option key={index} value={option.value} className="pro1">
//             {option.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );

//   return (
//     <div className="recommend-container pro1">
//       <ProHeaderAndButtons onCancel={handleCancel} onSubmit={handleSubmit} />
//       <div className="form-section pro1">
//         <form className="recommend-form pro1">
//           {renderInputField('년도', 'year', '')}
//           {renderInputField('학번', 'studentId', '')}
//           {renderInputField('학과', 'department', '', 'text', 'wide-input')}
//           {renderInputField('이름', 'name', '')}
//           <div className="form-group pro1">
//             <label htmlFor="employmentStatus" className="styled-label pro1">취업여부</label>
//             <div className="inline-group pro1">
//               <select
//                 id="employmentStatus"
//                 name="employmentStatus"
//                 value={formData.employmentStatus}
//                 onChange={handleChange}
//                 className="pro1"
//               >
//                 <option value="Y" className="pro1">Y</option>
//                 <option value="N" className="pro1">N</option>
//               </select>
//             </div>
//           </div>
//           {renderSelectField('대학원 진학여부', 'graduateStudy', [
//             { value: 'Y', label: 'Y' },
//             { value: 'N', label: 'N' },
//           ])}
//         </form>
//       </div>
//     </div>
//   );
// }

// export default ProRecommendPage;