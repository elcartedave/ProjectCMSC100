import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Filter from "./Filter.js";
import "./CSS/UserProductList.css";
import Notification from "./Notification.js";

function ProductList() {
  const [product, setProduct] = useState([]);
  const [salesReport, setSalesReport] = useState([]);
  const [tokenData, settokenData] = useState([]);
  const [filtered, setFilter] = useState("name");
  const [filtered1, setFilter1] = useState("ascending");
  const [notification, setNotification] = useState("");
  let ProductL = [...product];

  const fProductList = () => {
    return ProductL.sort((a, b) => {
      if (filtered === "name") {
        let first = a.name.toLowerCase();
        let second = b.name.toLowerCase();
        if (filtered1 === "ascending") {
          if (first < second) {
            return -1;
          } else if (first > second) {
            return 1;
          } else {
            return 0;
          }
        } else if (filtered1 === "descending") {
          if (first > second) {
            return -1;
          } else if (first < second) {
            return 1;
          } else {
            return 0;
          }
        }
      } else if (filtered === "type") {
        let first = a.type;
        let second = b.type;
        if (filtered1 === "ascending") {
          if (first < second) {
            return -1;
          } else if (first > second) {
            return 1;
          } else {
            return 0;
          }
        } else if (filtered1 === "descending") {
          if (first > second) {
            return -1;
          } else if (first < second) {
            return 1;
          } else {
            return 0;
          }
        }
      } else if (filtered === "price") {
        let first = parseInt(a.price);
        let second = parseInt(b.price);
        if (filtered1 === "ascending") {
          if (first < second) {
            return -1;
          } else if (first > second) {
            return 1;
          } else {
            return 0;
          }
        } else if (filtered1 === "descending") {
          if (first > second) {
            return -1;
          } else if (first < second) {
            return 1;
          } else {
            return 0;
          }
        }
      } else if (filtered === "quantity") {
        let first = parseInt(a.quantity);
        let second = parseInt(b.quantity);
        if (filtered1 === "ascending") {
          if (first < second) {
            return -1;
          } else if (first > second) {
            return 1;
          } else {
            return 0;
          }
        } else if (filtered1 === "descending") {
          if (first > second) {
            return -1;
          } else if (first < second) {
            return 1;
          } else {
            return 0;
          }
        }
      } else {
        return ProductL;
      }
    });
  };
  const fetchSalesReport = async () => {
    try {
      const response = await axios.get("http://localhost:3001/salesreport");
      setSalesReport(response.data);
    } catch (error) {
      console.error("Failed to fetch sales report:", error);
    }
  };

  const getTotalItemsSold = (productId) => {
    const productSales = salesReport.find(
      (item) => item.productID === productId
    );
    return productSales ? productSales.totalSalesQuantity : 0;
  };

  useEffect(() => {
    axios.get("http://localhost:3001/productlist").then((response) => {
      setProduct(response.data);
      console.log(response);
    }); //get all products from product collection
    const token = localStorage.getItem("cust-token");
    axios.post("http://localhost:3001/token", { token }).then((response) => {
      settokenData(response.data.tokenData);
      console.log(response);
    }); //get token of user that is need in verification that the user is ordering
    fetchSalesReport();
  }, []);

  function FonChangeVS(fValue) {
    setFilter(fValue);
  }

  function FonChangeVS1(fValue) {
    setFilter1(fValue);
  }

  function CheckTokenPushCart(tokened, productid, productQuantity) {
    //pasing the token of user(contain userid) product id and product quantitty put in the cart
    setNotification(""); // Reset notification to trigger the change
    setTimeout(() => {
      if (productQuantity > 0) {
        axios
          .post("http://localhost:3001/shoppingcart", {
            productIDs: productid,
            userIDs: tokened.userId,
            quantity: 1,
          }) //pass the details that later be saved in SCS
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              setNotification("Added to cart!");
            }
          });
      } else {
        setNotification("Out of Stock"); //when user try to add to cart an out of stock product
      }
    }, 0); // Delay to ensure state reset
  }

  return (
    <>
      <Notification message={notification} />
      <div className="list-product">
        <Filter
          FonChangeSelect={FonChangeVS}
          FonChangeSelect1={FonChangeVS1}
        ></Filter>
      </div>
      <div className="productPanel">
        {fProductList().map((prod) => {
          return (
            <div className="productCard" key={prod._id}>
              <img
                src={prod.image}
                alt=""
                style={{ width: "100px", height: "100px" }}
              />
              <p className="product-name">{prod.name}</p>
              <p className="product-price"> ₱{prod.price}</p>
              <p className="product-type">
                Type: {prod.type} | Quantity: {prod.quantity} | Sold:{" "}
                {getTotalItemsSold(prod._id)}
              </p>

              <p className="product-description">{prod.description}</p>
              <button
                className="product-add"
                onClick={() =>
                  CheckTokenPushCart(tokenData, prod._id, prod.quantity)
                }
              >
                <i class="bx bx-cart-add"></i> ADD TO CART
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ProductList;
