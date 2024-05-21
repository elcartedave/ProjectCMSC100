import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


function Checkout() {
  const [summaryData, setSummaryData] = useState([]);//empty array
  const [totalItems, setTotalItems] = useState(0);//initialize to no items
  const [totalPrice, setTotalPrice] = useState(0);//initialize to 0 totalPrice

  useEffect(() => {
    const token = localStorage.getItem("cust-token");//need to get token that will be use for user id
    if (token) {
      axios
        .post("http://localhost:3001/token", { token })//gets the token
        .then((response) => {
          const tokenData = response.data.tokenData;//returns the data of what token it received
          const userId = tokenData.userId;//assign the token id to useid

          axios
            .get("http://localhost:3001/shoppingcart", { params: { userId } })//need to have a parameter of userId as the checkout needs a userId for identification
            .then((response) => {
              setSummaryData(response.data);//get all the list of products that the user checkout
              let items = 0;
              let price = 0;
              response.data.forEach((item) => {
                items += item.quantity;
                price += item.totalPrice;
              });
              setTotalItems(items);//set the total quantities it get
              setTotalPrice(price);// adds all the price 
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
          const resp = await fetch("http://localhost:3001/userlist");//get request to get userlist data
          const data = await resp.json(); //the data will be transfrom to a json data
          const foundUser = data.find((item) => item._id === userId); // find user with _id == userId
          const date = new Date();//date
          const email = foundUser.email;//email
          console.log(email);
          const products = summaryData.map((item) => ({
            productID: item._id,
            orderQuantity: item.quantity,
            totalPrice: item.totalPrice,
          }));//the loop creates array of product objects with productID, orderQuantity, totalPrice (mainly the info in shopping cart)

          axios
            .post("http://localhost:3001/createOrder", {
              userID: userId,
              products,
              email,
              date,
            })//to create a new order with the provided data.
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
      <h2>Checkout Summary</h2>
      {summaryData.map((item) => (
        <div className="card mb-3" key={item._id}>
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
      <p>Shipping Option: Cash On Delivery</p>
      <p>Total Items: {totalItems}</p>
      <p>Total Price: {totalPrice}</p>
      <button className="btn btn-success" onClick={handleCheckout}>
        Confirm Transaction
      </button>
    </div>
  );
}

export default Checkout;
