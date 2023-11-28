const express = require('express')

const connectDB = require('./db')

const app = express()
app.use(express.json())

PORT = 8080

//connecting the database
connectDB()

app.use("/api/auth", require("./auth/route"))

app.listen( PORT, () => console.log(`Server connected to port ${PORT}`))

//Handling Error
process.on("unhandledRejection", err => {
    console.log(`An error occured: ${err.message}`)
    ServiceWorkerRegistration.close(() => process.exit(1))
})