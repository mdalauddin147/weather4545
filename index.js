const express = require('express')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const connectDB = require('./db.js')
const {adminAuth, userAuth} = require('./middleware/auth.js')

const app = express()
app.set("view engine", "ejs")

PORT = process.env.PORT 

//connecting the database
connectDB()

app.use(express.json())
app.use(express.static('public'))

app.use(cookieParser())

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/admin", adminAuth, (req, res) => {
    res.render("admin")
})

app.get("/basic", userAuth, (req, res) => {
    res.render("index", {
        username: res.locals.userData.username,
        defaultlocation: res.locals.userData.defaultlocation
    })
})

app.get("/logout", (req, res) => {
    res.cookie("jwt", "", {maxAge: "1"})
    res.redirect("/")
})

app.use("/api/auth", require("./auth/route"))

app.listen( PORT, () => console.log(`Server connected to port ${PORT}`))

//Handling Error
process.on("unhandledRejection", err => {
    console.log(`An error occured: ${err.message}`)
    ServiceWorkerRegistration.close(() => process.exit(1))
})