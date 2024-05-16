import express from "express";
import mongoose from "mongoose";
import validator from "validator";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
const app = express();
const secret_key = "farmtotable";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
  "mongodb+srv://elcartedave:cmsc100@cluster0.o6ffaeb.mongodb.net/"
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
    const token = jwt.sign({ userId: user._id }, secret_key);
    res.json({ success: true, token, userType: user.userType });
  } catch (error) {
    res.status(500).json({ error: "Error logging in " });
  }
});

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});

  //automatic id generator
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

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
  await product.save();
  console.log("saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

app.post("/removeProduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed!");
  res.json({
    success: true,
    name: req.body.name,
  });
});

app.get("/productlist", async function (req, res) {
  const result = await Product.find({});
  res.send(result);
});

const storage = multer.diskStorage({
  destination: path.join(__dirname, "./upload/images"),
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single("product"), function (req, res) {
  res.json({
    success: 1,
    image_url: `http://localhost:3001/images/${req.file.filename}`,
  });
});

app.use("/images", express.static(path.join(__dirname, "./upload/images")));

app.listen(3001, function () {
  console.log("server is running");
});
