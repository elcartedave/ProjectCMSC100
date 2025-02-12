import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const User = () => {
  const [userID, setUserID] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserID = async () => {
      const token = localStorage.getItem("cust-token");
      if (token) {
        try {
          axios
            .post("http://localhost:3001/token", { token })
            .then((response) => {
              setUserID(response.data.tokenData.userId);
            });
        } catch (error) {
          console.error("Error fetching userID:", error);
        }
      }
    };

    fetchUserID();
  }, []);//get the token oof userid from token

  useEffect(() => {
    const fetchUser = async () => {
      if (userID) {
        try {
          const response = await fetch("http://localhost:3001/userlist");
          const data = await response.json();
          const foundUser = data.find((item) => item._id === userID);
          if (foundUser) {
            setUser(foundUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUser();
  }, [userID]);//get the information of user by using the ._id

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="navbar-item">
      <Link to={`/user/${user._id}`} className="navbar-link">
        <button className="user-profile">
          <i className="bx bxs-user-circle"></i>
          {user.firstName} {user.lastName}
        </button>
      </Link>
    </div>
  );
};

export default User;
