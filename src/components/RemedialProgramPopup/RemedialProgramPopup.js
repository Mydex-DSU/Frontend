import React, { useState } from "react";
import axios from "axios";
import "./RemedialProgramPopup.css";

function RemedialProgramPopup({ onClose }) {
  const [formData, setFormData] = useState({
    stu_id: "",
    student_name: "",
    remedialprogram_name: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

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
        onClose(); // 팝업 닫기
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
                <input
                  type="text"
                  name="stu_id"
                  value={formData.stu_id}
                  onChange={handleInputChange}
                />
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
                <input
                  type="text"
                  name="remedialprogram_name"
                  value={formData.remedialprogram_name}
                  onChange={handleInputChange}
                />
                <button className="search-button">🔍</button>
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
