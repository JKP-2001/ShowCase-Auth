require("dotenv").config();

const mogoose = require("mongoose");
const User = require("../models/UserModel");

const fetchUser = async (req, res, next) => {
    const email = req.header("user");
    // console.log({"email":email})
    try {

        if (!email) {
            res.status(404).send("Logged In First");
        }
        else {
            const user = await User.findOne({ email: email });
            if (!user) {
                res.status(401).send("User Not Found");
            }
            else{
                req.user = user;
                next();
            }
        }
    }catch(err){
        console.log(err);
    }
}


module.exports = fetchUser;