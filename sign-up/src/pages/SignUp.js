import React, { useState } from "react";
import axios from "axios";
import "./SignUp.css";
const SignUp = () => {
  const [signupData, setsignupData] = useState({
    firstName: "",
    lastName: "",
    userType: "customer",
    email: "",
    password: "",
  });//it is a state with object that includes data that will be needed in signing up (the userType is predefined as customer)

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setsignupData({ ...signupData, [e.target.name]: e.target.value });
  };//sets the signupData in use state that spread signupData, e.target.name is about name attribute in form : while e.target.value is like the key

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/signup",
        signupData
      );//a post request that transfer the signupData to backend and will wait for the response if it is saved or not
      console.log(response);
      if (response && response.data) {
        alert(response.data);
        window.location.replace("/");
      } else {
        setError("Signup error: Response or data is undefined");
      }
    } catch (error) {
      setError("Signup error:" + error.response.data);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-panel">
        <h1 className="signup-title">SIGN UP</h1>
        <h2 className="hello">Hello,</h2>
        <form
          className="container"
          method="post"
          action="/signup"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="fname" className="fname-label">FIRST NAME</label>
            <label htmlFor="lname" className="lname-label">LAST NAME</label>
            <input
              type="text"
              className="signup-input-fname"
              id="fname"
              name="firstName"
              placeholder="First Name"
              value={signupData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              className="signup-input-lname"
              id="lname"
              name="lastName"
              placeholder="Last Name"
              value={signupData.lastName}
              onChange={handleChange}
              required
            />

            <h3 htmlFor="email" className="email-label">EMAIL</h3>
            <input
              type="email"
              className="signup-input"
              id="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleChange}
              required
            />

            <h3 className="password-label">PASSWORD</h3>
            <input
              type="password"
              className="signup-input" 
              id="password"
              name="password"
              placeholder="Passowrd"
              value={signupData.password}
              onChange={handleChange}
              required
            />
          <div class="button-wrapper">
          <button className= "signup-button" type="submit">SIGN UP</button>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="newuser-wrapper">
            <p className="new-user-text">ACCOUNT EXIST?</p>
            <a href="/" className="create-account-link">
              Login to your Account
            </a>
          </div>
        </div>
        </form>
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

export default SignUp;
