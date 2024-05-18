import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const UserDetailsPage = () => {
  const { userid } = useParams();
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
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (userID === userid) {
        try {
          const response = await fetch("http://localhost:3001/userlist");
          const data = await response.json();
          const foundUser = data.find((item) => item._id === userID);
          if (foundUser) {
            console.log("User found");
            setUser(foundUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUser();
  }, [userID, userid]);

  return (
    <div>
      {user ? (
        <>
          <div>
            <h3>
              Name: {user.firstName} {user.lastName}
            </h3>
            <p>Email: {user.email}</p>
          </div>
        </>
      ) : (
        <h1>Loading</h1>
      )}
    </div>
    //this part prints the user details if it is valid and prompts otherwise
  );
};
