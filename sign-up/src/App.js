import React from "react";
import SignUp from "./pages/SignUp.js";
// import UserList from "./components/UserList.js";

import Login from "./pages/Login.js";
import { Routes, Route } from "react-router-dom";
import UserPage from "./pages/UserPage.js";
import AdminPage from "./pages/adminpage.js";

const App = () => {
  const isCustomerSignedIn = !!localStorage.getItem("cust-token");
  const isMerchantSignedIn = !!localStorage.getItem("admin-token");
  return (
    <div>
      <Routes>
        {isCustomerSignedIn ? (
          <Route path="/*" element={<UserPage />} />
        ) : isMerchantSignedIn ? (
          <Route path="/*" element={<AdminPage />} />
        ) : (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
