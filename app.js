require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const auth = require("./routes/auth");

mongoose.connect("mongodb://localhost:27017/auth")

app.get("/",(req,res)=>{
    res.send("Welcome");
})

app.use(express.json());
app.use("/auth",auth);





app.listen(5000,(err)=>{
    if(err){
        res.send(err);
    }else{
        console.log("Listening To Port 5000");
    }
})