// NoShowReasonModal.js
import React from 'react';
import './noshowreasonmodal.css';

const NoShowReasonModal = ({ isOpen, onClose, student }) => {
    if (!isOpen || !student) return null;

    return (
        <div className="adm_modal-overlay">
            <div className="adm_modal-content">
                <div className="adm_modal-header">
                    <h2>설문 응답 내용</h2>
                    <button className="adm_close-button" onClick={onClose}>×</button>
                </div>
                <div className="adm_modal-body">
                    <div className="adm_reason-section">
                        <h3>노쇼 사유</h3>
                        <p>{student.noshowreasoncategories_name || '응답 내용이 없습니다.'}</p>
                    </div>
                </div>
                <div className="adm_modal-footer">
                    <button className="adm_confirm-button" onClick={onClose}>확인</button>
                </div>
            </div>
        </div>
    );
};

export default NoShowReasonModal;
