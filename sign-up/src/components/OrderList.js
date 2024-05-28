import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/OrderList.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Pending");//set all status to pending 
  // const [cart, setShoppingCart] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);//put the fetch items on the useEffect

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/createOrder");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };//gets all orders from orderTransaction collection

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/productlist");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };//gets all products from pruducts collection later be used to display items in order not all products

  // const fetchShoppingCart = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3001/shoppingcart");
  //     setShoppingCart(response.data);
  //   } catch (error) {
  //     console.error("Failed to fetch ShoppingCart:", error);
  //   }
  // };

  const getProductNameById = (productID) => {
    const product = products.find((item) => item._id === productID);
    return product ? product.name : "Unknown Product";
  };//this takes a product id then comapre it to the _id in the collection if find return product.name if not unknown product

  const handleConfirm = async (transactionID) => {
    try {
      const response = await axios.post("http://localhost:3001/confirmOrder", {
        transactionID,
      });//takes the transaction id pass it because it is a req.body in confirmOrder

      const updatedStatus = response.data.includes("cancelled")//if the return data is cancelled then it will update the status of the order
      //because there are times admin still accept all order not looking at the quantity so it automatically cancelled order if there is no quantity left
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
            ? { ...order, status: "Cancelled" }
            : order
        )
      );
    } catch (error) {
      console.error("Failed to decline order:", error);
    }
  };//returns a status of order that is cancelled

  // Filter the orders array to include only the orders that match the selected status
const filteredOrders = orders.filter(
  (order) => order.status === selectedStatus
);

// Sort the filtered orders by date in descending order
filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

// Calculate the total number of orders with status "Pending"
const totalPending = orders.filter(
  (order) => order.status === "Pending"
).length;

// Calculate the total number of orders with status "Success"
const totalSuccess = orders.filter(
  (order) => order.status === "Success"
).length;

// Calculate the total number of orders with status "Cancelled"
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
