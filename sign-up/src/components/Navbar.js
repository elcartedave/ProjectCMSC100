import React from "react";
import { Link } from "react-router-dom";
import "./CSS/Navbar.css";
import User from "./User.js";

const Navbar = () => {
  return (

    <div className="admin-navbar">
      <img
          src="./images/harvestbud_logo.png"
          alt="harvestbud"
          className="navbar-logo"
      />
      <h1 className="admin-title">HARVEST BUD</h1>
      <Link to="/" className="navbar-link">
      <div className="navbar-item">
          <h3>HOMEPAGE</h3>
      </div>
      </Link>

      <Link to="/shopc" className="navbar-link">
      <div className="navbar-item">
          <h3><i class='bx bxs-cart bx-tada' ></i></h3>
      </div>
      </Link>
      <div>
        <User />
      </div>
      <i class='bx bx-log-out'
      onClick={() => {
          localStorage.removeItem("cust-token");
          window.location.replace("/");
        }}>
      </i>
    </div>
  );
};

export default Navbar;
