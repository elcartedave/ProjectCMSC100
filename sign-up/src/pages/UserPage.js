import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList.js";
import Navbar from "../components/Navbar.js";
import { Route, Routes } from "react-router-dom";
import ShoppingCart from "./ShoppingCart.js";
import { UserDetailsPage } from "./UserDetailsPage.js";
import Unauthorized from "./unauthorized.js";
import Checkout from "./Checkout.js";
import Modal from "../components/Modal.js";
const UserPage = () => {
  const [showModal, setShowModal] = useState(false);// State to manage the visibility of the modal

  useEffect(() => {
    const hasShownModal = localStorage.getItem("hasShownModal");// Check if the modal has been shown before using localStorage
    if (!hasShownModal) {
      setShowModal(true);
      localStorage.setItem("hasShownModal", "true");// If not, show the modal and set the flag in localStorage
    }
  }, []);
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/shopc" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/user/:userid" element={<UserDetailsPage />} />
        <Route path="*" element={<Unauthorized />} />
      </Routes>
      <Modal
        message="Welcome Customer! Feel free to add items to your cart!"
        show={showModal}
        handleClose={() => setShowModal(false)}
        time={8000}
      />
    </div>
  );
};

export default UserPage;
