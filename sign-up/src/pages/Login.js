// Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file

const Login = () => {
  const navigate = useNavigate(); //use later for routing
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });//states with loginData object with empty string

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };//sets the loginData in use state that spread loginData, e.target.name is about name attribute in form : while e.target.value is like the key

  const handleSubmit = async (e) => {
    e.preventDefault();//prevent from reloading
    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        loginData
      );//with the data set from the form now will be use in req.body to check if it is existing
      const token = response.data.token;//extracts token from the response
      alert("Login Successful!");
      window.location.reload();
      navigate("/");
      if (response.data.userType === "customer") {
        localStorage.setItem("cust-token", token);//if the user is authenticate as a customer only the customer pages will be available
      }
      if (response.data.userType === "admin") {
        localStorage.setItem("admin-token", token);//if the user is an admin it will only see what admin pages, setting of token in the localStorage as admin-token
      }
      console.log(response);
    } catch (error) {
      console.log(error);
      setError("Login error!");
    }
  };

  return (
    <div class="login-page">
      <div class="login-panel">
        <h1 class="login-title">LOG IN</h1>
        <h2 className="welcome-back">Welcome Back,</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label for="email" className="input-label">
            EMAIL
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            placeholder="Email"
            value={loginData.email}
            onChange={handleChange}
            required
          />
          <label for="password" className="input-label">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="input-field"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
          <div class="button-wrapper">
            <button type="submit" className="sign-in-button">
              SIGN IN
            </button>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="newuser-wrapper">
          <p className="new-user-text">NEW USER?</p>
          <a href="/sign-up" className="create-account-link">
            Create an account
          </a>
        </div>
      </div>
      <h1 className="web-title">
        HARVEST <br></br>BUD
      </h1>
      <img
        src="./images/farm_logo.png"
        alt="harvestbud"
        className="login-image"
      />
      <img
        src="./images/harvestbud_logo.png"
        alt="harvestbud"
        className="web-logo"
      />
    </div>
  );
};

export default Login;
