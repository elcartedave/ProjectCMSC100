import React from "react";
import SignUp from "./SignUp.js";
import UserList from "./UserList.js";

import Login from "./Login.js";
import { Routes, Route } from "react-router-dom";
import UserPage from "./pages/UserPage.js";
const App = () => {
  const isUserSignedIn = !!localStorage.getItem("token");
  return (
    <div>
      <Routes>
        {isUserSignedIn ? (
          <>
            <Route path="/" element={<UserPage />} />
          </>
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
