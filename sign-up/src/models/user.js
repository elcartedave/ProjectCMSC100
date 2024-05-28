import mongoose from "mongoose";

const userDataSchema = {
  firstName: String,
  lastName: String,
  userType: String,
  email: String,
  password: String,
};

export const User = mongoose.model("userData", userDataSchema, "userData"); //instance of the model
