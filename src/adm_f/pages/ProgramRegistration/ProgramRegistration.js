import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProgramRegistration.css';

const ProgramRegistration = () => {
    const navigate = useNavigate();
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
        program_semester: '2학기',
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
            setFormData({ ...formData, program_poster_image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleClick = () => {
        navigate('/adm/programlist');
    };

    const validateForm = () => {
        const requiredFields = [
            'program_name',
            'program_description',
            'program_money',
            'program_application_start_time',
            'program_application_end_time',
            'program_operation_start_time',
            'program_operation_end_time',
            'program_max_participants',
            'programtype_name',
            'department_name'
        ];
        for (const field of requiredFields) {
            if (!formData[field]) {
                alert(`${field}을(를) 입력해주세요.`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const formDataToSend = new FormData();

            // 관리자 정보 처리
            const adminString = sessionStorage.getItem('admin');
              if (!adminString) {
                  alert('관리자 로그인이 필요합니다.');
                  return;
              }

              let admin;
              try {
                  admin = JSON.parse(adminString);
                  console.log('Admin object:', admin); // Admin 객체 출력
              } catch (error) {
                  console.error('JSON 파싱 오류:', error);
                  alert('관리자 정보가 올바르지 않습니다.');
                  return;
              }

            // 이미지 파일 처리
            if (formData.program_poster_image) {
                formDataToSend.append('program_poster_image', formData.program_poster_image);
            }

            // 날짜 데이터 처리
            const dateFields = [
                'program_application_start_time',
                'program_application_end_time',
                'program_operation_start_time',
                'program_operation_end_time',
                'program_survey_start_time',
                'program_survey_end_time'
            ];

            // 날짜 데이터 추가
            dateFields.forEach(field => {
                if (formData[field]) {
                    formDataToSend.append(field, formData[field].replace('T', ' '));
                }
            });

            // 나머지 데이터 추가
            Object.keys(formData).forEach(key => {
                if (!dateFields.includes(key) && key !== 'program_poster_image') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await axios.post(
                'http://100.94.142.127:3000/programs/registration',
                formDataToSend,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.data) {
                alert('프로그램이 성공적으로 등록되었습니다.');
                navigate('/adm/programlist');
            }
        } catch (error) {
            console.error('프로그램 등록 실패:', error);
            console.error('에러 상세 정보:', error.response?.data);
            alert('프로그램 등록에 실패했습니다. 다시 시도해주세요.');
        }
    };
  
  

  return (
    <>
    <div className="adm_registration-wrapper">
      <div className="adm_program-info-section">
        <h3 className="adm_section-title-re">비교과 프로그램 기본 정보</h3>
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
              <div className="adm_date-range">
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
                <select 
                  name="program_year" 
                  value={formData.program_year} 
                  onChange={handleInputChange}
                >
                  <option value="2024">2024</option>
                </select>
                <select 
                  name="program_semester" 
                  value={formData.program_semester} 
                  onChange={handleInputChange}
                >
                  <option value="1학기">1학기</option>
                  <option value="2학기">2학기</option>
                </select>
              </div>
            </div>

            <div className="adm_input-group">
              <label>프로그램 종류</label>
              <select 
                name="programtype_name" 
                value={formData.programtype_name} 
                onChange={handleInputChange}>
                <option value="-">-</option>
                <option value="특강">특강</option>
                <option value="견학">견학</option>
                <option value="캠프및워크숍">캠프및워크숍</option>
                <option value="클리닉참여">클리닉참여</option>
                <option value="학습공동체활동">학습공동체활동</option>
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
               {/* <div className="adm_button-group">
              <button type="button" className="cancel-btn" onClick={handleClick}>
                취소
              </button>
              <button type="submit" className="submit-btn">
                등록
              </button>
            </div> */}
            </div>
          </div>
        </form>
      </div>
      <div className="adm_mydex-points-section">
        <div className="adm_points-table">
          <h3 className="adm_section-title-reg">Mydex 온도 포인트 기준</h3>
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
        </div>
        <div className="adm_input-group">
          <h3 className="adm_section-title-input">Mydex 온도 포인트 기준 설정란</h3>
              <input 
                type="text" 
                name="program_mydex_points" 
                placeholder="설정할 포인트를 입력하세요." 
                value={formData.program_mydex_points}
                className="adm_input-field-pr" 
                onChange={handleInputChange} />
                <form onSubmit={handleSubmit}>
            <div className="adm_button-group">
              <button type="button" className="cancel-btn" onClick={handleClick}>
                취소
              </button>
              <button type="submit" className="submit-btn">
                등록
              </button>
            </div>
                </form>
            </div> 
      </div>
    </div>
  </>
  );
};

export default ProgramRegistration;
