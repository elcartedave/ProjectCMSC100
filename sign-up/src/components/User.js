import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const User = () => {
  const [userID, setUserID] = useState(null);//both userID and user are null
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserID = async () => {
      const token = localStorage.getItem("cust-token"); //gets the value of token from browser local storage to token
      if (token) {
        try {
          axios
            .post("http://localhost:3001/token", { token })//pass it to token as a actual parameter
            .then((response) => {
              setUserID(response.data.tokenData.userId);//gets the user id from tokendata
            });
        } catch (error) {
          console.error("Error fetching userID:", error);
        }
      }
    };

    fetchUserID();//get request user id when rendered
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (userID) {//check if userID exist
        try {
          const response = await fetch("http://localhost:3001/userlist"); //gets the userlist data
          const data = await response.json(); //reads the JSON data from the response using the json() method and assigns it to the data variable. 
          const foundUser = data.find((item) => item._id === userID); //searches for a user in the data array whose _id matches the userID from the component's state.
          if (foundUser) {
            setUser(foundUser);//foundUser will be set as User
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUser(); //request to fetch user data when rendering or when userID changes.
  }, [userID]); // the effect will run whenever userID changes, ensuring that the user data is fetched again if the userID changes, like when a different user logs in.

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
