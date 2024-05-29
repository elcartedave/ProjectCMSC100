import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/OrderList.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Pending");

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

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
    return product ? product.name : "Unknown Product";
  };

  const handleConfirm = async (transactionID) => {
    try {
      const response = await axios.post("http://localhost:3001/confirmOrder", {
        transactionID,
      });

      const updatedStatus = response.data.includes("cancelled")
        ? "Cancelled"
        : "Success";
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === transactionID
            ? { ...order, status: updatedStatus }
            : order
        )
      );
      if (updatedStatus === "Cancelled") {
        alert(response.data);
      }
    } catch (error) {
      alert("Failed to confirm order:", error.response);
    }
  };

  const handleDecline = async (transactionID) => {
    try {
      await axios.post("http://localhost:3001/declineOrder", { transactionID });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === transactionID
            ? { ...order, status: "Cancelled", cancelledBy: "admin" }
            : order
        )
      );
    } catch (error) {
      console.error("Failed to decline order:", error);
    }
  };

  const filteredOrders = orders.filter(
    (order) => order.status === selectedStatus
  );

  filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPending = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const totalSuccess = orders.filter(
    (order) => order.status === "Success"
  ).length;

  const totalCancelled = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  return (
    <div>
      <h1 className="admin-header">ORDER MANAGEMENT</h1>
      <div className="ordernumber-field">
        <button
          className="ordernumber-card"
          onClick={() => setSelectedStatus("Pending")}
        >
          <h2 className="order-title">PENDING ORDERS: {totalPending}</h2>
        </button>

        <button
          className="ordernumber-card"
          onClick={() => setSelectedStatus("Success")}
        >
          <h2 className="order-title">CONFIRMED ORDERS: {totalSuccess}</h2>
        </button>

        <button
          className="ordernumber-card"
          onClick={() => setSelectedStatus("Cancelled")}
        >
          <h2 className="order-title">CANCELLED ORDERS: {totalCancelled}</h2>
        </button>
      </div>

      <h1 className="pending-header">{selectedStatus.toUpperCase()} ORDERS:</h1>
      <table className="user-field">
        <thead>
          <tr>
            <th scope="col">TRANSACTION ID</th>
            <th scope="col">DATE</th>
            <th scope="col">EMAIL</th>
            <th scope="col">PRICE</th>
            <th scope="col">PRODUCTS</th>
            {selectedStatus === "Pending" ? (
              <th scope="col">ACTIONS</th>
            ) : (
              <th scope="col">STATUS</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td className="no-pending" colSpan="6">
                No {selectedStatus.toLowerCase()} orders
              </td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <>
                <tr key={order._id}>
                  <td className="order-name">{order._id}</td>
                  <td className="order-description">{order.date}</td>
                  <td className="order-description">{order.email}</td>
                  <td className="order-price">Php {order.totalPrice}</td>
                  <td className="order-products">
                    {order.products.map((product, index) => (
                      <div key={index}>
                        {getProductNameById(product.productID)} x{" "}
                        {product.orderQuantity}
                      </div>
                    ))}
                  </td>
                  {selectedStatus === "Pending" ? (
                    <td>
                      <button
                        className="confirm-btn"
                        onClick={() => handleConfirm(order._id, order.email)}
                      >
                        <i className="bx bx-check" />
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => handleDecline(order._id, order.email)}
                      >
                        <i className="bx bx-x" />
                      </button>
                    </td>
                  ) : (
                    <td className="order-status">
                      {order.status}
                      {order.status === "Cancelled" &&
                        (order.cancelledBy === "admin"
                          ? " (Cancelled by Admin)"
                          : " (Cancelled by User)")}
                    </td>
                  )}
                </tr>
                <br />
              </>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
