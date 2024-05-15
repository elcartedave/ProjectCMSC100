import express from "express";
import mongoose from "mongoose";
import validator from "validator";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

const app = express();
const secret_key = "farmtotable";
//middleware

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); //this use as converting format info in json data
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});
await mongoose.connect(
  "mongodb+srv://sadiares1:hKgPfm6gaefBBSm1@cluster0.namen2s.mongodb.net/ICS"
);

//create model
const userDataSchema = {
  firstName: String,
  lastName: String,
  userType: String,
  email: String,
  password: String,
};

const User = mongoose.model("userData", userDataSchema, "userData");

//app get
app.get("/userlist", async function (req, res) {
  const result = await User.find({});
  res.send(result);
});

//app delete
app.post("/userlist", async function (req, res) {
  const { id } = req.body;
  try {
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
});

//app post
app.post("/signup", async function (req, res) {
  var empty = "";
  var merchant = "merchant";
  var customer = "customer";
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  if (
    req.body.firstName != empty &&
    req.body.lastName != empty &&
    req.body.userType != empty &&
    req.body.password != empty &&
    req.body.email != empty
  ) {
    let ut = req.body.userType.toLowerCase();
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
        .save()
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
    res.status(400).send("Incomplete data provided");
  }
});

//GET LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password!" });
    }
    const token = jwt.sign({ userId: user._id }, secret_key, {
      expiresIn: "1hr",
    });
    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Error logging in " });
  }
});

const ProductDataSchema = {
  productName: String,
  productType: String,
  productPrice: Number,
  productDescription: String,
  productQuantity: Number,
};

const ProductL = mongoose.model(
  "productList",
  ProductDataSchema,
  "productList"
);

app.get("/productlist", async function (req, res) {
  const result = await ProductL.find({});
  res.send(result);
});

app.listen(3001, function () {
  console.log("server is running");
});
