// NoShowReasonModal.js
import React from 'react';
import './noshowreasonmodal.css';

const NoShowReasonModal = ({ isOpen, onClose, noShowReason }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>설문 응답 내용</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <div className="reason-section">
                        <h3>노쇼 이유</h3>
                        <p>{noShowReason || '응답 내용이 없습니다.'}</p>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="confirm-button" onClick={onClose}>확인</button>
                </div>
            </div>
        </div>
    );
};

export default NoShowReasonModal;