// Contract.js
import React, { useState, useRef } from "react";
import styled from "styled-components";
import SignatureCanvas from "react-signature-canvas";

const ContractContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 20px 0;
`;

const DepositButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #218838;
  }
`;

const ContractModal = styled.div`
  display: ${({ show }) => (show ? "block" : "none")};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? "block" : "none")};
  z-index: 999;
`;

const ContractContent = styled.div`
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #c82333;
  }
`;

const SignatureWrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 20px;
  padding: 10px;
`;

const Contract = () => {
  const [showModal, setShowModal] = useState(false);
  const [signature, setSignature] = useState(null);
  const sigCanvas = useRef(null);

  const handleDepositClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Reset signature on close
    setSignature(null);
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const handleSignatureClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setSignature(null);
    }
  };

  const handleSaveSignature = () => {
    const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL();
    setSignature(dataURL);
    // Here, you can handle the signature data (e.g., send it to the server)
  };

  return (
    <ContractContainer>
      <h2>Hợp đồng cho thuê</h2>
      <p>Thông tin hợp đồng...</p>
      <DepositButton onClick={handleDepositClick}>
        Đặt cọc giữ chỗ
      </DepositButton>

      {/* Modal Hợp đồng */}
      <ModalOverlay show={showModal} onClick={handleCloseModal} />
      <ContractModal show={showModal}>
        <h3>Hợp đồng chi tiết</h3>
        <ContractContent>
          {/* Nội dung hợp đồng ở đây */}
          <p>Chi tiết về hợp đồng...</p>
        </ContractContent>

        {/* Ký Hợp đồng */}
        <SignatureWrapper>
          <h4>Ký hợp đồng:</h4>
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
          />
          <div>
            <button onClick={handleSignatureClear}>Xóa chữ ký</button>
            <button onClick={handleSaveSignature}>Lưu chữ ký</button>
          </div>
          {signature && (
            <img
              src={signature}
              alt="Signature"
              style={{ marginTop: "10px", maxWidth: "100%" }}
            />
          )}
        </SignatureWrapper>

        <CloseButton onClick={handleCloseModal}>Đóng</CloseButton>
      </ContractModal>
    </ContractContainer>
  );
};

export default Contract;
