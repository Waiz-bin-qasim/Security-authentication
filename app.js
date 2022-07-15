const md5 = require('md5') //to apply hashing function called md5
const express = require('express')
const bodyparser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const app = express()
const port = 3000
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
    const user = new Account({
        email: req.body.username,
        password: md5(req.body.password) //->applying hashing function to password 
    })
    user.save((err) => {
        if (err) {
            res.send(err);
        } else {
            res.render(__dirname + "/views/secrets.ejs")
        }
    })
})
app.post('/login', (req, res) => {
    Account.findOne({
        email: req.body.username,
    }, (err, result) => {
        if (!err) {
            if (result.password === md5(req.body.password)) { //->applying hashing function to the password to match both of them 
                res.render(__dirname + "/views/secrets.ejs");
            } else {
                console.log()
                res.redirect("/login");
            }
        } else {
            res.send(err);
        }
    })
})

app.listen(port, () => console.log(
    console.log("server started")
))