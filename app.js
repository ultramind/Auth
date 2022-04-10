//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// encrpting the DB
// var encrypt = require('mongoose-encryption');
const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;


// middleware
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

// getting the value of the dotenv file
console.log(process.env.API_KEY);

// connecting the mongoose DB
mongoose.connect("mongodb://localhost:27017/userDB");

// creating the userSchema
const userSchema = new mongoose.Schema({
    email:String,
    password: String
});

// userSchema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields: ["password"]});

// creating the Model
const User = mongoose.model("user", userSchema);


// creating the routes
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register",function (req, res) {
    const email = req.body.username;
    const password = req.body.password;

    // hasing using bcrypt
    bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
        // Store hash in your password DB.
        const newUser = new User({
            email: email,
            password:hashedPassword
        });
        newUser.save(function (err) {
            if (!err) {
                res.render("secrets");
            }else{
                console.log(err);
            }
        });
    });
});

app.post("/login", function (req, res) {
    const email = req.body.username;
    const password = req.body.password;
    // check if user exit
    User.findOne({email: email}, function (err, foundUser) {
        if (!err) {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    // result == true
                    if (result === true) {
                        res.render("secrets");
                    }
                });
                
            }
        }
    })
})


app.listen(3000, function () {
    console.log("Server running on port 3000...");
});
