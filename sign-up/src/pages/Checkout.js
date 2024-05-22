import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../components/CSS/Checkout.css";

function Checkout() {
  const [summaryData, setSummaryData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("cust-token");
    if (token) {
      axios
        .post("http://localhost:3001/token", { token })
        .then((response) => {
          const tokenData = response.data.tokenData;
          const userId = tokenData.userId;

          axios
            .get("http://localhost:3001/shoppingcart", { params: { userId } })
            .then((response) => {
              setSummaryData(response.data);
              let items = 0;
              let price = 0;
              response.data.forEach((item) => {
                items += item.quantity;
                price += item.totalPrice;
              });
              setTotalItems(items);
              setTotalPrice(price);
            })
            .catch((error) => {
              console.error("Error fetching shopping cart:", error);
            });
        })
        .catch((error) => {
          console.error("Token verification error:", error);
        });
    }
  }, []);

  const handleCheckout = () => {
    const token = localStorage.getItem("cust-token");
    if (token) {
      axios
        .post("http://localhost:3001/token", { token })
        .then(async (response) => {
          const tokenData = response.data.tokenData;
          const userId = tokenData.userId;
          const resp = await fetch("http://localhost:3001/userlist");
          const data = await resp.json();
          const foundUser = data.find((item) => item._id === userId);
          const date = new Date();
          const email = foundUser.email;
          const products = summaryData.map((item) => ({
            productID: item._id,
            orderQuantity: item.quantity,
            totalPrice: item.totalPrice,
          }));

          axios
            .post("http://localhost:3001/createOrder", {
              userID: userId,
              products,
              email,
              date,
            })
            .then(() => {
              alert("Transaction successful!");
              window.location.replace("/");
            })
            .catch((error) => {
              console.error("Transaction error:", error);
              alert("Transaction failed!");
            });
        })
        .catch((error) => {
          console.error("Token verification error:", error);
        });
    }
  };

  return (
    <div className="container">
      <h2>Checkout Summary</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map((item) => (
            <tr key={item._id}>
              <td>{item.productName}</td>
              <td>{item.quantity}</td>
              <td>P{item.totalPrice / item.quantity}</td> {/* Calculate price per item */}
            </tr>
          ))}
        </tbody>
      </table>
      <p>Shipping Option: Cash On Delivery</p>
      <div className="total-summary">
        <p>Total Items: {totalItems}</p>
        <p>Total Price: P{totalPrice}</p>
      </div>
      <button className="btn btn-success" onClick={handleCheckout}>
        Confirm Transaction
      </button>
    </div>
  );
}

export default Checkout;
