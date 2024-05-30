import { SCS } from "../models/shoppingcart.js";
import { Product } from "../models/product.js";

//insertion of product add it to the database/collection as a document
export const addProduct = async (req, res) => {
  let products = await Product.find({}); //check if there is a product existing

  //automatic id generator
  let id;
  if (products.length > 0) {
    //if len greather than 0 add 1 to the last id
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  //creating the instance of the product input by the admin
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    type: req.body.type,
    price: req.body.price,
    description: req.body.description,
    quantity: req.body.quantity,
  });
  console.log(product);
  await product.save(); //saves the product information
  console.log("saved");
  res.json({
    success: true,
    name: req.body.name,
  });
};

//if you admin wants to remove product
export const removeProduct = async (req, res) => {
  await Product.findOneAndDelete({ _id: req.body._id }); //find and delete the product that has the same _id with the user input
  await SCS.deleteMany({ productID: req.body._id.toString() }); //remove instance in the shopping cart of customer
  console.log("Removed!");
  res.json({
    success: true,
    name: req.body.name,
  });
};

// get is used because it usage is displaying the product
export const productList = async function (req, res) {
  const result = await Product.find({}); //returns all instance of product
  res.send(result);
};

// Update the quantity of a product
export const updateQuantity = async (req, res) => {
  const { _id, quantityChange } = req.body;
  const product = await Product.findById(_id);
  if (product) {
    if (quantityChange > 0 && product.quantity >= 0) {
      product.quantity += quantityChange;
    } else if (quantityChange < 0 && product.quantity > 0) {
      product.quantity += quantityChange;
    }
    await product.save();
    res.json({ success: true, product });
  } else {
    res.json({ success: false, message: "Product not found" });
  }
};
