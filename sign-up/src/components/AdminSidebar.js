import React from "react";
import { Link } from "react-router-dom";
import "./CSS/AdminSidebar.css";
const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/" style={{ textDecoration: "none" }}>
        <img
          src="./images/harvestbud_logo.png"
          alt="harvestbud"
          className="sidebar-logo"
        />
        <h1 className="sidebar-title">
          <span className="harvest">HARVEST</span>
          <br />
          <span className="bud">BUD</span>
        </h1>
      </Link>
      <Link to={"/listproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <button>PRODUCT LIST</button>
        </div>
      </Link>
      <Link to={"/userlist"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <button>USER LIST</button>
        </div>
      </Link>
      <h3
        className="logout"
        onClick={() => {
          localStorage.removeItem("admin-token");
          window.location.replace("/");
        }}
      >
        LOG OUT
      </h3>
    </div>
  );
};

export default AdminSidebar;
