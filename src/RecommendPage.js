import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 추가
import axios from 'axios';
import './RecommendPage.css';
import HeaderAndButtons from './HeaderAndButtons';

function RecommendPage() {
  const navigate = useNavigate(); // useNavigate 훅 초기화

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

  const handlePhoneChange = (part, value) => {
    setFormData((prevData) => ({
      ...prevData,
      phone: { ...prevData.phone, [part]: value },
    }));
  };

  const handleSubmit = async () => {
    let dataToSubmit = {
      ...formData,
      stu_id: formData.studentId,
      pro_id: 1,
    };

    console.log('서버로 보내는 데이터:', JSON.stringify(dataToSubmit, null, 2));

    try {
      const pro_name = sessionStorage.getItem('pro_name');
      dataToSubmit = {
        ...dataToSubmit,
        pro_name
      }
      const response = await axios.post('http://192.168.0.123:3000/recommend', dataToSubmit);
      sessionStorage.setItem('stu_id',formData.studentId);
      sessionStorage.setItem('stu_info', JSON.stringify(dataToSubmit));
      console.log('here', dataToSubmit);
      console.log('서버 응답 데이터:', response.data);
      if (response.status === 200) {
        alert('추천이 성공적으로 등록되었습니다.');
        // 등록 후 RegPage로 이동
        navigate('/regpage');
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
    <div className="form-group styled-group">
      <label htmlFor={id} className="styled-label">{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        value={formData[id] || ''}
        onChange={handleChange}
        className={extraClass}
        placeholder={placeholder}
      />
    </div>
  );

  const renderPhoneField = () => (
    <div className="form-group phone-group">
      <label className="styled-label">전화번호</label>
      <div className="phone-inputs">
        <input
          type="text"
          maxLength="3"
          placeholder="010"
          value={formData.phone.part1}
          onChange={(e) => handlePhoneChange('part1', e.target.value)}
        />
        <span>-</span>
        <input
          type="text"
          maxLength="4"
          placeholder="1234"
          value={formData.phone.part2}
          onChange={(e) => handlePhoneChange('part2', e.target.value)}
        />
        <span>-</span>
        <input
          type="text"
          maxLength="4"
          placeholder="5678"
          value={formData.phone.part3}
          onChange={(e) => handlePhoneChange('part3', e.target.value)}
        />
      </div>
    </div>
  );

  const renderSelectField = (label, id, options) => (
    <div className="form-group">
      <label htmlFor={id} className="styled-label">{label}</label>
      <select id={id} name={id} value={formData[id]} onChange={handleChange}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="recommend-container">
      <HeaderAndButtons onCancel={handleCancel} onSubmit={handleSubmit} />
      <div className="form-section">
        <form className="recommend-form">
          {renderInputField('년도', 'year', '')}
          {renderInputField('학번', 'studentId', '')}
          {renderInputField('학과', 'department', '', 'text', 'wide-input')}
          {renderInputField('이름', 'name', '')}
          {renderPhoneField()}
          <div className="form-group">
            <label htmlFor="employmentStatus" className="styled-label">취업여부</label>
            <div className="inline-group">
              <select
                id="employmentStatus"
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
              >
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
              {/* <input
                type="text"
                id="companyName"
                name="companyName"
                placeholder="회사 이름"
                value={formData.companyName}
                onChange={handleChange}
              /> */}
            </div>
          </div>
          {renderSelectField('대학원 진학여부', 'graduateStudy', [
            { value: 'Y', label: 'Y' },
            { value: 'N', label: 'N' },
          ])}
        </form>
      </div>
    </div>
  );
}

export default RecommendPage;
