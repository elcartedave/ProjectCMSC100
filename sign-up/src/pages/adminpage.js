import React from "react";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../components/AddProduct.js";
import AdminProductList from "../components/AdminProductList.js";
import AdminSidebar from "../components/AdminSidebar.js";

const AdminPage = () => {
  return (
    <div className="admin">
      <AdminSidebar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<AdminProductList />} />
      </Routes>
    </div>
  );
};

export default AdminPage;
