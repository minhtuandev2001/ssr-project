const express = require("express")
const router = express.Router();
const productController = require("../../controllers/client/products/product.controller")

router.get('/', productController.index)

router.get('/:slugCategory', productController.category)

router.get('/detail/:slugProduct', productController.detail)

module.exports = router;