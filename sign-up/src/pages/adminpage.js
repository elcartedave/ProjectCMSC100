import React from "react";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../components/AddProduct.js";
import AdminProductList from "../components/AdminProductList.js";
import AdminSidebar from "../components/AdminSidebar.js";
import UserList from "../components/UserList.js";
import DashBoard from "../components/Dashboard.js";
import OrderList from "../components/OrderList.js";
import SalesReport from "../components/SalesReport.js";

const AdminPage = () => {
  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="admin">
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/listproduct" element={<AdminProductList />} />
          <Route path="/userlist" element={<UserList />} />
          <Route path="/orderlist" element={<OrderList />} />
          <Route path="/salesreport" element={<SalesReport />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;
