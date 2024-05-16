import React from "react";
import { Link } from "react-router-dom";
const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <Link to={"/addproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <button>Add Product</button>
        </div>
      </Link>
      <Link to={"/listproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <button>Product List</button>
        </div>
      </Link>
    </div>
  );
};

export default AdminSidebar;
