import React from "react";
import ProductList from "../components/ProductList.js";
import Navbar from "../components/Navbar.js";
import { Route, Routes } from "react-router-dom";
import ShoppingCart from "./ShoppingCart.js";
const UserPage = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/shopc" element={<ShoppingCart />} />
      </Routes>
    </div>
  );
};

export default UserPage;
