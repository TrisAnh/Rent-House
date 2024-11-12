import React, { useState } from "react";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginApi(credentials); // Call the login API
      const userData = response.data; // Get the user data from the response

      await login(userData); // Store user data in context or state

      // Check if user is a "renter" or "user" based on userRole and redirect accordingly
      if (userData.role === "renter") {
        // If the user is a renter, navigate to the Renter header or a specific page for renters
        navigate("/renter-header");
      } else {
        // If the user is just a regular user, navigate to a standard page
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setError(errorMessage);
      console.error("Đăng nhập thất bại", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Đăng Nhập</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email/Số điện thoại:</label>
            <input
              type="text"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>
        <div className="footer-links">
          <a href="/forgot-password" className="footer-link">
            Quên mật khẩu?
          </a>
          <a href="/register" className="footer-link">
            Đăng ký
          </a>
        </div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f0f2f5;
          padding: 20px;
        }

        .login-box {
          background-color: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .login-title {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
        }

        .error-message {
          color: #e74c3c;
          background-color: #fdeaea;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #555;
        }

        .form-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .form-input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }

        .submit-button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-button:hover {
          background-color: #2980b9;
        }

        .submit-button:disabled {
          background-color: #bdc3c7;
          cursor: not-allowed;
        }

        .footer-links {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .footer-link {
          color: #3498db;
          text-decoration: none;
          font-size: 14px;
        }

        .footer-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .login-box {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
