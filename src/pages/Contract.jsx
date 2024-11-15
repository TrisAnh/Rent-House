import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useNavigate, useLocation } from "react-router-dom";
export default function Component() {
  const location = useLocation();
  const { amount, listingId } = location.state || {
    amount: 0,
    listingId: null,
  };
  const [showModal, setShowModal] = useState(false);
  const [signature, setSignature] = useState(null);
  const sigCanvas = useRef(null);
  const navigate = useNavigate();
  const contractData = {
    title: "Hợp đồng thuê trọ ABC",
    start_at: "2024-11-01",
    end_at: "2025-11-01",
    rental_price: 5000000,
    deposit_amount: 1000000,
    contract_file: "hopdong.pdf",
    payment_terms: "Thanh toán hàng tháng vào ngày 1.",
    penalties: "Phạt 5% nếu thanh toán muộn.",
    maintenance_responsibilities:
      "Người thuê chịu trách nhiệm bảo trì nội thất.",
    contract_duration: "12 tháng",
    renewal_terms:
      "Gia hạn tự động khi hết hạn nếu không có thông báo trước 30 ngày.",
    termination_conditions: "Có thể chấm dứt hợp đồng nếu báo trước 60 ngày.",
    additional_clauses: "Không được thay đổi kết cấu phòng.",
  };

  const handleDepositClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSignatureClear = () => {
    if (sigCanvas.current) sigCanvas.current.clear();
    setSignature(null);
  };

  const handleSaveSignature = () => {
    const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL();
    setSignature(dataURL);
    navigate("/payment", { state: { amount, listingId } });
  };

  return (
    <div className="contract-container">
      <h2 className="contract-title">{contractData.title}</h2>

      <div className="contract-grid">
        <div className="contract-field">
          <span className="field-label">Ngày bắt đầu:</span>
          <span className="field-value">{contractData.start_at}</span>
        </div>
        <div className="contract-field">
          <span className="field-label">Ngày kết thúc:</span>
          <span className="field-value">{contractData.end_at}</span>
        </div>
        <div className="contract-field">
          <span className="field-label">Giá thuê:</span>
          <span className="field-value">
            {contractData.rental_price.toLocaleString()} VND
          </span>
        </div>
        <div className="contract-field">
          <span className="field-label">Tiền cọc:</span>
          <span className="field-value">
            {contractData.deposit_amount.toLocaleString()} VND
          </span>
        </div>
      </div>

      <div className="contract-details">
        <h3>Chi tiết hợp đồng</h3>
        <div className="contract-field">
          <span className="field-label">Điều khoản thanh toán:</span>
          <span className="field-value">{contractData.payment_terms}</span>
        </div>
        <div className="contract-field">
          <span className="field-label">Điều khoản phạt:</span>
          <span className="field-value">{contractData.penalties}</span>
        </div>
        <div className="contract-field">
          <span className="field-label">Trách nhiệm bảo trì:</span>
          <span className="field-value">
            {contractData.maintenance_responsibilities}
          </span>
        </div>
        <div className="contract-field">
          <span className="field-label">Thời hạn hợp đồng:</span>
          <span className="field-value">{contractData.contract_duration}</span>
        </div>
        <div className="contract-field">
          <span className="field-label">Điều khoản gia hạn:</span>
          <span className="field-value">{contractData.renewal_terms}</span>
        </div>
        <div className="contract-field">
          <span className="field-label">Điều kiện chấm dứt:</span>
          <span className="field-value">
            {contractData.termination_conditions}
          </span>
        </div>
        <div className="contract-field">
          <span className="field-label">Điều khoản bổ sung:</span>
          <span className="field-value">{contractData.additional_clauses}</span>
        </div>
      </div>

      <button className="deposit-button" onClick={handleDepositClick}>
        Đặt cọc giữ chỗ
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Hợp đồng chi tiết</h3>
            <p>Vui lòng ký tên để hoàn tất hợp đồng.</p>
            <div className="signature-wrapper">
              <h4>Ký hợp đồng:</h4>
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: "signature-canvas",
                }}
              />
              <div className="signature-buttons">
                <button onClick={handleSignatureClear}>Xóa chữ ký</button>
                <button onClick={handleSaveSignature}>Lưu chữ ký</button>
              </div>
              {signature && (
                <img
                  src={signature}
                  alt="Signature"
                  className="signature-image"
                />
              )}
            </div>
            <button className="close-button" onClick={handleCloseModal}>
              Đóng
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .contract-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          background-color: #f8f9fa;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .contract-title {
          color: #2c3e50;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2rem;
        }

        .contract-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .contract-field {
          background-color: #ffffff;
          padding: 1rem;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .field-label {
          font-weight: bold;
          color: #34495e;
          display: block;
          margin-bottom: 0.5rem;
        }

        .field-value {
          color: #2c3e50;
        }

        .contract-details {
          background-color: #ffffff;
          padding: 1.5rem;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }

        .contract-details h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .deposit-button {
          display: block;
          width: 100%;
          padding: 1rem;
          background-color: #3498db;
          color: #ffffff;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .deposit-button:hover {
          background-color: #2980b9;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: #ffffff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          width: 90%;
        }

        .signature-wrapper {
          margin-top: 1rem;
          text-align: center;
        }

        .signature-canvas {
          border: 1px solid #bdc3c7;
          border-radius: 5px;
        }

        .signature-buttons {
          margin-top: 1rem;
        }

        .signature-buttons button {
          margin: 0 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #3498db;
          color: #ffffff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .signature-buttons button:hover {
          background-color: #2980b9;
        }

        .signature-image {
          max-width: 100%;
          margin-top: 1rem;
        }

        .close-button {
          display: block;
          width: 100%;
          padding: 1rem;
          background-color: #e74c3c;
          color: #ffffff;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-top: 1rem;
        }

        .close-button:hover {
          background-color: #c0392b;
        }
      `}</style>
    </div>
  );
}
