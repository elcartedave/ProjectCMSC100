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
  //  "mongodb+srv://sadiares1:hKgPfm6gaefBBSm1@cluster0.namen2s.mongodb.net/ICS"
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
    await SCS.deleteMany({ userID: id.toString() });
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
      res.status(409).send("A user already exists with this email");
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
  await Product.findOneAndDelete({ _id: req.body._id });
  await SCS.deleteMany({ productID: req.body._id.toString() });
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

const ShoppingCartSchema = {
  productID: String,
  userID: String, //token
  productQuantity: Number,
};

const SCS = mongoose.model("shoppingCart", ShoppingCartSchema, "shoppingCart");

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
});

const orderTransaction = mongoose.model(
  "transactions",
  orderTransactionSchema,
  "transactions"
);

app.post("/createOrder", async function (req, res) {
  const { userID, products, email, date } = req.body;
  if (userID && products.length > 0 && email && date) {
    let totalOrderQuantity = 0;
    let totalOrderPrice = 0;

    products.forEach(async (product) => {
      totalOrderQuantity += product.orderQuantity;
      totalOrderPrice += product.totalPrice;
      try {
        await SCS.deleteMany({
          userID: userID,
          productID: product.productID,
        });
      } catch (error) {
        console.error("Error deleting cart items:", error);
        return res.status(500).send("Failed to delete cart items");
      }
    });

    let newTransaction = new orderTransaction({
      userID: userID,
      products: products,
      orderQuantity: totalOrderQuantity,
      totalPrice: totalOrderPrice,
      email: email,
      date: date,
      status: "Pending",
    });
    try {
      await newTransaction.save();
      res.status(200).send("Added new transaction");
    } catch (err) {
      res.status(500).send("Transaction failed");
    }
  }
});

app.get("/createOrder", async function (req, res) {
  const result = await orderTransaction.find({});
  res.send(result);
});

app.post("/confirmOrder", async function (req, res) {
  const { transactionID } = req.body;
  if (transactionID) {
    try {
      const transaction = await orderTransaction.findById(transactionID);
      if (!transaction) {
        return res.status(404).send("Transaction not found");
      }
      for (const product of transaction.products) {
        const existingProduct = await Product.findById(product.productID);
        if (!existingProduct) {
          return res.status(404).send(`Product ${product.productID} not found`);
        }

        if (existingProduct.quantity < product.orderQuantity) {
          transaction.status = "Cancelled";
          await transaction.save();
          return res
            .status(200)
            .send("Transaction cancelled due to insufficient product quantity");
        }
      }

      transaction.status = "Success";
      await transaction.save();

      for (const product of transaction.products) {
        const existingProduct = await Product.findById(product.productID);
        existingProduct.quantity -= product.orderQuantity;
        await existingProduct.save();
      }

      res
        .status(200)
        .send(
          "Transaction status updated to Success, product quantities updated"
        );
    } catch (err) {
      console.error("Error updating transaction or product quantities:", err);
      res
        .status(500)
        .send("Failed to update transaction status or product quantities");
    }
  } else {
    res.status(400).send("Invalid request, transaction ID required");
  }
});

app.post("/declineOrder", async function (req, res) {
  const { transactionID } = req.body;
  if (transactionID) {
    try {
      const transaction = await orderTransaction.findById(transactionID);
      if (!transaction) {
        return res.status(404).send("Transaction not found");
      }

      transaction.status = "Cancelled";
      await transaction.save();

      res.status(200).send("Transaction status updated to Decline");
    } catch (err) {
      res.status(500).send("Failed to update transaction status");
    }
  } else {
    res.status(400).send("Invalid request, transaction ID required");
  }
});

app.post("/shoppingcart", async function (req, res) {
  const { productIDs, userIDs, quantity } = req.body;
  var empty = "";
  if (productIDs != empty && userIDs != empty && quantity != empty) {
    let newShop = new SCS({
      productID: productIDs,
      userID: userIDs,
      productQuantity: quantity,
    });
    try {
      await newShop.save();
      res.status(200).send("Add to cart successfully");
    } catch (err) {
      console.log("error!", err);
      res.status(500).send("Product not added to cart");
    }
  }
});

app.get("/shoppingcart", async function (req, res) {
  const userId = req.query.userId;
  console.log("User ID:", userId);
  try {
    const result = await SCS.aggregate([
      { $match: { userID: userId } },
      {
        $addFields: {
          productIDAsOID: { $toObjectId: "$productID" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productIDAsOID",
          foreignField: "_id",
          as: "ProductInShopCart",
        },
      },
      { $unwind: "$ProductInShopCart" },
      {
        $group: {
          _id: "$productID",
          productName: { $first: "$ProductInShopCart.name" },
          quantity: { $sum: "$productQuantity" },
          totalPrice: {
            $sum: {
              $multiply: ["$productQuantity", "$ProductInShopCart.price"],
            },
          },
        },
      },
    ]);

    res.send(result);
  } catch (error) {
    console.error("Error fetching shopping cart items:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/images", express.static(path.join(__dirname, "./upload/images")));

app.post("/removeitem", async (req, res) => {
  const { productID, userID } = req.body;

  if (!productID || !userID) {
    return res
      .status(400)
      .json({ error: "Product ID and User ID are required" });
  }

  try {
    // Find the item in the cart
    const cartItem = await SCS.findOne({ productID, userID });

    if (!cartItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    if (cartItem.productQuantity > 1) {
      // Decrease the quantity
      cartItem.productQuantity -= 1;
      await cartItem.save();
      res.json({
        success: true,
        message: "Item quantity decreased successfully",
      });
    } else {
      // Remove the item if quantity is 1
      await SCS.findOneAndDelete({ productID, userID });
      res.json({
        success: true,
        message: "Item removed from cart successfully",
      });
    }
  } catch (error) {
    console.error("Error updating item quantity in cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//app.get("/user")

app.listen(3001, function () {
  console.log("server is running on port 3001");
});
