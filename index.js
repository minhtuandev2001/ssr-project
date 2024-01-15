const express = require('express')
const app = express()
const port = 4000
const route = require("./routers/client/index.route")

app.set('views', "./views")
app.set("view engine", "pug")

// Routes
route(app)

app.listen(port, () => {
  console.log('listening on port', port)
})