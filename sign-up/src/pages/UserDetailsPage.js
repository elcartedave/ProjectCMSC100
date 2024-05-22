import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const UserDetailsPage = () => {
  const { userid } = useParams();
  const [userID, setUserID] = useState(null);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

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
    fetchOrders();
    fetchProducts();
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

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/createOrder");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/productlist");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const getProductNameById = (productID) => {
    const product = products.find((item) => item._id === productID);
    return product ? product.name : "Deleted Product";
  };

  const filteredOrders = orders
    .filter((order) => order.userID === userID)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      {user ? (
        <>
          <div>
            <h1 className="admin-header">
            <i class='bx bxs-user' ></i> {user.firstName} {user.lastName}
            </h1>
            <h2 className="admin-subheader">{user.email}</h2>
          </div>
          
          <div>
            <div>
              <h1 className="pending-header">ORDER HISTORY</h1>
            </div>
            <table className="user-field">
              <tr>
              <th scope="col">TRANSACTION ID</th>
              <th scope="col">DATE</th>
              <th scope="col">PRICE</th>
              <th scope="col">PRODUCTS</th>
              <th scope="col">ORDER QTY</th>
              <th scope="col">STATUS</th>
              </tr>
            {filteredOrders.length === 0 ? (
              <tr>
                <td className="no-pending" colSpan="6">
                  No orders
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <>
                  <tr key={order._id}>
                    <td className="order-name">{order._id}</td>
                    <td className="order-description">{order.date}</td>
                    <td className="order-price">{order.totalPrice}</td>
                    <td className="order-products">
                      {order.products.map((product, index) => (
                        <div key={index}>
                          {getProductNameById(product.productID)} x{" "}
                          {product.orderQuantity} 
                        </div>
                      ))}
                    </td>
                    <td className="order-quantity">{order.orderQuantity} PRODUCT</td>
                    <td className="order-status">{order.status}</td>
                  </tr>
                  <br />
                </>
              ))
            )}
            </table>
          </div>
        </>
      ) : (
        <h1 className="admin-header">Loading</h1>
      )}
    </div>
    //this part prints the user details if it is valid and prompts otherwise
  );
};
