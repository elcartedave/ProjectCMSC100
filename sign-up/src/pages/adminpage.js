import React from "react";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../components/AddProduct.js";
import AdminProductList from "../components/AdminProductList.js";
import AdminSidebar from "../components/AdminSidebar.js";

const AdminPage = () => {
  return (
    <div className="admin">
      <AdminSidebar />
    </div>
  );
};

export default AdminPage;
