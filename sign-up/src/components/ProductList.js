import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Filter from "./Filter.js";

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
    if (productQuantity !== 0) {
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
      <div className="row">
        <Filter FonChangeSelect={FonChangeVS}></Filter>
      </div>
      <div className="container mt-5">
        <div className="row">
          {fProductList().map((prod) => {
            return (
              <div className="col-md-4 mb-4" key={prod._id}>
                <div className="card h-100">
                  <div className="card-body">
                    <img
                      src={prod.image}
                      alt=""
                      style={{ width: "100px", height: "100px" }}
                    />
                    <h5 className="card-title">{prod.name}</h5>
                    <br />
                    <h6 className="card-subtitle mb-2 text-muted">
                      Type: {prod.type}
                    </h6>
                    <p className="card-text">Price: ₱{prod.price}</p>
                    <p className="card-text">Description: {prod.description}</p>
                    <p className="card-text">Quantity: {prod.quantity}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        CheckTokenPushCart(tokenData, prod._id, prod.quantity)
                      }
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ProductList;
