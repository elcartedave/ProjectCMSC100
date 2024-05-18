import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav>
      <Link to="/">
        <h1>HomePage</h1>
      </Link>

      <Link to="/shopc">
        <li>Cart</li>
      </Link>
      <h2
        onClick={() => {
          localStorage.removeItem("cust-token");
          window.location.replace("/");
        }}
      >
        Log Out
      </h2>
    </nav>
  );
};

export default Navbar;
