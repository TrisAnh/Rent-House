// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
//import AuthProvider from "./contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthProvider from "./contexts/AuthContext";
import "./assets/styles/globals.css";
import "./index.css"; // Nhập tệp CSS của Tailwind
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);
