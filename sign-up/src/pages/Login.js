// Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        loginData
      );
      const token = response.data.token;
      alert("Login Successful!");
      window.location.reload();
      navigate("/");
      if (response.data.userType === "customer") {
        localStorage.setItem("cust-token", token);
      }
      if (response.data.userType === "admin") {
        localStorage.setItem("admin-token", token);
      }
    } catch (error) {
      setError("Login error!");
    }
  };

  return (
    <div className="login-container">
      <div className="background-gradient"></div>
      <div className="login-box">
        <h1 className="login-title">LOG IN</h1>
        <h2 className="welcome-back">Welcome Back,</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input-field"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input-field"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="sign-in-button">
            SIGN IN
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="new-user-section">
          <p className="new-user-text">NEW USER?</p>
          <a href="/signup" className="create-account-link">
            create an account
          </a>
        </div>
      </div>
      <footer className="footer">
        <p className="contact-info">farmtotable@gmail.com</p>
        <p className="footer-contact">CONTACT US</p>
      </footer>
      <div className="image-container">
        <img
          src="Copy of 9 - Ball Shirt Design 2 (25).png"
          alt="Decorative"
          className="decorative-image"
        />
      </div>
    </div>
  );
};

export default Login;
