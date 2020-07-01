const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");

const { User, validate } = require("../models/user");

const router = express.Router();

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User Already Registered");

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);


    try {
        user = await user.save();
    } catch (error) {
        console.log(error);
    }

    /*
        Optional - res.send(_.pick(user, ['name', 'email']));
        - If we want to give access to user immidiately when he register
        - We should pass auth token in the repsonse header
        - Custom header should start with x-____________
    */
    const token = user.generateAuthToken()
    res.header('x-auth_token', token).send(_.pick(user, ['name', 'email']))
});

module.exports = router