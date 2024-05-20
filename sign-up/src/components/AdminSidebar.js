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
      <Link to={"/"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <button>DASHBOARD</button>
        </div>
      </Link>
      <Link to={"/listproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <button>PRODUCTS</button>
        </div>
      </Link>
      <Link to={"/userlist"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <button>USERS</button>
        </div>
      </Link>
      <Link to={"/orderlist"}>
        <div className="sidebar-item">
          <button>ORDERS</button>
        </div>
      </Link>
      <Link to={"/salesreport"}>
        <div className="sidebar-item">
          <button>Sales Reports</button>
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
