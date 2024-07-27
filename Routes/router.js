

// const express = require("express");
// const router = new express.Router();
// const users = require("../models/userSchema");
// const nodemailer = require("nodemailer");

// // email config
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASS
//     }
// });


// //register user details
// router.post("/register", async (req, res) => {
//     const { fname, lname, email, mobile, message } = req.body;

//     if (!fname || !lname || !email || !mobile) {
//         res.status(401).json({ status: 401, error: "All Input require" })
//     }

//     try {
//         const preuser = await users.findOne({ email: email });

//         if (preuser) {
//             const userMessage = await preuser.Messagesave(message);
//             console.log(userMessage);
//             const mailOptions = {
//                 from: process.env.EMAIL,
//                 to: email,
//                 subject: "sending email using nodejs",
//                 text: "Your Response Has Been Submitted"
//             }

//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.log("error" + error)
//                 } else {
//                     console.log("Email sent" + info.response);
//                     res.status(201).json({ status: 201, message: "Email sent SUccesfully" })
//                 }
//             });
//         } else {
//             const finalUser = new users({
//                 fname, lname, email, mobile, messages: { message: message }
//             });

//             const storeData = await finalUser.save();

//             const mailOptions = {
//                 from: process.env.EMAIL,
//                 to: email,
//                 subject: "sending email using nodejs",
//                 text: "Your Response Has Been Submitted"
//             }

//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.log("error" + error)
//                 } else {
//                     console.log("Email sent" + info.response);
//                     res.status(201).json({ status: 201, message: "Email sent SUccesfully" })
//                 }
//             });
//             res.status(201).json({ status: 201, storeData })
//         }

//     } catch (error) {
//         res.status(401).json({ status: 401, error: "All Input require" });
//         console.log("catch error")
//     }

// })



// module.exports = router;

const express = require('express');
const router = new express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');

// Initialize Passport
require('../passportConfig');
router.use(passport.initialize());
router.use(passport.session());

// Register Route
router.post('/register', async (req, res) => {
    const { fname, lname, email, password, mobile, message } = req.body;

    if (!fname || !lname || !email || !password || !mobile) {
        return res.status(400).json({ error: "All Input required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fname, lname, email, password: hashedPassword, mobile, messages: { message: message }
        });

        const savedUser = await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Login Route
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: "Logged in successfully" });
});

module.exports = router;
