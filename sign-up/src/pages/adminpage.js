import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../components/AddProduct.js";
import AdminProductList from "../components/AdminProductList.js";
import AdminSidebar from "../components/AdminSidebar.js";
import UserList from "../components/UserList.js";
import DashBoard from "../components/Dashboard.js";
import OrderList from "../components/OrderList.js";
import SalesReport from "../components/SalesReport.js";
import Modal from "../components/Modal.js";
import Unauthorized from "./unauthorized.js";

const AdminPage = () => {
  const [showModal, setShowModal] = useState(false);// State to manage the visibility of the modal

  useEffect(() => {
    const hasShownModal = localStorage.getItem("hasShownModal");// Check if the modal has been shown before using localStorage
    if (!hasShownModal) {
      setShowModal(true);
      localStorage.setItem("hasShownModal", "true");// If not, show the modal and set the flag in localStorage
    }
  }, []);
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
          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </div>
      <Modal
        message="Welcome Admin! This is your dashboard. You can manage  users, orders, and your products"
        show={showModal}
        handleClose={() => setShowModal(false)}
        time={8000}
      />
    </div>
  );
};

export default AdminPage;
