import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Filter from "./Filter.js"; //import the filter for sorting
import "./CSS/UserProductList.css";

function ProductList() {
  const [product, setProduct] = useState([]); //empty state
  const [tokenData, settokenData] = useState([]); //empty state
  const [filtered, setFilter] = useState("all"); //initially the showed products is all (unsorted just the way it was loaded)
  let ProductL = [...product];//spread the product

  const fProductList = () => {//this is a function that what is going to happen if the product is sorted any of by name, type, price, and quantity arranged in descending order
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
  }, []);//get all product and token for which shopping cart of the user will be filled in 

  function FonChangeVS(fValue) {
    setFilter(fValue);
  }//gets whether you choose name, type, price quantity or all

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
  }//it pass the parameters tokened: as which userid is used, productid compare to products.id and product quantity always 1

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
