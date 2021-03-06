require("dotenv").config();  // help to access the secret from .env file

const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");   // Use to interact with mongodb

const bcrypt = require("bcrypt");   // Help to hash the password
const saltRound = 10;    // Salt rounds are use to implement hash rounds multiple time.

const User = require("../models/UserModel");    // importing user model 
const fetchUser = require("../middleware/fetchuser");

const { body, validationResult } = require('express-validator'); // It helps to validate you requirements

router.post("/createuser",
    [
        body('name', 'Name: Min Length 3').isLength({ min: 3 }),    // Validations
        body('email', 'Invalid Email').isEmail(),
        body('password', 'Password: Min Length 8').isLength({ min: 8 }),
    ],
    async (req, res) => {

        const { name, email, password } = req.body;

        try {
            const user = await User.findOne({ email: email });    // await is used beause : *findOne* returns a promise
            if (user) {    // Email id already registered.
                res.status(409).send({ error: "User Already Registered" });
            }

            else {
                //Now we need to hash the user's password
                bcrypt.hash(password, saltRound, async (err, hash) => {
                    if (err) {
                        res.status(401).send(err);
                        console.log(err);
                    }
                    else {
                        const newUser = await User.create({    // If there is no error then, we stored the password in the form of hash 
                            name: name,      
                            email: email,
                            password: hash
                        })
                        res.status(200).send({ success: newUser })    // response on success
                    }
                })
            }

        } catch (err) {
            res.status(400).send({ err });
            console.log(err);
        }

    })



router.post("/login", [
    body('email', 'Invalid Email').isEmail(),                 // Validations
    body('password', 'Password: Min Length 8').isLength({ min: 8 }),
], async (req, res) => {             // async callback function

    const { email, password } = req.body;           // deserialize data from request.body

    try {
        const user = await User.findOne({ email });          // finding the user in the DB
        if (!user) { 
            res.status(404).send("User Not Found");      // If user doesn't exsists.
        } else {
            bcrypt.compare(password, user.password, (err, same) => {     // If user exists, then we compare the password entered and stored in the db
                if (err) {
                    res.status(400).send({ err });
                    console.log(err);              
                }
                else if (!same) {
                    res.status(401).send("Incorrect Email or Password"); // If password not matched.
                }
                else {
                    res.status(200).send({ success:"Success" });       // If password matched.
                }
            })
        }
    } catch (err) {
        res.status(400).send({ err });
        console.log(err);
    }
})



router.patch("/changepassword", [
    body('password', 'Password: Min Length 8').isLength({ min: 8 }),               // Validations
], fetchUser, async (req, res) => {

    const user = req.user;
    const {password} = req.body;
    
    try{
        bcrypt.hash(password,saltRound, async (err,hash)=>{
            if(err){
                res.status(400).send({ err });
                console.log(err);
            }else{
                const editUser = await User.findByIdAndUpdate(user._id,{
                    password: hash,
                })
                res.status(200).send({success:"Password changed successfully"});
            }
        })
    }catch(err){
        res.status(400).send({ err });
        console.log(err);
    }
})


module.exports = router;