import express from "express"; //route and api
import mongoose from "mongoose"; //connector to db and use related to mongodb functions
import cors from "cors"; //cross server to connect backend port 3001 to frontend port 3000
import bodyParser from "body-parser"; //make a json available for requests body
import multer from "multer"; // uploading files
import path from "path"; //directory find path of file
const app = express(); // instance of express using app
import {
  addProduct,
  productList,
  removeProduct,
} from "../src/controllers/productcontroller.js";
import {
  deleteUser,
  updatePassword,
  updateUser,
  userList,
  updateEmail,
} from "../src/controllers/userscontroller.js";
import {
  createOrder,
  confirmOrder,
  declineOrder,
  getOrder,
  salesReport,
  cancelOrder,
} from "../src/controllers/transactioncontroller.js";
import {
  addToCart,
  removeItem,
  removeAll,
  showCart,
} from "../src/controllers/shoppingcartcontroller.js";

import { logIn, signup, token } from "../src/controllers/authcontroller.js";

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage }); //later be use for upload

app.use(cors()); // middleware allows the server to respond to requests from a different origin (domain, protocol, or port) than the one it's hosted on.

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
}); // similar to cors just the expanded version

await mongoose.connect(
  "mongodb+srv://elcartedave:cmsc100@cluster0.o6ffaeb.mongodb.net/"
);

//uploads the image of the product, construction of url where the file is accessible
app.post("/upload", upload.single("product"), function (req, res) {
  res.json({
    success: 1,
    image_url: `http://localhost:3001/images/${req.file.filename}`,
  });
});

// app.use("/images", express.static(path.join(__dirname, "./upload/images"))); //use images that in the directory of upload it contains all images used in the program
app.use("/images", express.static("upload/images"));

//user routes
app.get("/userlist", userList);
app.post("/userlist", deleteUser);
app.post("/updatePassword", updatePassword);
app.post("/updateUser", updateUser);
app.post("/updateEmail", updateEmail);

//authentication
app.post("/signup", signup);
app.post("/login", logIn);
app.post("/token", token);

//admin product management
app.post("/addproduct", addProduct);
app.post("/removeProduct", removeProduct);
app.get("/productlist", productList);

//transaction routes
app.post("/createOrder", createOrder);
app.get("/createOrder", getOrder);
app.post("/confirmOrder", confirmOrder);
app.post("/declineOrder", declineOrder);
app.get("/salesreport", salesReport);
app.post("/cancelOrder", cancelOrder);

//shopping cart routes
app.post("/shoppingcart", addToCart);
app.get("/shoppingcart", showCart);
app.post("/removeitem", removeItem);
app.post("/removeAllItems", removeAll);

app.listen(3001, function () {
  console.log("server is running on port 3001");
});
