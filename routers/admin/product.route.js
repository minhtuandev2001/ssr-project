const express = require('express')
const router = express.Router()
const productController = require("../../controllers/admin/product.controller")

router.get('/', productController.index)

module.exports = router