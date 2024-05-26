import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/CSS/Checkout.css";
import Notification from "../components/Notification.js";

function Checkout() {
  const [summaryData, setSummaryData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [notification, setNotification] = useState("");

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
    setNotification(""); // Reset notification to trigger the change
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
              setNotification("Order Checkout!");
              setTimeout(() => {
                window.location.replace("/");
              }, 1000);
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
    <>
    <Notification message={notification} />
    <div className="container">
      <h1 className="admin-header">CHECKOUT SUMMARY</h1>
      <table className="user-field">
        <thead>
          <tr>
            <th>PRODUCT NAME </th>
            <th>QUANTITY</th>
            <th>PRICE</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map((item) => (
            <tr key={item._id}>
              <td className="order-name">{item.productName}</td>
              <td className="order-description">{item.quantity}</td>
              <td className="order-price">P{item.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="checkout-summary">
        <p>Shipping Option: Cash On Delivery</p>
        <p>Total Items: {totalItems}</p>
        <p>Total Price: ₱ {totalPrice}</p>
        <button className="add-product-button" onClick={handleCheckout}>
        <i class='bx bx-cart-download'></i> CHECKOUT ORDERS
      </button>
      </div>
    </div>
    </>
  );
}

export default Checkout;
