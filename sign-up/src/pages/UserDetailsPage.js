import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const UserDetailsPage = () => {
  const { userid } = useParams();
  const [userID, setUserID] = useState(null);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserID = async () => {
      const token = localStorage.getItem("cust-token"); //get the token to get token id of the cusstomer
      if (token) {
        try {
          const response = await axios.post("http://localhost:3001/token", {
            token,
          });
          setUserID(response.data.tokenData.userId);
        } catch (error) {
          console.error("Error fetching userID:", error);
        }
      }
    };

    fetchUserID();
    fetchOrders();
    fetchProducts();
    //handleUserDetailsUpdate();
  }, []); //first render

  useEffect(() => {
    const fetchUser = async () => {
      if (userID === userid) {
        try {
          const response = await fetch("http://localhost:3001/userlist");
          const data = await response.json();
          const foundUser = data.find((item) => item._id === userID);
          if (foundUser) {
            setUser(foundUser);
            setFirstName(foundUser.firstName);
            setLastName(foundUser.lastName);
            setEmail(foundUser.email);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUser();
  }, [userID, userid]); //always fetchUser for every render

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/createOrder");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }; //get all orders from orderTransaction collection

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/productlist");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }; //get all product from productlist

  const getProductNameById = (productID) => {
    const product = products.find((item) => item._id === productID);
    return product ? product.name : "Deleted Product";
  }; //having a product id check its item._ if found show product name else the product is deleted

  const filteredOrders = orders
    .filter((order) => order.userID === userID)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); //get the order of the user and sort it by date

  const handlePasswordChange = async () => {
    if (newPassword !== retypePassword) {
      alert("Passwords do not match!");
      return;
    } //handles the change of the password if the new pass and retype is not same show alert

    try {
      const response = await axios.post(
        "http://localhost:3001/updatePassword",
        {
          userId: userID,
          newPassword,
        }
      ); //if equal use the userid to find userid in User collection then update the password with newPassword
      alert(response.data);
      setNewPassword("");
      setRetypePassword("");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const handleUserDetailsUpdate = async () => {
    try {
      await axios.post("http://localhost:3001/updateUser", {
        userId: userID,
        firstName,
        lastName,
        email,
      }); //same with the password it also needs the userId as it is need to find the ._id of user in User collection to update any of the attribute
      alert("User details updated successfully");
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <div>
      {user ? (
        <>
          <div>
            <h1 className="admin-header">
              <i className="bx bxs-user"></i> {user.firstName} {user.lastName}
            </h1>
            <h2 className="admin-subheader">{user.email}</h2>
          </div>

          <div>
            <h2>Edit User Details</h2>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
            <button onClick={handleUserDetailsUpdate}>Update</button>
          </div>

          <div>
            <h2>Change Password</h2>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <input
              type="password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              placeholder="Retype new password"
            />
            <button onClick={handlePasswordChange}>Update Password</button>
          </div>

          <div>
            <h1 className="pending-header">ORDER HISTORY</h1>
            <table className="user-field">
              <thead>
                <tr>
                  <th scope="col">TRANSACTION ID</th>
                  <th scope="col">DATE</th>
                  <th scope="col">PRICE</th>
                  <th scope="col">PRODUCTS</th>
                  <th scope="col">ORDER QTY</th>
                  <th scope="col">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td className="no-pending" colSpan="6">
                      No orders
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr>
                        <td className="order-name">{order._id}</td>
                        <td className="order-description">{order.date}</td>
                        <td className="order-price">Php {order.totalPrice}</td>
                        <td className="order-products">
                          {order.products.map((product, index) => (
                            <div key={index}>
                              {getProductNameById(product.productID)} x{" "}
                              {product.orderQuantity}
                            </div>
                          ))}
                        </td>
                        <td className="order-quantity">
                          {order.orderQuantity} PRODUCT
                        </td>
                        <td className="order-status">{order.status}</td>
                      </tr>
                      <br />
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <h1 className="admin-header">Loading</h1>
      )}
    </div>
  );
};
