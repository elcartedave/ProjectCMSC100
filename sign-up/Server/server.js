import express from "express";//route and api
import mongoose from "mongoose";//connector to db and use related to mongodb functions
import validator from "validator";//check if email is valid
import cors from "cors";//cross server to connect backend port 3001 to frontend port 3000
import bcrypt from "bcrypt";;// hashing of password before saving it to the database/ collection/ document
import jwt from "jsonwebtoken";// to have a valid token for authentication and authorization
import bodyParser from "body-parser";//make a json available for requests body
import multer from "multer";// uploading files
import path from "path";//directory find path of file
const app = express();// instance of express using app
const secret_key = "farmtotable";//secret key

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//middleware

app.use(cors());// middleware allows the server to respond to requests from a different origin (domain, protocol, or port) than the one it's hosted on.


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
});// similar to cors just the expanded version
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

const User = mongoose.model("userData", userDataSchema, "userData");//instance of the model

//app get method that finds all user
app.get("/userlist", async function (req, res) {
  const result = await User.find({});
  res.send(result);
});

//app delete, use post.method because it needs input on which user will be deleted using the id in the userlist
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

//app.post that updates the password by first getting userId then enter a new password
app.post("/updatePassword", async (req, res) => {
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
});

// app.post that update user details route
app.post("/updateUser", async (req, res) => {
  const { userId, firstName, lastName, email } = req.body; //check if there is an input to be updated
  if (!userId || !firstName || !lastName || !email) {
    return res.status(400).send("User ID, first name, last name, and email are required");
  }
//same as the password finds the user instance by userId and check which attribute will be updated
  try {
    await User.findByIdAndUpdate(userId, { firstName, lastName, email });
    res.status(200).send("User details updated successfully");
  } catch (error) {
    res.status(500).send("Error updating user details: " + error.message);
  }
});

//app post useed in signup because it should not display information in url, 
app.post("/signup", async function (req, res) {
  var empty = "";
  var merchant = "merchant";
  var customer = "customer";
  const hashedPassword = await bcrypt.hash(req.body.password, 10);//passes the password enter by user and 10 for the num of rounds to hash

  if (//cond to create a user
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
          .save()//save the user
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
    const { email, password } = req.body;//the input will be passed gets its value by req.body
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);//checks if the user input password is same with the crypt password
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password!" });
    }
    const token = jwt.sign({ userId: user._id }, secret_key);//give token for authorization and authentication, what acc is the user: admin or customer
    res.json({ success: true, token, userType: user.userType });
  } catch (error) {
    res.status(500).json({ error: "Error logging in " });
  }
});

//schema for addition of product
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

//insertion of product add it to the database/collection as a document
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});//check if there is a product existing

  //automatic id generator
  let id;
  if (products.length > 0) {//if len greather than 0 add 1 to the last id 
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
  await product.save();//saves the product information
  console.log("saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

//if you admin wants to remove product
app.post("/removeProduct", async (req, res) => {
  await Product.findOneAndDelete({ _id: req.body._id }); //find and delete the product that has the same _id with the user input
  await SCS.deleteMany({ productID: req.body._id.toString() });//remove instance in the shopping cart of customer
  console.log("Removed!");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// get is used because it usage is displaying the product
app.get("/productlist", async function (req, res) {
  const result = await Product.find({});//returns all instance of product
  res.send(result);
});

//specifies the destination folder for uploads (./upload/images) and generates unique 
//filenames for uploaded files based on the field name, along with date  and original file extension.
const storage = multer.diskStorage({
  destination: path.join(__dirname, "./upload/images"),
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`//wherecamefrom date .png .jpg or what . it is
    );
  },
});
const upload = multer({ storage: storage });//later be use for upload

//uploads the image of the product, construction of url where the file is accessible
app.post("/upload", upload.single("product"), function (req, res) {
  res.json({
    success: 1,
    image_url: `http://localhost:3001/images/${req.file.filename}`,
  });
});

//schema for shopping cart
const ShoppingCartSchema = {
  productID: String,
  userID: String, //token
  productQuantity: Number,
};

const SCS = mongoose.model("shoppingCart", ShoppingCartSchema, "shoppingCart");//model instance using SCS

//get token that will be used to authenticate which user is logged in and which shopping cart must be presented
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
});

