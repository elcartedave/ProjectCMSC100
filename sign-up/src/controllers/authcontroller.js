import bcrypt from "bcrypt"; // hashing of password before saving it to the database/ collection/ document
import jwt from "jsonwebtoken"; // to have a valid token for authentication and authorization
import { User } from "../models/user.js";
import validator from "validator"; //check if email is valid

const secret_key = "farmtotable"; //secret key

//app post useed in signup because it should not display information in url,
export const signup = async (req, res) => {
  var empty = "";
  var merchant = "merchant";
  var customer = "customer";
  const hashedPassword = await bcrypt.hash(req.body.password, 10); //passes the password enter by user and 10 for the num of rounds to hash

  if (
    //cond to create a user
    req.body.firstName != empty &&
    req.body.lastName != empty &&
    req.body.userType != empty &&
    req.body.password != empty &&
    req.body.email != empty
  ) {
    let existing = await User.findOne({ email: req.body.email });
    let ut = req.body.userType.toLowerCase();
    if (existing == null) {
      if (
        (ut == merchant || ut == customer) &&
        validator.isEmail(req.body.email)
      ) {
        let newsignUP = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userType: req.body.userType.toLowerCase(),
          email: req.body.email,
          password: hashedPassword,
        });
        await newsignUP
          .save() //save the user
          .then(() => {
            res.status(200).send("Account created successfully");
          })
          .catch((err) => {
            res.status(500).send("Error creating account: " + err.message);
          });
      } else {
        res.status(400).send("Invalid data provided");
      }
    } else {
      res.status(409).send("A user already exists with this email");
    }
  } else {
    res.status(400).send("Incomplete data provided");
  }
};

//GET LOGIN
export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body; //the input will be passed gets its value by req.body
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password); //checks if the user input password is same with the crypt password
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password!" });
    }
    const token = jwt.sign({ userId: user._id }, secret_key); //give token for authorization and authentication, what acc is the user: admin or customer
    res.json({ success: true, token, userType: user.userType });
  } catch (error) {
    res.status(500).json({ error: "Error logging in " });
  }
};

//get token that will be used to authenticate which user is logged in and which shopping cart must be presented
export const token = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const tokenData = jwt.verify(token, secret_key);
    res.json({ message: "Token Verified", tokenData });
  } catch (error) {
    res.status(500).json({ error: "Error on verifying token " });
  }
};
