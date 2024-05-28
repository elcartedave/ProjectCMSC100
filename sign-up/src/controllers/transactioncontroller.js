import { Product } from "../models/product.js";
import { SCS } from "../models/shoppingcart.js";
import { orderTransaction } from "../models/transaction.js";

//createOrder, gets all necessary request body that will later be saved in the database/collection document this is use as a checkout for
//items in shopping cart -USER SIDe
export const createOrder = async function (req, res) {
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
};

//use to change the status by finding the transaction id (_id) to Success/ it also updates the quantity of product shown in user side
export const confirmOrder = async function (req, res) {
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
};

//if the admin declines the checkout this is where the status going to be canceled
// same use of transaction id (_id) also the products quantity will remain as is
export const declineOrder = async function (req, res) {
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
};

//gets all the orders in checkout (collection: transaction) that has a status of pending
export const getOrder = async function (req, res) {
  const result = await orderTransaction.find({});
  res.send(result);
};

export const salesReport = async function (req, res) {
  const { startDate, endDate } = req.query; //get the startDate and endDate

  const dateFilter = {}; //empty object later hold the documents within specified date range
  if (startDate) dateFilter.$gte = new Date(startDate); //This means that only documents with dates greater than or equal to startDate will match. will go on the dateFilter object
  if (endDate) dateFilter.$lte = new Date(endDate); //This means that only documents with dates less than or equal to endDate will match.

  const matchStage = { status: "Success" }; //gets all the orders that has a status of success to be later display in sales report
  if (startDate || endDate) {
    matchStage.date = dateFilter;
  } //. If true, it adds a date property to matchStage, with the value set to dateFilter. This ensures that the date range filter is applied only when at least one date is provided.

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
};
