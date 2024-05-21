import React, { useEffect, useState } from "react";
import "./CSS/ProductList.css";
import { Link } from "react-router-dom"; //without reload it can jump to another page similar to navigate

//function that shows product list in the side of admin
const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]); //empty state that will later show all products
  const fetchInfo = async () => {
    await fetch("http://localhost:3001/productlist") //it fetch from an app.get that it will return all find products
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);//the data that it received will be now sets in the All Products
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []); //it uses as useEffect as an empty array first , and after it can load all info from the all products

  // a function that needs product id that will be used to req.body product id in removing a product in the list
  const remove_product = async (id) => {
    await fetch("http://localhost:3001/removeproduct", {//fetch can be different type of request which in our case it is either post or get
      method: "POST",//post method
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ _id: id }),//sends key value pair that is productID to request body  as json file
    });
    await fetchInfo();//needs to finish fetchInfo before going to next line 
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
        <div>No products available</div>
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
