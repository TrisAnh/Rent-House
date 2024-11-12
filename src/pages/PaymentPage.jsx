import React, { useState } from "react";
import { FaCreditCard, FaUniversity, FaPaypal } from "react-icons/fa";
import "./payment.css";
const PaymentPage = ({ roomPrice = 1500000 }) => {
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const handlePayment = () => {
    alert("Thanh toán thành công!");
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h2>Thanh Toán Phòng Thuê</h2>
        </div>
        <div className="payment-body">
          <div className="price-display">
            <span className="price-label">Giá phòng:</span>
            <span className="price-amount">
              {roomPrice.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
          <div className="payment-methods">
            <h3>Chọn phương thức thanh toán:</h3>
            <div className="payment-options">
              {[
                {
                  id: "credit_card",
                  label: "Thẻ tín dụng",
                  icon: <FaCreditCard />,
                },
                {
                  id: "bank_transfer",
                  label: "Chuyển khoản ngân hàng",
                  icon: <FaUniversity />,
                },
                { id: "paypal", label: "PayPal", icon: <FaPaypal /> },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`payment-option ${
                    paymentMethod === method.id ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    id={method.id}
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">{method.icon}</span>
                  <span className="payment-label">{method.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="payment-footer">
          <button className="payment-button" onClick={handlePayment}>
            Thanh toán ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
