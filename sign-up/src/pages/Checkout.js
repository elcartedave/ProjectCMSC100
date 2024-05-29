import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/CSS/Checkout.css";
import Notification from "../components/Notification.js";
import Modal from "../components/Modal.js"; // Import the Modal component

function Checkout() {
  const [summaryData, setSummaryData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [notification, setNotification] = useState("");
  const [modalMessage, setModalMessage] = useState(""); // State for modal message
  const [showModal, setShowModal] = useState(false); // State to control modal visibility


  useEffect(() => {
    const token = localStorage.getItem("cust-token");
    if (token) {//gets the userid from the tokenData
      axios
        .post("http://localhost:3001/token", { token })
        .then((response) => {
          const tokenData = response.data.tokenData;
          const userId = tokenData.userId;

          axios//get all the items of the shopping cart that is from userid
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
  
          // Track items that exceed available stock
          const itemsExceedingStock = [];
          summaryData.forEach((item) => {//check each item of summaryData(products in shopping cart)
            if (item.quantity > item.stock) {//checks each quantity and stock
              const excessQuantity = item.quantity - item.stock;//subtract it so that you get the excess
              itemsExceedingStock.push({//push in the array to be later displayed, it is an object displaying 
                //product name and the value of excess
                productName: item.productName,
                excessQuantity,
              });
            }
          });

          if (itemsExceedingStock.length > 0) {//if there is an existing product
            const message = itemsExceedingStock.map(//have a for loop
              (item) =>
                `${item.productName} (Excess: ${item.excessQuantity} units)`
            ).join("\n");//that will be print in the set Modal Mewssage
            setModalMessage(`Some items in your cart exceed available stock:\n${message}`);
            setShowModal(true); // Show the modal
            setTimeout(() => {
              setShowModal(false); // Close the modal after 5 seconds
            }, 5000);
            return; // Exit the checkout process
          }
  
          // Proceed with creating the order if all items pass the stock check
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
    <Modal
        message={modalMessage}
        show={showModal}
        handleClose={() => setShowModal(false)} // Close modal function
        time={5000} // Auto-close modal after 5 seconds
      />
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
