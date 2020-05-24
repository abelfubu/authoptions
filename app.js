//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/authDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
}); 



const User = new mongoose.model("User", userSchema);


app.get('/', (req, res) => {
    res.render("home")
});

app.get('/login', (req, res) => {
    res.render("login")
});

app.post('/login', (req, res) => {
    let email = req.body.username;
    let password = req.body.password;

    User.findOne({email: email}, (err, foundUser) => {
        if (err) {
            console.log(err);            
        } else {
            if(foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result){
                    if (result === true) {
                        res.render("secrets");
                    }                    
                });                             
            } 
        }
    })
});

app.get('/register', (req, res) => {
    res.render("register")
});

app.post('/register', (req, res) => {
    let email = req.body.username;
    let password = req.body.password;

    bcrypt.hash(password, saltRounds, function(err, hash){
        const newUSer = new User ({
            email: email,
            password: hash
        });
    
        newUSer.save((err) =>{
            if (!err) {
                res.render("secrets");
            } else {
                console.log(err);            
            }
        });
    });
    
});

app.listen(4000, () => {
    console.log('App listening on port 4000!');
});