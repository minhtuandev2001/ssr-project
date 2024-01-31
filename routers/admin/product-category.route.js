const express = require("express")
const router = express.Router()
const categoryController = require("../../controllers/admin/product-category.controller")

router.get('', categoryController.index)

module.exports = router