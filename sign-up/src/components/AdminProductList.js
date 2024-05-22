import React, { useEffect, useState } from "react";
import "./CSS/ProductList.css";
import { Link } from "react-router-dom";

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);
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
      <h1 className="admin-header">PRODUCTS</h1>
      <Link to="/addproduct" style={{ textDecoration: "none" }}>
        <button className="add-product-button">
          <i className="bx bx-plus-circle"></i> ADD PRODUCT
        </button>
      </Link>
      {allproducts.length === 0 ? (
        <h1 className="pending-header"><i class='bx bx-x'></i>No products available</h1>
      ) : (
        <div className="productPanel">
          {allproducts.map((product, index) => {
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
