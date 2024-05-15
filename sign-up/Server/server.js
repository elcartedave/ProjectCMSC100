import express from 'express';
import mongoose from "mongoose";
import validator from 'validator';
import cors from 'cors'


const app = express();

app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json()); //this use as converting format info in json data
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
  });
await mongoose.connect('mongodb+srv://sadiares1:hKgPfm6gaefBBSm1@cluster0.namen2s.mongodb.net/ICS');

//create model
const userDataSchema = {
    firstName: String,
    lastName: String,
    userType: String,
    email: String,
    password: String
}

const User = mongoose.model("userData", userDataSchema, "userData");

//app get
app.get("/userlist", async function(req,res){
    const result = await User.find({});
    res.send(result);
});

//app delete
app.post('/userlist', async function(req,res){
    const {id} = req.body;
    try {
        await User.findByIdAndDelete(id);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).send('Error deleting user: ' + error.message);
    }
});


//app post
app.post("/signup", async function(req, res){
    var empty = "";
    var merchant = "merchant";
    var customer = "customer";
    if(req.body.firstName != empty && req.body.lastName != empty && req.body.userType != empty && req.body.password != empty && req.body.email != empty){
        let ut = req.body.userType.toLowerCase();
        if((ut == merchant || ut == customer) && validator.isEmail(req.body.email)){
            let newsignUP = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userType: req.body.userType.toLowerCase(),
                email: req.body.email,
                password: req.body.password
            });
            await newsignUP.save()
                .then(()=>{
                    res.send("Account created successfully");
                })
                .catch((err)=>{
                    res.status(500).send("Error creating account: " + err.message);
                });
        }else{
        res.status(400).send("Invalid data provided");
        }
    }
    else{
        res.status(400).send("Incomplete data provided");
    }
});

const ProductDataSchema = {
    productName : String,
    productType : String,
    productPrice : Number,
    productDescription : String,
    productQuantity : Number
}

const ProductL = mongoose.model("productList", ProductDataSchema, "productList");

app.get("/productlist", async function(req,res){
    const result = await ProductL.find({});
    res.send(result);
});

app.listen(3001, function(){
    console.log("server is running");
})