import axios from "axios";
import React, { useEffect, useState } from "react";
import "./CSS/UserList.css";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/userlist").then((response) => {
      setUsers(response.data);
      console.log(response);
    });
  });//returns the list of user from user collection

  const deleteUser = (id) => {
    axios
      .post("http://localhost:3001/userlist", { id })
      .then((response) => {
        if (response.data.success) {
          setUsers(users.filter((user) => user._id !== id));
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };//if the admin wants to delete an account of customer user by finding the user id of the customer then delete it

  const customerUsers = users.filter((user) => user.userType === "customer"); //to show users with type customer only

  return (
    <>
    <div className="user-list">
    <h1 className="admin-header">USER MANAGEMENT</h1>
    <h2 className="admin-subheader">Registered Users</h2>
      <table className="user-field">
        <tr>
          <th scope="col">FIRST NAME</th>
          <th scope="col">LAST NAME</th>
          <th scope="col">EMAIL</th>
        </tr>
        {customerUsers.map((user) => {
          return (
            <tr key={user._id}>
              <td className="user-name">{user.firstName}</td>
              <td className="user-name">{user.lastName}</td>
              <td className="user-email">{user.email}</td>
              <td>
                <button
                  className="nav-btn"
                  onClick={() => deleteUser(user._id)}
                >
                  <i class='bx bx-user-x' undefined ></i> Delete
                </button>
              </td>
            </tr>
          );
        })}
      </table>
      <h1 className="user-count">TOTAL USERS: {customerUsers.length}</h1>
      </div>
    </>
  );
}

export default UserList;
