//jshint esversion:6
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// encrpting the DB
var encrypt = require('mongoose-encryption');

// middleware
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

// connecting the mongoose DB
mongoose.connect("mongodb://localhost:27017/userDB");

// creating the userSchema
const userSchema = new mongoose.Schema({
    email:String,
    password: String
});

const secret = "This is my little secret.";
userSchema.plugin(encrypt, {secret : secret, encryptedFields: ["password"]});

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

    const newUser = new User({
        email: email,
        password:password
    });
    newUser.save(function (err) {
        if (!err) {
            res.render("secrets");
        }else{
            console.log(err);
        }
    });
});

app.post("/login", function (req, res) {
    const email = req.body.username;
    const password = req.body.password;
    // check if user exit
    User.findOne({email: email}, function (err, foundUser) {
        if (!err) {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    })
})


app.listen(3000, function () {
    console.log("Server running on port 3000...");
});
