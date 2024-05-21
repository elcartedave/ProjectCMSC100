import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Filter from "./Filter.js";
import "./CSS/UserProductList.css";

function ProductList() {
  const [product, setProduct] = useState([]);
  const [tokenData, settokenData] = useState([]);
  const [filtered, setFilter] = useState("all");
  let ProductL = [...product];

  const fProductList = () => {
    return ProductL.sort((a, b) => {
      if (filtered === "name") {
        let first = a.name.toLowerCase();
        let second = b.name.toLowerCase();
        if (first < second) {
          return -1;
        } else if (first > second) {
          return 1;
        } else {
          return 0;
        }
      } else if (filtered === "type") {
        let first = a.type;
        let second = b.type;
        if (first < second) {
          return -1;
        } else if (first > second) {
          return 1;
        } else {
          return 0;
        }
      } else if (filtered === "price") {
        let first = parseInt(a.price);
        let second = parseInt(b.price);
        if (first < second) {
          return -1;
        } else if (first > second) {
          return 1;
        } else {
          return 0;
        }
      } else if (filtered === "quantity") {
        let first = parseInt(a.quantity);
        let second = parseInt(b.quantity);
        if (first < second) {
          return -1;
        } else if (first > second) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return ProductL;
      }
    });
  };

  useEffect(() => {
    axios.get("http://localhost:3001/productlist").then((response) => {
      setProduct(response.data);
      console.log(response);
    });
    const token = localStorage.getItem("cust-token");
    axios.post("http://localhost:3001/token", { token }).then((response) => {
      settokenData(response.data.tokenData);
      console.log(response);
    });
  }, []);

  function FonChangeVS(fValue) {
    setFilter(fValue);
  }

  function CheckTokenPushCart(tokened, productid, productQuantity) {
    if (productQuantity > 0) {
      axios
        .post("http://localhost:3001/shoppingcart", {
          productIDs: productid,
          userIDs: tokened.userId,
          quantity: 1,
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            alert("added to cart!");
          }
        });
    } else {
      alert("Out of stocks");
    }
  }

  return (
    <>
      <div className="list-product">
        <Filter FonChangeSelect={FonChangeVS}></Filter>
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
                Type: {prod.type} | Quantity: {prod.quantity}
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
