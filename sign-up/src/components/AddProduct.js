import React, { useState } from "react";
import "./CSS/AddProduct.css";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification.js";

const AddProduct = () => {
  const navigate = useNavigate(); // use to jump path
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    type: "crop",
    price: "",
    description: "",
    quantity: "",
  });//state the has empty values from the start if no product is added yet but has a custom 
  //type as crop unless specified as poultry

  const imageHandler = (e) => {
    setImage(e.target.files[0]); //get image
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };//change the state details when entered information on the form

  const [notification, setNotification] = useState("");

  const Add_Product = async (e) => {
    e.preventDefault();
    setNotification("");
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append("product", image);//gets image then append it to the formData

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
      });//gets the image 

    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);
      await fetch("http://localhost:3001/addproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),//convert all details to a json that will later be saved
      })//saves the product on the collection
        .then((resp) => resp.json())
        .then((data) => {
          if (data.success) {
            setNotification("Product Added!");
            setProductDetails({
              name: "",
              image: "",
              type: "crop",
              price: "",
              description: "",
              quantity: "",
            });
            setImage(false);
            setTimeout(() => {
              window.location.replace("/listproduct");//jump to /listproduct
            }, 1000);
          } else {
            setNotification("Failed!");
          }
        });
    }
  };

  return (
    <>
      <Notification message={notification} />
      <div className="add-product">
        <h1 className="admin-header">ADD A PRODUCT</h1>
        <form onSubmit={Add_Product} className="addproduct-itemfield">
          <p className="input-label">Product Name</p>
          <input
            value={productDetails.name}
            onChange={changeHandler}
            type="text"
            name="name"
            className="product-input"
            placeholder="Type Here"
            autoComplete="off"
            required
          />
          <p className="input-label">Price</p>
          <input
            value={productDetails.price}
            onChange={changeHandler}
            type="number"
            name="price"
            className="product-input"
            placeholder="Type Here"
            autoComplete="off"
            required
          />
          <p className="input-label">Product Type</p>
          <select
            value={productDetails.type}
            onChange={changeHandler}
            name="type"
            className="select-type"
            required
          >
            <option value="crop">Crop</option>
            <option value="poultry">Poultry</option>
          </select>
          <p className="image-label">Product Image</p>
          <img
            src={image ? URL.createObjectURL(image) : "./images/add-image.png"}
            alt=""
            className="product-thumbnail"
          />
          <br />
          <label htmlFor="file-input" className="product-image">
            <i className="bx bx-image-add"></i> ADD IMAGE
          </label>
          <input
            onChange={imageHandler}
            className="image-input"
            type="file"
            name="image"
            id="file-input"
            hidden
            required
          />
          <p className="input-label">Description</p>
          <input
            value={productDetails.description}
            onChange={changeHandler}
            name="description"
            className="product-input"
            type="text"
            placeholder="Type Here"
            autoComplete="off"
            required
          />
          <p className="input-label">Quantity</p>
          <input
            value={productDetails.quantity}
            onChange={changeHandler}
            type="number"
            placeholder="Type Here"
            name="quantity"
            className="product-input"
            autoComplete="off"
            required
          />
          <div>
            <button type="submit" className="add-button">
              <i className="bx bx-check"></i>
              ADD PRODUCT
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
