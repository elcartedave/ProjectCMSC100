import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/createOrder").then((response) => {
      setOrders(response.data);
    });
  }, []);

  const handleConfirm = async (transactionID) => {
    console.log(transactionID);
    try {
      await axios.post("http://localhost:3001/confirmOrder", { transactionID });
    } catch (error) {
      console.error("Failed to confirm order:", error);
    }
  };

  const handleDecline = async (transactionID) => {
    try {
      await axios.post("http://localhost:3001/declineOrder", { transactionID });
    } catch (error) {
      console.error("Failed to decline order:", error);
    }
  };

  return (
    <div>
      <h1>Order List</h1>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <p>User ID: {order.userID}</p>
            <p>Email: {order.email}</p>
            <span>Transaction ID: {order._id}</span>
            <span>Status: {order.status}</span>
            <button onClick={() => handleConfirm(order._id)}>Confirm</button>
            <button onClick={() => handleDecline(order._id)}>Decline</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
