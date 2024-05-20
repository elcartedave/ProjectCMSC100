import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/OrderList.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/createOrder").then((response) => {
      setOrders(response.data);
    });
  }, []);
  

  const handleConfirm = async (transactionID) => {

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
const pendingOrders = orders.filter((order) => order.status === "Pending");
const successOrders = orders.filter((order) => order.status === "Success");
const canceledOrders = orders.filter((order) => order.status === "Canceled");

const totalOrders = pendingOrders.length + successOrders.length + canceledOrders.length;
const totalPending = pendingOrders.length;
const totalSuccess = successOrders.length;
const totalCanceled = canceledOrders.length;


  return (
    <div>
      <h1 className="admin-header">ORDER MANAGAMENT</h1>
      <div className="ordernumber-field">
        <div className="ordernumber-card">
          <h2 className="order-title">TOTAL ORDERS</h2>
          <h3 className="order-number">{totalOrders}</h3>
        </div>

        <div className="ordernumber-card">
          <h2 className="order-title">PENDING ORDERS</h2>
          <h3 className="order-number">{totalPending}</h3>
        </div>

        <div className="ordernumber-card">
          <h2 className="order-title">CONFIRMED ORDERS</h2>
          <h3 className="order-number">{totalSuccess}</h3>
        </div>

        <div className="ordernumber-card">
          <h2 className="order-title">CANCELED ORDERS</h2>
          <h3 className="order-number">{totalCanceled}</h3>
        </div>
      </div>
      <h1 className="pending-header">PENDING CONFIRMATION:</h1>
      <table className="user-field">
    <tr>
      <th scope="col">TRANSACTION ID</th>
      <th scope="col">DATE</th>
      <th scope="col">EMAIL</th>
      <th scope="col">PRICE</th>
    </tr>
  <tbody>
    {pendingOrders.length === 0 ? (
        <td className="no-pending">No pending orders</td>
    ) : (
      pendingOrders.map((order) => (
        <tr key={order._id}>
          <td className="order-name">{order._id}</td>
          <td className="order-description">{order.date}</td>
          <td className="order-description">{order.email}</td>
          <td className="order-price">{order.totalPrice}</td>
          <td>
            <button className="confirm-btn" onClick={() => handleConfirm(order._id)}>
              <i className='bx bx-check' />
            </button>
            <button className="cancel-btn" onClick={() => handleDecline(order._id)}>
              <i className='bx bx-x' />
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

    </div>
  );
};

export default OrderList;
