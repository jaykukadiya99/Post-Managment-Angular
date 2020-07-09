const express = require('express');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require('../models/userModel');

router.post('/', async(req, res, next) => {
    const hashPass = bcryptjs.hashSync(req.body.password, 10);
    const newUser = new userModel({
        email: req.body.email,
        password: hashPass
    });

    try {
        const result = await newUser.save();
        res.status(201).json({
            message: "new user added",
            result: result
        });
    } catch (error) {
        res.status(500).json({
            message: "error add user",
            result: error
        });
    }
});

router.post('/login', async(req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }
        if (!await bcryptjs.compare(req.body.password, user.password)) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        } else {
            const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWTKEY, { expiresIn: '1h' });
            res.status(200).json({
                token: token,
                expiresIn: "3600",
                userId: user._id,
            })
        }

    } catch (error) {

    }
});

module.exports = router