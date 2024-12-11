import React, { useState } from 'react';
import axios from 'axios';
import './ProgramRegistration.css';

const ProgramRegistration = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    program_name: '',
    program_description: '',
    program_money: '',
    program_application_start_time: '',
    program_application_end_time: '',
    program_operation_start_time: '',
    program_operation_end_time: '',
    program_max_participants: '',
    program_year: '2024',
    program_semester: '1학기',
    program_mydex_points: '',
    program_poster_image: null,
    program_survey_start_time: '',
    program_survey_end_time: '',
    programtype_name: '',
    department_name: ''
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        program_poster_image: file
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      if (formData.program_poster_image) {
        formDataToSend.append('program_poster_image', formData.program_poster_image);
      }
  
      formDataToSend.append('program_name', formData.program_name);
      formDataToSend.append('program_description', formData.program_description);
      formDataToSend.append('program_money', formData.program_money);
      formDataToSend.append('program_application_start_time', formData.program_application_start_time);
      formDataToSend.append('program_application_end_time', formData.program_application_end_time);
      formDataToSend.append('program_operation_start_time', formData.program_operation_start_time);
      formDataToSend.append('program_operation_end_time', formData.program_operation_end_time);
      formDataToSend.append('program_max_participants', formData.program_max_participants);
      formDataToSend.append('program_year', formData.program_year);
      formDataToSend.append('program_semester', formData.program_semester);
      formDataToSend.append('program_mydex_points', formData.program_mydex_points);
      formDataToSend.append('program_survey_start_time', formData.program_survey_start_time);
      formDataToSend.append('program_survey_end_time', formData.program_survey_end_time);
      formDataToSend.append('programtype_name', formData.programtype_name);
      formDataToSend.append('department_name', formData.department_name);
  
      const userString = sessionStorage.getItem('user');
      const user = JSON.parse(userString);
      
      if (!user || !user.adm_id) {
        throw new Error('사용자 정보가 없습니다.');
      }
  
      formDataToSend.append('adm_id', user.adm_id);
  
      const response = await axios.post(
        'http://100.94.142.127:3000/programs/registration',
        formDataToSend
      );
  
      // 응답 상태 코드로 성공/실패 확인
      if (response.status === 200) {
        alert('프로그램이 성공적으로 등록되었습니다.');
        window.location.href = '/programlist';
      } else {
        alert('프로그램 등록에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('프로그램 등록 실패:', error);
      // 에러 메시지가 있는 경우 해당 메시지 표시, 없는 경우 기본 메시지 표시
      const errorMessage = error.response?.data?.message || '프로그램 등록에 실패했습니다. 다시 시도해주세요.';
      alert(errorMessage);
    }
  };

  return (
    <div className="adm_egistration-wrapper">
      <div className="adm_program-info-section">
        <h3 className="adm_section-title">비교과 프로그램 기본 정보</h3>
        <form onSubmit={handleSubmit}>
          <div className="adm_image-upload-container">
            <div className="adm_image-upload-box">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="프로그램 포스터" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                />
              ) : (
                <span>이미지 등록하기</span>
              )}
              <input 
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="adm_image-input"
                name="program_poster_image"
              />
            </div>
          </div>

          <div className="adm_form-container">
            <div className="adm_input-group">
              <label>프로그램 이름</label>
              <input 
                type="text"
                name="program_name"
                value={formData.program_name}
                onChange={handleInputChange}
              />
            </div>

            <div className="adm_input-group">
              <label>프로그램 내용</label>
              <textarea
                name="program_description"
                value={formData.program_description}
                onChange={handleInputChange}
              />
            </div>

            <div className="adm_input-group">
              <label>프로그램 신청기간</label>
              <div className="adm_date-range">
                <input
                  type="datetime-local"
                  name="program_application_start_time"
                  value={formData.program_application_start_time}
                  onChange={handleInputChange}
                />
                <span>~</span>
                <input
                  type="datetime-local"
                  name="program_application_end_time"
                  value={formData.program_application_end_time}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="adm_input-group">
              <label>프로그램 운영기간</label>
              <div className="adm_date-range">
                <input
                  type="datetime-local"
                  name="program_operation_start_time"
                  value={formData.program_operation_start_time}
                  onChange={handleInputChange}
                />
                <span>~</span>
                <input
                  type="datetime-local"
                  name="program_operation_end_time"
                  value={formData.program_operation_end_time}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="adm_input-group">
              <label>프로그램 설문 조사 기간</label>
              <div className="date-range">
                <input
                  type="datetime-local"
                  name="program_survey_start_time"
                  value={formData.program_survey_start_time}
                  onChange={handleInputChange}
                />
                <span>~</span>
                <input
                  type="datetime-local"
                  name="program_survey_end_time"
                  value={formData.program_survey_end_time}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="adm_input-group">
              <label>프로그램 수용 인원</label>
              <div className="adm_input-with-unit">
                <input
                  type="number"
                  name="program_max_participants"
                  value={formData.program_max_participants}
                  onChange={handleInputChange}
                />
                <span>명</span>
              </div>
            </div>

            <div className="adm_input-group">
              <label>계산되는 예산 금액</label>
              <div className="adm_input-with-unit">
                <input
                  type="number"
                  name="program_money"
                  value={formData.program_money}
                  onChange={handleInputChange}
                />
                <span>원</span>
              </div>
            </div>

            <div className="adm_input-group">
              <label>시행 연도 / 학기</label>
              <div className="adm_semester-select">
                <select name="program_year" value={formData.program_year} onChange={handleInputChange}>
                  <option value="2024">2024</option>
                </select>
                <select name="program_semester" value={formData.program_semester} onChange={handleInputChange}>
                  <option value="1학기">1학기</option>
                  <option value="2학기">2학기</option>
                </select>
              </div>
            </div>

            <div className="adm_input-group">
              <label>프로그램 종류</label>
              <select name="programtype_name" value={formData.programtype_name} onChange={handleInputChange}>
                <option value="">선택하세요</option>
                <option value="특강">특강</option>
                <option value="견학">견학</option>
                <option value="캠프">캠프 및 워크숍</option>
                <option value="설문">설문 참여</option>
                <option value="클리닉">클리닉 참여</option>
                <option value="학술">학술공모제 활동</option>
                <option value="경진">경진대회/공모전</option>
              </select>
            </div>

            <div className="adm_input-group">
              <label>학과</label>
              <input
                type="text"
                name="department_name"
                value={formData.department_name}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="adm_mydex-points-section">
        <div className="adm_points-table">
          <h3 className="adm_section-title">Mydex 온도 포인트 기준</h3>
          <div className="adm_point-row">
            <span>특강</span>
            <span>2시간당 1점</span>
          </div>
          <div className="adm_point-row">
            <span>견학</span>
            <span>1회당 1점</span>
          </div>
          <div className="adm_point-row">
            <span>캠프 및 워크숍</span>
            <span>5점</span>
          </div>
          <div className="adm_point-row">
            <span>설문 참여</span>
            <span>외부 기간 건당 2점<br />교내 건당 1점</span>
          </div>
          <div className="adm_point-row">
            <span>클리닉 참여</span>
            <span>회당 1점</span>
          </div>
          <div className="adm_point-row">
            <span>학술공모제 활동</span>
            <span>1점</span>
          </div>
          <div className="adm_point-row">
            <span>경진대회/공모전</span>
            <span>2점</span>
          </div>
        </div>

        <div className="adm_mydex-points-input">
          <h3 className="adm_section-title">Mydex 온도 포인트 설정란</h3>
          <div className="adm_points-input-container">
            <input
              type="text"
              name="program_mydex_points"
              placeholder="설정할 Mydex 온도 포인트를 입력하세요."
              value={formData.program_mydex_points}
              onChange={handleInputChange}
            />
          </div>
          <div className="adm_button-group">
            <button type="button" className="cancel-btn" onClick={() => window.history.back()}>취소</button>
            <button type="submit" className="submit-btn" onClick={handleSubmit}>등록</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramRegistration;