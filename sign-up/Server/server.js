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
    "Access-Control-Allow-Headers Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
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
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in " });
  }
});

//try
app.post("/token", async (req, res) => {
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

const ShoppingCartSchema = {
  productID : String,
  userID : String, //token
  productQuantity: Number,
};

const SCS = mongoose.model(
  "shoppingCart",
  ShoppingCartSchema,
  "shoppingCart"
);

app.post("/shoppingcart", async function (req, res) {
  const {productIDs, userIDs, quantity } = req.body;
  var empty = "";
  if(productIDs != empty && userIDs != empty && quantity != empty){
    let newShop = new SCS({
      productID: productIDs,
      userID: userIDs,
      productQuantity: quantity
    });
    await newShop
      .save()
      .then(() => {
        res.status(200).send("Add to cart successfully");
      })
      .catch((err) => {
        res.status(500).send("Product not added to cart");
      });
  }
});

app.get("/shoppingcart", async function (req, res) {
  const userId = req.query.userId; // Get userId from query parameters
  console.log("User ID:", userId);
  try {
    // Perform the aggregation
    const result = await SCS.aggregate([
      { $match: { userID: userId } }, // Match documents by userID
      {
        $addFields: {
            productIDAsOID: { $toObjectId: "$productID" }
        }
      },
      {
        $lookup: {
          from: "productList",
          localField: "productIDAsOID",
          foreignField: "_id",
          as: "ProductInShopCart"
        }
       },
      { $unwind: '$ProductInShopCart' },
      {
        $group: {
          _id: "$productID",
          productName: { $first: "$ProductInShopCart.productName" },
          quantity: { $sum: '$productQuantity' },
          totalPrice: { $sum: { $multiply: ["$productQuantity", "$ProductInShopCart.productPrice"] } }
        }
      }
    ]);

    // Send the aggregated results
    res.send(result);
  } catch (error) {
    console.error('Error fetching shopping cart items:', error);
    res.status(500).send('Internal Server Error');
  }
});

const orderTransactionSchema = {
  productID: String,
  orderQuantity: Number,
  email: String,
  date: Date,
  time: String,
};

const orderTransaction = mongoose.model(
  "transactions",
  orderTransactionSchema,
  "transactions"
);

app.post("/order", async function (req, res) {
  const { productID, orderQuantity, email, date, time } = req.body;
  var empty = "";
  if ( productID != empty && orderQuantity != empty && email != empty && date != empty && time != empty) {
    let newTransaction = new orderTransaction({
      productID: productID,
      orderQuantity: orderQuantity,
      email: email,
      date: date,
      time: time,
    });
    try {
      await newTransaction.save();
      res.status(200).send("Added new transaction");
    } catch (err) {
      res.status(500).send("Transaction failed");
    }
  }
});

app.listen(3001, function () {
  console.log("server is running");
});
