import React from "react";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../components/AddProduct.js";
import AdminProductList from "../components/AdminProductList.js";
import AdminSidebar from "../components/AdminSidebar.js";
import UserList from "../components/UserList.js";

const AdminPage = () => {
  return (
    <div className="admin">
      <AdminSidebar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<AdminProductList />} />
        <Route path="/userlist" element={<UserList />} />
      </Routes>
    </div>
  );
};

export default AdminPage;
