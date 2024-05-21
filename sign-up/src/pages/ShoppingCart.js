import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function ShoppingCart() {
  const [summaryData, setSummaryData] = useState([]);//empty array
  const [totalItems, setTotalItems] = useState(0);// 0 items
  const [totalPrice, setTotalPrice] = useState(0);//0 price

  useEffect(() => {
    const token = localStorage.getItem("cust-token");//gets the  "cust-token" then assign into token
    if (token) {
      axios
        .post("http://localhost:3001/token", { token }) //post method that verifies the token
        .then((response) => {
          const tokenData = response.data.tokenData;//gets the tokenData from the response
          const userId = tokenData.userId; //gets the userId from the tokenData 
          console.log("User ID from token:", userId);

          axios
            .get("http://localhost:3001/shoppingcart", { params: { userId } })//the userId will be use to verify which shopping cart is being access
            .then((response) => {
              setSummaryData(response.data);
              console.log("Shopping cart data:", response.data);
              let items = 0;
              let price = 0;
              response.data.forEach((item) => {
                items += item.quantity;
                price += item.totalPrice;
              });
              setTotalItems(items);//updates the totalItems from each of the items in shopping cart 
              setTotalPrice(price);//same here but it adds up the price
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

  const handleRemove = (productID) => {
    const token = localStorage.getItem("cust-token");//gets the  "cust-token" then assign into token - same in the useEffect this process needs to be done to verify the user
    axios
      .post("http://localhost:3001/token", { token })
      .then((response) => {
        const tokenData = response.data.tokenData;
        const userID = tokenData.userId;

        axios
          .post("http://localhost:3001/removeitem", {
            productID,
            userID,
          })//when removing an item the productID and userID must be presented as you want to know which product would be remove and from which user
          .then((response) => {
            if (response.data.success) {
              // Update the summaryData state to decrease the quantity or remove the item
              const updatedSummaryData = summaryData
                .map((item) => {
                  if (item._id === productID) {//if item id match with product id (identified in shopping cart)
                    if (item.quantity > 1) {//if greater than 1 just subtract from quantity
                      return {
                        ...item,
                        quantity: item.quantity - 1,
                        totalPrice:
                          item.totalPrice - item.totalPrice / item.quantity,
                      };
                    }
                    return null; // This will be filtered out (simply removal of the item)
                  }
                  return item;//Returns the unchanged item if productID does not match.
                })
                .filter(Boolean);//if any null values is find it will be filtered out from updatedSummaryData

              setSummaryData(updatedSummaryData);//needs to set the updated for summary data

              // Recalculate total items and total price
              let items = 0;
              let price = 0;
              updatedSummaryData.forEach((item) => {
                items += item.quantity;
                price += item.totalPrice;
              });
              setTotalItems(items);
              setTotalPrice(price);
            } else {
              console.error(
                "Error removing item from cart:",
                response.data.error
              );
            }
          })
          .catch((error) => {
            console.error("Error removing item from cart:", error);
          });
      })
      .catch((error) => {
        console.error("Token verification error:", error);
      });
  };

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
              <div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No items in the shopping cart.</p>
      )}
      {totalItems !== 0 ? (
        <>
          <p>Total Items: {totalItems}</p>
          <p>Total Price: {totalPrice}</p>
          <Link to="/checkout">
            <button>Checkout</button>
          </Link>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ShoppingCart;
