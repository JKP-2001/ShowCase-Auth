require("dotenv").config();    // to extracting our secrets from the .env file

const express = require("express");         // web framework fot Node js
const mongoose = require("mongoose");           // to interacting with our DataBase 
const app = express();
mongoose.connect("mongodb://localhost:27017/auth")


const auth = require("./routes/auth"); 

app.get("/",(req,res)=>{
    res.send("Welcome");
})


var cors = require('cors')    // Cross-Origin Resource Sharing

const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}


app.use(cors(corsOptions))

app.use(express.json());             // parse the incoming requests with JSON payload.
app.use("/auth",auth);





app.listen(5000,(err)=>{
    if(err){
        res.send(err);
    }else{
        console.log("Listening To Port 5000");
    }
})