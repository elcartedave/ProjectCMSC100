import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./CSS/Dashboard.css";

const AdminNavbar = () => {
  //sets the state on respective 0, empty
  const [sales, setSales] = useState(0);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchInfo();
    fetchUsers();
    fetchSalesReport();
  }, []);//put all fetch information to useEffect so that it is rendered everytime

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/createOrder");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };//gets all orders from orderTransaction collection then set that data to setOrders

  const fetchInfo = async () => {
    try {
      const response = await fetch("http://localhost:3001/productlist");
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Failed to fetch product info:", error);
    }
  };//gets again the products then set the responsedata to all products

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/userlist");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };//gets all user from user collection then set its responsedata to Users

  const fetchSalesReport = async () => {
    try {
      const response = await axios.get("http://localhost:3001/salesreport");
      calculateTotals(response.data);//pass the data to calculate only the sales because it is displayed
    } catch (error) {
      console.error("Failed to fetch sales report:", error);
    }
  };//gets all sales report from the aggregated informtaion

  const calculateTotals = (report) => {
    let totalAmount = 0;
    report.forEach((item) => {
      totalAmount += item.totalSalesAmount;//gets each items total sales then total it
    });
    setSales(totalAmount);
  };//only gets the total amount of all sales

  const totalOrders = orders.length;
  const totalUsers = users.filter(
    (user) => user.userType === "customer"
  ).length;
  const totalProducts = allProducts.length;

  return (
    <div className="dashboard">
      <h1 className="admin-header">DASHBOARD</h1>
      <h2 className="admin-subheader">Welcome Back!</h2>

      <h1 className="pending-header">HIGHLIGHTS</h1>
      <div className="ordernumber-field">
        <Link
          to={"/userlist"}
          style={{margin: "0px 10px", width: "22%", textDecoration: "none" }} // Applying styles directly
          className="ordernumber-card"
        >
          <div>
            <h2 className="highlights-title">
              <i className="bx bxs-user"></i> USERS
            </h2>
            <h3 className="highlights-number">{totalUsers}</h3>
          </div>
        </Link>

        <Link
          to={"/listproduct"}
          style={{margin: "0px 10px", width: "22%", textDecoration: "none" }} // Applying styles directly
          className="ordernumber-card"
        >
          <div>
            <h2 className="highlights-title">
              <i className="bx bxs-shopping-bags"></i> PRODUCTS
            </h2>
            <h3 className="highlights-number">{totalProducts}</h3>
          </div>
        </Link>

        <Link
          to={"/orderlist"}
          style={{margin: "0px 10px", width: "22%", textDecoration: "none" }} // Applying styles directly
          className="ordernumber-card"
        >
          <div>
            <h2 className="highlights-title">
              <i className="bx bxs-package"></i> ORDERS
            </h2>
            <h3 className="highlights-number">{totalOrders}</h3>
          </div>
        </Link>

        <Link
          to={"/salesreport"}
          style={{margin: "0px 10px", width: "22%", textDecoration: "none" }} // Applying styles directly
          className="ordernumber-card"
        >
          <div>
            <h2 className="highlights-title">
              <i className="bx bxs-chart"></i> SALES
            </h2>
            <h3 className="highlights-number">PHP {sales}</h3>
          </div>
        </Link>
      </div>

      <h1 className="pending-header">RECENT ACTIVITY</h1>
      <table className="user-field">
        <thead>
          <tr>
            <th scope="col">TRANSACTION ID</th>
            <th scope="col">DATE</th>
            <th scope="col">EMAIL</th>
            <th scope="col">PRICE</th>
            <th scope="col">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(-5).map((order) => (
            <tr key={order._id}>
              <td className="order-name">{order._id}</td>
              <td className="order-description">{order.date}</td>
              <td className="order-description">{order.email}</td>
              <td className="order-price">{order.totalPrice}</td>
              <td className="order-status">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminNavbar;
