import mongoose from "mongoose";

//schema for shopping cart
const ShoppingCartSchema = {
  productID: String,
  userID: String, //token
  productQuantity: Number,
};

export const SCS = mongoose.model(
  "shoppingCart",
  ShoppingCartSchema,
  "shoppingCart"
); //model instance using SCS
