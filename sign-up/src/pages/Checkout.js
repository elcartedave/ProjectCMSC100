import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Checkout.css"; // Import your CSS file

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
          console.log(email);
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
    <div className="container mt-4">
      <h2 className="checkout-title">Checkout Summary</h2>
      <div className="card-container">
        {summaryData.map((item) => (
          <div className="card card-checkout" key={item._id}>
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title">{item.productName}</h5>
              </div>
              <div>
                <p className="card-text">Quantity: {item.quantity}</p>
              </div>
              <div>
                <p className="card-text">Total Price: P{item.totalPrice}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="shipping-option">Shipping Option: Cash On Delivery</p>
      <p className="total-info">Total Items: {totalItems}</p>
      <p className="total-info">Total Price: {totalPrice}</p>
      <button className="btn btn-success btn-confirm" onClick={handleCheckout}>
        Confirm Transaction
      </button>
    </div>
  );
}

export default Checkout;
