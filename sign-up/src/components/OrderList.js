import React, { useEffect, useState } from "react";
import axios from "axios"; //send requests to servers to get data (like fetching information from an API) or to send data (like submitting a form).
import "./CSS/OrderList.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]); //empty state of array at first
  const [products, setProducts] = useState([]); //empty state of array at first
  const [selectedStatus, setSelectedStatus] = useState("Pending"); //all status is initialized as pending

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []); //empty array initialize

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/createOrder");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };//get orders from get and sets from setOrders(response.data) are the order documents

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/productlist");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };//gets all product from productlist

  const getProductNameById = (productID) => {
    const product = products.find((item) => item._id === productID);
    return product ? product.name : "Unknown Product";
  };//function that compare ordermid to productID if it is existing 

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
            ? { ...order, status: updatedStatus }//go to the status key pair then update status 
            : order
        )
      );
      if (updatedStatus === "Cancelled") {
        alert(response.data);
      }
    } catch (error) {
      alert("Failed to confirm order:", error.response);
    }
  };//this handle confirm or the status will be updated by the admin to success

  const handleDecline = async (transactionID) => {
    try {
      await axios.post("http://localhost:3001/declineOrder", { transactionID });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === transactionID
            ? { ...order, status: "Cancelled" }
            : order
        )
      );
    } catch (error) {
      console.error("Failed to decline order:", error);
    }
  };//passes the transactioin id for verification on the status that it will be failed 

  const filteredOrders = orders.filter(
    (order) => order.status === selectedStatus
  );//filters order status based on selected status

  const totalPending = orders.filter(
    (order) => order.status === "Pending"
  ).length; //gets how many is pending
  const totalSuccess = orders.filter(
    (order) => order.status === "Success"
  ).length;//gets how many orders were successful
  const totalCancelled = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;//gets how many orders were cencelled
  const totalOrders = totalCancelled + totalPending + totalSuccess; //to dispaly total order regardless of the orders status

  return (
    <div>
      <h1 className="admin-header">ORDER MANAGEMENT</h1>
      <div className="ordernumber-field">
        <div>
          <h2 className="order-title">TOTAL ORDERS</h2>
          <h3 className="order-number">{totalOrders}</h3>
        </div>

        <div
          className="ordernumber-card"
          onClick={() => setSelectedStatus("Pending")}
        >
          <h2 className="order-title">PENDING ORDERS</h2>
          <h3 className="order-number">{totalPending}</h3>
        </div>

        <div
          className="ordernumber-card"
          onClick={() => setSelectedStatus("Success")}
        >
          <h2 className="order-title">CONFIRMED ORDERS</h2>
          <h3 className="order-number">{totalSuccess}</h3>
        </div>

        <div
          className="ordernumber-card"
          onClick={() => setSelectedStatus("Cancelled")}
        >
          <h2 className="order-title">CANCELLED ORDERS</h2>
          <h3 className="order-number">{totalCancelled}</h3>
        </div>
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
                  <td className="order-price">{order.totalPrice}</td>
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
                        onClick={() => handleConfirm(order._id)}
                      >
                        <i className="bx bx-check" />
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => handleDecline(order._id)}
                      >
                        <i className="bx bx-x" />
                      </button>
                    </td>
                  ) : (
                    <td className="order-status">{order.status}</td>
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