//model for schema with instance as oderTransaction
const orderTransaction = mongoose.model(
  "transactions",
  orderTransactionSchema,
  "transactions"
);

//createOrder, gets all necessary request body that will later be saved in the database/collection document this is use as a checkout for 
//items in shopping cart -USER SIDe
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

//gets all the orders in checkout (collection: transaction) that has a status of pending
app.get("/createOrder", async function (req, res) {
  const result = await orderTransaction.find({});
  res.send(result);
});

//use to change the status by finding the transaction id (_id) to Success/ it also updates the quantity of product shown in user side
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

//if the admin declines the checkout this is where the status going to be canceled
// same use of transaction id (_id) also the products quantity will remain as is
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

// post for shopping cart it gets the productID fk from products._id userID fk from Users and product Quantity
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

//used for display, use of aggregate function similar to join
//match - find all with same user id
//addFields - convert the product id(currently string ) to a objectid
//lookup - where will it join from(which foreign collection), localField(which part of the SCS), foreignField(which key attribute to join)
//as is what will the join table called
//unwind - used for decomposing of array
//group - used for what data after the decomposition of array will be displayed (selection of attributes to display)
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
          stock: { $first: "$ProductInShopCart.quantity" },
          image: { $first: "$ProductInShopCart.image" },
        },
      },
    ]);

    res.send(result);
  } catch (error) {
    console.error("Error fetching shopping cart items:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/images", express.static(path.join(__dirname, "./upload/images")));//use images that in the directory of upload it contains all images used in the program

//if user wants to remove an item from the cart it needs the product id and user id 
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

//remove all items in the shopping cart after checkout , gets userId then delete all items in shopping cart db with the same user id
app.post("/removeAllItems", async (req, res) => {
  const { userID } = req.body;

  if (!userID) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Remove all items for the user
    await SCS.deleteMany({ userID });
    res.json({
      success: true,
      message: "All items removed from cart successfully",
    });
  } catch (error) {
    console.error("Error removing all items from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/salesreport", async function (req, res) {
  const { startDate, endDate } = req.query;//get the startDate and endDate

  const dateFilter = {};//empty object later hold the documents within specified date range
  if (startDate) dateFilter.$gte = new Date(startDate);//This means that only documents with dates greater than or equal to startDate will match. will go on the dateFilter object
  if (endDate) dateFilter.$lte = new Date(endDate); //This means that only documents with dates less than or equal to endDate will match.

  const matchStage = { status: "Success" };//gets all the orders that has a status of success to be later display in sales report
  if (startDate || endDate) {
    matchStage.date = dateFilter;
  }//. If true, it adds a date property to matchStage, with the value set to dateFilter. This ensures that the date range filter is applied only when at least one date is provided.

  //$match:matchStage gets all items that has status success
  //unwind produtcs will decompose the array of products item list to specific items
  //addFields convert the products.productID to an object id later to be use on lookup
  //lookup join orderTransaction with products to get product list detail
  //unwind again the product details from the lookup cause it is an array containing details of product from productdb
  //group it in a way that it gets _id, productName, totalStales by sum of orderquantity , totalSalesAmoung by summation of total Price 
  //$project is to specify how many to be add (instance of one product each)
  try {
    const result = await orderTransaction.aggregate([
      { $match: matchStage },
      { $unwind: "$products" },
      {
        $addFields: {
          productIDAsOID: { $toObjectId: "$products.productID" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productIDAsOID",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$products.productID",
          productName: { $first: "$productDetails.name" },
          totalSalesQuantity: { $sum: "$products.orderQuantity" },
          totalSalesAmount: { $sum: "$products.totalPrice" },
          productImage: { $first: "$productDetails.image" }, // Include the image URL
        },
      },
      {
        $project: {
          _id: 0,
          productID: "$_id",
          productName: 1,
          totalSalesQuantity: 1,
          totalSalesAmount: 1,
          productImage: 1, // Include the image URL in the projection
        },
      },
      { $sort: { productName: 1 } },
    ]);

    res.send(result);
  } catch (error) {
    console.error("Error generating sales report:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3001, function () {
  console.log("server is running on port 3001");
});
