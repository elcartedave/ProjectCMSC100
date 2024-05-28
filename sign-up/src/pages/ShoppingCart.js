import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../components/CSS/ShoppingCart.css";

function ShoppingCart() {
  const [summaryData, setSummaryData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("cust-token");//know that the user is customer
    if (token) {
      axios
        .post("http://localhost:3001/token", { token })
        .then((response) => {
          const tokenData = response.data.tokenData;
          const userId = tokenData.userId;
          console.log("User ID from token:", userId);//get the user id from the token

          axios
            .get("http://localhost:3001/shoppingcart", { params: { userId } })
            .then((response) => {
              const sortedData = response.data.sort((a, b) =>
                a.productName.localeCompare(b.productName)
              );
              setSummaryData(sortedData);//sort products by product name
              console.log("Shopping cart data:", sortedData);
              let items = 0;
              let price = 0;
              sortedData.forEach((item) => {
                items += item.quantity;
                price += item.totalPrice;
              });
              setTotalItems(items);//total quantity of a product (each)
              setTotalPrice(price);//total price of a product (each)
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

  const handleIncrease = (productID) => {//if you want to add quantity without going back to the product listing
    const token = localStorage.getItem("cust-token");
    axios
      .post("http://localhost:3001/token", { token })
      .then((response) => {
        const tokenData = response.data.tokenData;
        const userID = tokenData.userId;//get userid
        axios
          .post("http://localhost:3001/shoppingcart", {
            productIDs: productID,
            userIDs: userID,
            quantity: 1,
          })//add that quantity to the shopping cart 
          .then((response) => {
            console.log(response);
            axios
              .get("http://localhost:3001/shoppingcart", {//this recalculate and update the shopping cart of the user
                params: { userId: userID },
              })
              .then((response) => {
                const sortedData = response.data.sort((a, b) =>
                  a.productName.localeCompare(b.productName)
                );
                setSummaryData(sortedData);
                let items = 0;
                let price = 0;
                sortedData.forEach((item) => {
                  items += item.quantity;
                  price += item.totalPrice;
                });
                setTotalItems(items);
                setTotalPrice(price);
              })
              .catch((error) => {
                console.error("Error fetching shopping cart:", error);
              });
          });
      })
      .catch((error) => {
        console.error("Token verification error:", error);
      });
  };

  const handleRemove = (productID) => {
    const token = localStorage.getItem("cust-token");
    axios
      .post("http://localhost:3001/token", { token })
      .then((response) => {
        const tokenData = response.data.tokenData;
        const userID = tokenData.userId;

        axios
          .post("http://localhost:3001/removeitem", {
            productID,
            userID,
          })
          .then((response) => {
            if (response.data.success) {
              // Update the summaryData state to decrease the quantity or remove the item
              const updatedSummaryData = summaryData
                .map((item) => {
                  if (item._id === productID) {
                    if (item.quantity > 1) {
                      return {
                        ...item,
                        quantity: item.quantity - 1,
                        totalPrice:
                          item.totalPrice - item.totalPrice / item.quantity,
                      };
                    }
                    return null; // This will be filtered out
                  }
                  return item;
                })
                .filter(Boolean)
                .sort((a, b) => a.productName.localeCompare(b.productName));

              setSummaryData(updatedSummaryData);

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

  const handleRemoveAll = () => {
    const token = localStorage.getItem("cust-token");
    if (token) {
      axios
        .post("http://localhost:3001/token", { token })
        .then((response) => {
          const tokenData = response.data.tokenData;
          const userID = tokenData.userId;//find user id by token

          axios
            .post("http://localhost:3001/removeAllItems", { userID })//remove all items like reset the shopping cart after the checkout button is click
            .then((response) => {
              if (response.data.success) {
                setSummaryData([]);
                setTotalItems(0);
                setTotalPrice(0);
              } else {
                console.error(
                  "Error removing all items from cart:",
                  response.data.error
                );
              }
            })
            .catch((error) => {
              console.error("Error removing all items from cart:", error);
            });
        })
        .catch((error) => {
          console.error("Token verification error:", error);
        });
    }
  };

  return (
    <div className="shoppingcart-container">
      <h1 className="admin-header">SHOPPING CART</h1>
      {summaryData.length > 0 ? (
        <div>
          <button className="add-product-button" onClick={handleRemoveAll}>
            Remove All
          </button>
          {summaryData.map((item) => (
            <div className="cart-item" key={item._id}>
              <div className="cartitem-info">
                <div className="cartitem-image">
                  <img src={item.image} alt="" />
                </div>
                <div className="cartitem-details">
                  <h1 className="cartitem-name">{item.productName}</h1>
                  <h2 className="cartitem-description">
                    Quantity: {item.quantity}
                  </h2>
                  <h2 className="cartitem-description">
                    Total Price: Php {item.totalPrice.toFixed(2)}
                  </h2>
                </div>
                <div className="cartitem-buttons">
                  <button
                    className="cancel-btn"
                    onClick={() => handleRemove(item._id)}
                  >
                    -
                  </button>
                  <button
                    className="confirm-btn"
                    onClick={() => handleIncrease(item._id)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
          <>
            <div className="cart-summary">
              <p className="summary-text">Total Items: {totalItems}</p>
              <p className="summary-text">
                Total Price: ₱ {totalPrice.toFixed(2)}
              </p>
              <Link to="/checkout" className="btn btn-primary checkout-button">
                Checkout
              </Link>
            </div>
          </>
        </div>
      ) : (
        <h2 className="admin-subheader">Your shopping cart is empty.</h2>
      )}
    </div>
  );
}

export default ShoppingCart;
