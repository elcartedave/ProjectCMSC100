import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ShoppingCart() {
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
          console.log("User ID from token:", userId);

          axios
            .get("http://localhost:3001/shoppingcart", { params: { userId } })
            .then((response) => {
              setSummaryData(response.data);
              console.log("Shopping cart data:", response.data);
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

  return (
    <div className="container mt-4">
      <h2>Shopping Cart</h2>
      {summaryData.length > 0 ? (
        summaryData.map((item) => (
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
        ))
      ) : (
        <p>No items in the shopping cart.</p>
      )}
      {totalItems != 0 ? (
        <>
          <p>Total Items: {totalItems}</p>
          <p>Total Price: {totalPrice}</p>
          <button>Checkout</button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ShoppingCart;
