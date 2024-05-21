import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const UserDetailsPage = () => {
  const { userid } = useParams();//parameter extract from url jsut get userid
  const [userID, setUserID] = useState(null);//null state
  const [user, setUser] = useState(null);//null state

  useEffect(() => {
    const fetchUserID = async () => {
      const token = localStorage.getItem("cust-token");//again for checking of authentication
      if (token) {
        try {
          axios
            .post("http://localhost:3001/token", { token })
            .then((response) => {
              setUserID(response.data.tokenData.userId);// updates the userID state with the user ID from the response tokenData.
            });
        } catch (error) {
          console.error("Error fetching userID:", error);
        }
      }
    };

    fetchUserID();//for execution
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (userID === userid) {//compares the userID to userid from url
        try {
          const response = await fetch("http://localhost:3001/userlist");//get request to get user data/information
          const data = await response.json();//the response will be in a json format
          const foundUser = data.find((item) => item._id === userID);//if the user is existing it must be a matching userID in the userlist
          if (foundUser) {
            console.log("User found");
            setUser(foundUser);//sets the foundUser to User
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUser();//for exceution
  }, [userID, userid]);//whenever there is changes in here it runs the useEffect

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
