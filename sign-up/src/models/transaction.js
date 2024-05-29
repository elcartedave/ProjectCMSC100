import mongoose from "mongoose";

//schema for order transaction array of products
const orderTransactionSchema = new mongoose.Schema({
  userID: String,
  products: [
    {
      productID: String,
      orderQuantity: Number,
      totalPrice: Number,
    },
  ],
  orderQuantity: Number,
  totalPrice: Number,
  email: String,
  date: Date,
  status: String,
  cancelledBy: String,
});

//model for schema with instance as oderTransaction
export const orderTransaction = mongoose.model(
  "transactions",
  orderTransactionSchema,
  "transactions"
);
