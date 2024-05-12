import express from 'express';
import mongoose from "mongoose";
import validator from 'validator';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json()); //this use as converting format info in json data
await mongoose.connect('mongodb+srv://sadiares1:hKgPfm6gaefBBSm1@cluster0.namen2s.mongodb.net/ICS');

//create model
const userDataSchema = {
    firstName: String,
    lastName: String,
    userType: String,
    email: String,
    password: String
}

const signUp = mongoose.model("userData", userDataSchema);


//app post
app.post("/signup", async function(req, res){
    var empty = "";
    var merchant = "merchant";
    var customer = "customer";
    if(req.body.firstName != empty && req.body.lastName != empty && req.body.userType != empty && req.body.password != empty && req.body.email != empty){
        let ut = req.body.userType.toLowerCase();
        if((ut == merchant || ut == customer) && validator.isEmail(req.body.email)){
            let newsignUP = new signUp({
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



app.listen(3001, function(){
    console.log("server is running");
})