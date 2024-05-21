import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./CSS/Dashboard.css";

const AdminNavbar = () => {

  useEffect(() => {
    fetchOrders();
    fetchInfo();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/createOrder");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };


  const fetchInfo = async () => {
    await fetch("http://localhost:3001/productlist")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
      });
  };

  useEffect(() => {
    axios.get("http://localhost:3001/userlist").then((response) => {
      setUsers(response.data);
      console.log(response);
    });
  });

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [allproducts, setAllProducts] = useState([]);

  const totalOrders =  orders.filter((order) => order.status === "Pending").length +
  orders.filter((order) => order.status === "Success").length +
  orders.filter((order) => order.status === "Cancelled").length;
  const totalUsers = users.filter((user) => user.userType === "customer").length;
  const totalProducts = allproducts.length;

  return (
    <div className="dashboard">
      <h1 className="admin-header">DASHBOARD</h1>
      <h2 className="admin-subheader">Welcome Back!</h2>

      <h1 className="pending-header">HIGHLIGHTS</h1>
      <div className="ordernumber-field">

      <Link to={"/userlist"} style={{ textDecoration: "none" }} className="ordernumber-card">
        <div>
          <h2 className="order-title"><i class='bx bxs-user'></i> USERS</h2>
          <h3 className="order-number">{totalUsers}</h3>
        </div>
      </Link>

      <Link to={"/listproduct"} style={{ textDecoration: "none" }} className="ordernumber-card">
        <div>
          <h2 className="order-title"><i class='bx bxs-shopping-bags' ></i> PRODUCTS</h2>
          <h3 className="order-number">{totalProducts}</h3>
        </div>
      </Link>

      <Link to={"/orderlist"} style={{ textDecoration: "none" }} className="ordernumber-card">
        <div>
          <h2 className="order-title"><i class='bx bxs-package' ></i> ORDERS</h2>
          <h3 className="order-number">{totalOrders}</h3>
        </div>
      </Link>

      <Link to={"/salesreport"} style={{ textDecoration: "none" }} className="ordernumber-card">
        <div>
          <h2 className="order-title"><i class='bx bxs-chart' ></i> SALES</h2>
          <h3 className={totalOrders}></h3>
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
