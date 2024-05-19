import React, { useState } from "react";
import "./CSS/AddProduct.css";
import { useNavigate } from "react-router-dom";
const AddProduct = () => {
  const navigate = useNavigate();
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
            navigate("/listproduct");
          } else {
            alert("Failed!");
          }
        });
    }
  };

  return (
    <div className="add-product">
      <h1 className="admin-header">ADD A PRODUCT</h1>
      <div className="addproduct-itemfield">
        <p className="input-label">Product Name</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          className="product-input"
          placeholder="Type Here"
          autocomplete="off"
        />
          <p className="input-label">Price</p>
          <input
            value={productDetails.price}
            onChange={changeHandler}
            type="text"
            name="price"
            className="product-input"
            placeholder="Type Here"
            autocomplete="off"
          />
        <p className="input-label">Product Type</p>
        <select
          value={productDetails.type}
          onChange={changeHandler}
          name="type"
          className="select-type"
        >
          <option value="crop">Crop</option>
          <option value="poultry">Poultry</option>
        </select>       
        <p className="image-label">Product Image</p>
        <img
            src={
              image
                ? URL.createObjectURL(image)
                : "./images/add-image.png"
            }
            alt=""
            className="product-thumbnail"
          />
        <br />
        <label htmlFor="file-input" className="product-image"> <i class='bx bx-image-add' ></i> ADD IMAGE</label>
        <input
          onChange={imageHandler}
          className="image-input"
          type="file"
          name="image"
          id="file-input"
          hidden
        />
        <p className="input-label">Description</p>
        <input
          value={productDetails.description}
          onChange={changeHandler}
          name="description"
          className="product-input"
          type="text"
          placeholder="Type Here"
          autocomplete="off"
        />
        <p className="input-label">Quantity</p>
        <input
          value={productDetails.quantity}
          onChange={changeHandler}
          type="number"
          placeholder="Type Here"
          name="quantity"
          className="product-input"
          autocomplete="off"
        />
      <div>
      <button
        onClick={() => {
          Add_Product();
          console.log("Image" + image);
        }}
        className="add-button"
      >
        <i class='bx bx-check'></i>
          ADD PRODUCT
      </button>
      </div>
      </div>
    </div>
  );
};
export default AddProduct;
