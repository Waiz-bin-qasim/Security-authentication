const bcrypt = require('bcrypt') //to apply hashing and salting function called bcrypt
const express = require('express')
const bodyparser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const app = express()
const port = 3000
const saltRounds = 10;
app.use(express.static("public"))
app.set("engine view", 'ejs')
app.use(bodyparser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/auth')
const schema = new mongoose.Schema({
    email: String,
    password: String
})
const Account = mongoose.model("account", schema);

app.get("/", (req, res) => {
    res.render(__dirname + "/views/home.ejs");
})
app.get("/login", (req, res) => {
    res.render(__dirname + "/views/login.ejs");
})
app.get("/register", (req, res) => {
    res.render(__dirname + "/views/register.ejs");
})

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) { //->applying hashing and salting function to password
        const user = new Account({
            email: req.body.username,
            password: hash
        })
        user.save((err) => {
            if (err) {
                res.send(err);
            } else {
                res.render(__dirname + "/views/secrets.ejs")
            }
        })
    });
})
app.post('/login', (req, res) => {
    Account.findOne({
        email: req.body.username,
    }, (err, result) => {
        if (!err) {
            bcrypt.compare(req.body.password, result.password, function(err, resu) { // checking the both salted hashed password are same or not
                if (resu == true) {
                    res.render(__dirname + '/views/secrets.ejs');
                } else {
                    res.render(__dirname + '/views/login.ejs')
                }
            });
        } else {
            res.send(err);
        }
    })
})

app.listen(port, () => console.log(
    console.log("server started")
))