import React from "react";
import ProductList from "../components/ProductList.js";
import Navbar from "../components/Navbar.js";
import { Route, Routes } from "react-router-dom";
import ShoppingCart from "./ShoppingCart.js";
import { UserDetailsPage } from "./UserDetailsPage.js";
import Unauthorized from "./unauthorized.js";
import Checkout from "./Checkout.js";
const UserPage = () => {
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
    </div>
  );
};

export default UserPage;
