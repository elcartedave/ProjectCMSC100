import { SCS } from "../models/shoppingcart.js";

// post for shopping cart it gets the productID fk from products._id userID fk from Users and product Quantity
export const addToCart = async function (req, res) {
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
};

//if user wants to remove an item from the cart it needs the product id and user id
export const removeItem = async (req, res) => {
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
};

//remove all items in the shopping cart after checkout , gets userId then delete all items in shopping cart db with the same user id
export const removeAll = async (req, res) => {
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
};

//used for display, use of aggregate function similar to join
//match - find all with same user id
//addFields - convert the product id(currently string ) to a objectid
//lookup - where will it join from(which foreign collection), localField(which part of the SCS), foreignField(which key attribute to join)
//as is what will the join table called
//unwind - used for decomposing of array
//group - used for what data after the decomposition of array will be displayed (selection of attributes to display)
export const showCart = async function (req, res) {
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
};
