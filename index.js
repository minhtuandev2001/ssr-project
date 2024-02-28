const express = require('express')
const path = require('path');
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const methodOverride = require('method-override')
require('dotenv').config()
const moment = require("moment")

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
app.locals.moment = moment

app.use(methodOverride('_method')) // ghi đè method
app.use(express.static(`${__dirname}/public`))
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser()) // 1
app.use(session({ // 2 
  secret: 'minhtuan',
  cookie: { maxAge: 60000 }
}))
app.use(flash()) // để sử dụng được thì phải có 1,2
// tinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// end tinyMCE 

// Routes
route(app)
routeAdmin(app)
app.get("*", (req, res) => {
  res.render('client/pages/errors/404', {
    titlePage: '404 NOT FOUND'
  })
})

app.listen(port, () => {
  console.log('listening on port', port)
})