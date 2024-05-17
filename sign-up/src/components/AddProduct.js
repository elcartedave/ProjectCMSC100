import React, { useState } from "react";
const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    type: "crop",
    price: "",
    description: "",
    quantity: "",
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]); //get image
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append("product", image);

    await fetch("http://localhost:3001/upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        responseData = data;
      });
    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);
      await fetch("http://localhost:3001/addproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.success) {
            alert("Product Added!");
            setProductDetails({
              name: "",
              image: "",
              type: "crop",
              price: "",
              description: "",
              quantity: "",
            });
            setImage(false);
            window.scrollTo(0, 0);
          } else {
            alert("Failed!");
          }
        });
    }
  };

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product Name</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type Here"
          autocomplete="off"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.price}
            onChange={changeHandler}
            type="text"
            name="price"
            placeholder="Type Here"
            autocomplete="off"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Type</p>
        <select
          value={productDetails.type}
          onChange={changeHandler}
          name="type"
          className="add-product-selector"
        >
          <option value="crop">Crop</option>
          <option value="poultry">Poultry</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : "https://cdn2.iconfinder.com/data/icons/font-awesome/1792/upload-512.png"
            }
            alt=""
            className="addproduct-thumnail-img"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <div className="addproduct-itemfield">
        <p>Description</p>
        <input
          value={productDetails.description}
          onChange={changeHandler}
          name="description"
          type="text"
          placeholder="Type Here"
          autocomplete="off"
        />
      </div>
      <div className="addproduct-itemfield">
        <p>Quantity</p>
        <input
          value={productDetails.quantity}
          onChange={changeHandler}
          type="number"
          placeholder="Type Here"
          name="quantity"
          autocomplete="off"
        />
      </div>
      <button
        onClick={() => {
          Add_Product();
          console.log("Image" + image);
        }}
        className="addproduct-btn"
      >
        ADD
      </button>
    </div>
  );
};
export default AddProduct;
