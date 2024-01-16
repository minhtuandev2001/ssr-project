const express = require('express')
const mongoose = require("mongoose")
require('dotenv').config()

const route = require("./routers/client/index.route");
const connectDB = require('./config/db')

// // connect db
connectDB()

const app = express()
const port = process.env.PORT || 3000

app.set('views', "./views")
app.set("view engine", "pug")

app.use(express.static("public"))

// Routes
route(app)

app.listen(port, () => {
  console.log('listening on port', port)
})