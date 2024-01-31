const express = require('express')
const path = require('path');
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const methodOverride = require('method-override')
require('dotenv').config()

const route = require("./routers/client/index.route");
const routeAdmin = require("./routers/admin/index.route");
const connectDB = require('./config/db')
const systemConfig = require("./config/system")

// // connect db
connectDB()

const app = express()
const port = process.env.PORT || 3000

app.set('views', `${__dirname}/views`)
app.set("view engine", "pug")

// App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(methodOverride('_method')) // ghi đè method
app.use(express.static(`${__dirname}/public`))
app.use(express.json())
app.use(express.urlencoded())
// app.use(cookieParser('minh  tuan'))
app.use(session({
  secret: 'minhtuan',
  cookie: { maxAge: 60000 }
}))
app.use(flash())
// tinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// end tinyMCE 

// Routes
route(app)
routeAdmin(app)

app.listen(port, () => {
  console.log('listening on port', port)
})