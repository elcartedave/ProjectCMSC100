import axios from "axios";
import React, { useEffect, useState } from "react";

const SalesReport = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  let totalPrice = 0;

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

  const filteredOrders = orders.filter((order) => order.status === "Success");

  return (
    <div>
      {filteredOrders.length === 0 ? (
        <>
          <h1>No Income Yet</h1>
          <h1>No Sales Yet!</h1>
        </>
      ) : (
        <>
          <h1>Total Number of Sales: {filteredOrders.length}</h1>
          {filteredOrders.map((order) => {
            totalPrice += order.totalPrice;
          })}

          <h1>Php {totalPrice}</h1>
        </>
      )}
    </div>
  );
};

export default SalesReport;
