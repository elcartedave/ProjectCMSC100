import bcrypt from "bcrypt";
import { User } from "../models/user.js";

//app get method that finds all user
export const userList = async function (req, res) {
  const result = await User.find({});
  res.send(result);
};

//app delete, use post.method because it needs input on which user will be deleted using the id in the userlist
export const deleteUser = async function (req, res) {
  const { id } = req.body;
  try {
    await User.findByIdAndDelete(id);
    await SCS.deleteMany({ userID: id.toString() });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
};

//app.post that updates the password by first getting userId then enter a new password
export const updatePassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  if (!userId || !newPassword) {
    return res.status(400).send("User ID and new password are required");
  }
  //this try will convert the new password to a hash one and update it the current pass to a new one by finding id and updating password attribute
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    res.status(200).send("Password updated successfully");
  } catch (error) {
    res.status(500).send("Error updating password: " + error.message);
  }
};

// app.post that update user details route
export const updateUser = async (req, res) => {
  const { userId, firstName, lastName} = req.body; //check if there is an input to be updated
  if (!userId || !firstName || !lastName) {
    return res
      .status(400)
      .send("User ID, first name, last name, and email are required");
  }
  //same as the password finds the user instance by userId and check which attribute will be updated
  try {
    await User.findByIdAndUpdate(userId, { firstName, lastName});
    res.status(200).send("User details updated successfully");
  } catch (error) {
    res.status(500).send("Error updating user details: " + error.message);
  }
};

export const updateEmail = async (req, res) => {
  const {userId, email} = req.body;
  if(!userId || email){
    return res.status(400).send("User ID and Email are required");
  }

  try{
    let existing = await User.findOne({ email: req.body.email });
    if (existing == null && validator.isEmail(req.body.email)) {
      await User.findByIdAndUpdate(userId,{email});
      res.status(200).send("User email updated successfully");
    }
    else{
      res.status(400).send("Error on email, input a valid email or email is existing");
    }
  } catch(error){
    res.status(500).send("Error updating user email details "+ error.message);
  }
}