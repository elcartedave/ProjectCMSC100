import React, { useEffect, useState } from "react";
import "./CSS/ProductList.css";
import Filter from "./Filter.js";
import { Link } from "react-router-dom";

const ListProduct = () => {
  const [product, setAllProducts] = useState([]);
  const [filtered, setFilter] = useState("name");
  const [filtered1, setFilter1] = useState("ascending");
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

  function FonChangeVS(fValue) {
    setFilter(fValue);
  }

  function FonChangeVS1(fValue) {
    setFilter1(fValue);
  }
  const fetchInfo = async () => {
    await fetch("http://localhost:3001/productlist")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    await fetch("http://localhost:3001/removeproduct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ _id: id }),
    });
    await fetchInfo();
  };

  return (
    <div className="list-product">
      <Filter
        FonChangeSelect={FonChangeVS}
        FonChangeSelect1={FonChangeVS1}
      ></Filter>
      <h1 className="admin-header">PRODUCTS</h1>
      <Link to="/addproduct" style={{ textDecoration: "none" }}>
        <button className="add-product-button">
          <i className="bx bx-plus-circle"></i> ADD PRODUCT
        </button>
      </Link>
      {fProductList().length === 0 ? (
        <div>No products available</div>
      ) : (
        <div className="productPanel">
          {fProductList().map((product, index) => {
            return (
              <div key={index} className="productCard">
                <img src={product.image} alt="" />
                <p className="product-name">{product.name}</p>
                <p className="product-price">&#8369; {product.price}</p>
                <p className="product-type">
                  {product.type} | {product.quantity}
                </p>
                <p className="product-description">{product.description}</p>
                <button
                  onClick={() => remove_product(product._id)}
                  className="product-delete"
                >
                  DELETE
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default ListProduct;
