import React, { useEffect, useState } from "react";

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
      body: JSON.stringify({ id: id }),
    });
    await fetchInfo();
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Type</p>
        <p>Description</p>
        <p>Quantity</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => {
          return (
            <>
              <div key={index} className="listproduct-format-main">
                <img src={product.image} alt="" />
                <p>{product.name}</p>
                <p>Php {product.price}</p>
                <p>{product.type}</p>
                <p>{product.description}</p>
                <p>{product.quantity}</p>
                <button onClick={() => remove_product(product.id)}>
                  Delete
                </button>
              </div>
              <hr />
            </>
          );
        })}
      </div>
    </div>
  );
};
export default ListProduct;
