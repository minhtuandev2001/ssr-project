const express = require("express")
const router = express.Router()

const cartController = require("../../controllers/client/cart.controller")

router.post("/add/:id", cartController.addPost)

module.exports = router