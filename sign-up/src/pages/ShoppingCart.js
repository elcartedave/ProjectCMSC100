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
              const sortedData = response.data.sort((a, b) =>
                a.productName.localeCompare(b.productName)
              );
              setSummaryData(sortedData);
              console.log("Shopping cart data:", sortedData);
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
        })
        .catch((error) => {
          console.error("Token verification error:", error);
        });
    }
  }, []);

  const handleIncrease = (productID) => {
    const token = localStorage.getItem("cust-token");
    axios
      .post("http://localhost:3001/token", { token })
      .then((response) => {
        const tokenData = response.data.tokenData;
        const userID = tokenData.userId;
        axios
          .post("http://localhost:3001/shoppingcart", {
            productIDs: productID,
            userIDs: userID,
            quantity: 1,
          })
          .then((response) => {
            console.log(response);
            axios
              .get("http://localhost:3001/shoppingcart", {
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
          const userID = tokenData.userId;

          axios
            .post("http://localhost:3001/removeAllItems", { userID })
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
    <div className="container mt-4">
      <h2>Shopping Cart</h2>
      {summaryData.length > 0 ? (
        <div>
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
                  <p className="card-text">
                    Total Price: Php {item.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <button
                    className="btn btn-danger btn-sm mr-2"
                    onClick={() => handleRemove(item._id)}
                  >
                    -
                  </button>
                  <button
                    className="btn btn-success btn-sm mr-2"
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
            <p>Total Items: {totalItems}</p>
            <p>Total Price: {totalPrice}</p>
            <div>
              <button className="btn btn-danger" onClick={handleRemoveAll}>
                Remove All
              </button>
              <Link to="/checkout" className="btn btn-primary ml-2">
                Checkout
              </Link>
            </div>
          </>
        </div>
      ) : (
        <p>Your shopping cart is empty.</p>
      )}
    </div>
  );
}

export default ShoppingCart;
