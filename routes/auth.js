const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");

const { User, validate } = require("../models/user");

const router = express.Router();


router.post("/", async (req, res) => {
    //Checking If the request is valid or not
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking If there is any user exist using same email
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid Username or Password");

    //It will be comparing the password by hashing + salting <---> Hashed Version with the user.password
    const isValid = await bcrypt.compare(req.body.password, user.password) 
    if(!isValid) return res.status(400).send("Invalid Username or Password");

    const token  = user.generateAuthToken()
    res.send(token)
});

/*
    #Log-Out
    - We have to delete the auth Token from the client side
    - There is no connection of that from frontend, As we are not storing the token to anywhere
    - We shouldnt store token on database, If the hacker hacks database, and get all the token
*/

module.exports = router