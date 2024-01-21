const express = require('express')
var methodOverride = require('method-override')
require('dotenv').config()

const route = require("./routers/client/index.route");
const routeAdmin = require("./routers/admin/index.route");
const connectDB = require('./config/db')
const systemConfig = require("./config/system")

// // connect db
connectDB()

const app = express()
const port = process.env.PORT || 3000

app.set('views', "./views")
app.set("view engine", "pug")

// App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(methodOverride('_method')) // ghi đè method
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded())
// Routes
route(app)
routeAdmin(app)

app.listen(port, () => {
  console.log('listening on port', port)
})