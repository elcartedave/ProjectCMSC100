import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav>
      <Link to="/">
        <h1>HomePage</h1>
        <ul>
          <Link to="/">
            <li>Cart</li>
          </Link>
          <button
            onClick={() => {
              !!localStorage.getItem("cust-token")
                ? localStorage.removeItem("cust-token")
                : localStorage.removeItem("cust-token");
              window.location.replace("/");
            }}
          >
            Log Out
          </button>
        </ul>
      </Link>
    </nav>
  );
};

export default Navbar;
