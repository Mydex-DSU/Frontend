import React, { useState, useContext } from "react";
import axios from "axios";
import { UserDataContext } from "../../../context/userDataContext"; // userData 가져오기
import "./RemedialProgramPopup.css";

function RemedialProgramPopup({ onClose }) {
  const { userData } = useContext(UserDataContext); // useContext에서 userData 가져오기
  const [formData, setFormData] = useState({
    stu_id: sessionStorage.getItem("stu_id") || "", // 학번은 session에서 가져오기
    student_name: "",
    remedialprogram_name: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // 구제 프로그램 선택 옵션
  const remedialProgramOptions = [
    "CBT 향상도",
    "봉사",
    "자원봉사",
    "기타 서포터즈",
    "금연 클리닉",
    "외국어 자격증",
    "전공 자격증",
    "모범 장학",
    "동서글로벌 프로그램 장학",
    "동서스피치장학",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    // 학생의 current_mydex_point가 5 이상인 경우 신청 불가
    if (userData && userData.stu_current_mydex_points >= 5) {
      setMessage("현재 Mydex 온도 포인트가 5 이상일 때는 신청할 수 없습니다.");
      return;
    }

    // 필수 입력값 확인
    if (!formData.stu_id || !formData.remedialprogram_name || !file) {
      setMessage("모든 필드와 파일을 입력해야 합니다.");
      return;
    }

    const requestData = new FormData();
    requestData.append("stu_id", formData.stu_id);
    requestData.append("remedialprogram_name", formData.remedialprogram_name);
    requestData.append("qualification_documents", file);

    try {
      const response = await axios.post(
        "http://100.94.142.127:3000/remedialprogramapplication/application",
        requestData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      if (response.data) {
        alert(response.data.message);
        console.log("Uploaded PDF URL:", response.data.pdf_url);
        onClose();
         // 팝업 닫기
        
      }
    } catch (error) {
      console.error("Error submitting remedial program application:", error);
      setMessage("신청 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };


  return (
    <div className="remedial-program-popup">
      <div className="popup-content">
        <h2>구제 프로그램 신청</h2>
        <table>
          <tbody>
            <tr>
              <td>학생 학번</td>
              <td>
                <span>{formData.stu_id}</span>
              </td>
            </tr>
            <tr>
              <td>학생 이름</td>
              <td>
                <input
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>구제 프로그램</td>
              <td>
                <select
                  name="remedialprogram_name"
                  value={formData.remedialprogram_name}
                  onChange={handleInputChange}
                >
                  <option value="">구제 프로그램을 선택하세요</option>
                  {remedialProgramOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>제출 서류</td>
              <td>
                <input type="file" onChange={handleFileChange} accept=".pdf" />
              </td>
            </tr>
          </tbody>
        </table>
        {message && <p className="error-message">{message}</p>}
        <div className="popup-buttons">
          <button className="cancel-button" onClick={onClose}>
            취소
          </button>
          <button className="submit-button" onClick={handleSubmit}>
            신청
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemedialProgramPopup;
