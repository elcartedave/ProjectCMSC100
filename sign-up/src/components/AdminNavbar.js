import React from "react";
import { Link } from "react-router-dom";
import "./CSS/AdminNavbar.css";

const AdminNavbar = () => {
  return (
    <div>
      <Link to="/">
        <h1>Admin Page</h1>
      </Link>
      <h3
        onClick={() => {
          localStorage.removeItem("admin-token");
          window.location.replace("/");
        }}
      >
        Log Out
      </h3>
    </div>
  );
};

export default AdminNavbar;
