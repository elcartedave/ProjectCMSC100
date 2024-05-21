import React, { useState } from "react";
import "./CSS/AddProduct.css";
import { useNavigate } from "react-router-dom";
const AddProduct = () => {
  const navigate = useNavigate(); //use later for routing 
  const [image, setImage] = useState(false); // image visibility (not visible) initial render
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    type: "crop",
    price: "",
    description: "",
    quantity: "",
  });//product details that all are empty string while type is crop

  const imageHandler = (e) => {
    setImage(e.target.files[0]); //get image
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value }); 
  };//sets the product in use state that spread productDetails, e.target.name is about name attribute in form : while e.target.value is like the key

  //function call to add product
  const Add_Product = async () => {
    console.log(productDetails);
    let responseData; //variable name
    let product = productDetails; // the value after set product now the productDetails contain key value pairs

    let formData = new FormData(); //form data key value pairs that use when dealing with images
    formData.append("product", image); // used here

    //req to server, it request to upload an image
    await fetch("http://localhost:3001/upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData, //sends formData to request body for upload image
    })
      .then((resp) => resp.json())
      .then((data) => {
        responseData = data;
      });
    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);
      await fetch("http://localhost:3001/addproduct", {//can be able to add products by JSON.stringify -> convert object to json format
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product), //sends formData to request body for products detail as json file
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.success) { // use to reset the product details
            alert("Product Added!");
            setProductDetails({
              name: "",
              image: "",
              type: "crop",
              price: "",
              description: "",
              quantity: "",
            });
            setImage(false);//return image to not visible
            navigate("/listproduct");//if success jump to a new path called /listproduct wherein it shows product list in admin 
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
