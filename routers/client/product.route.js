const express = require("express")
const router = express.Router();
const productController = require("../../controllers/client/products/product.controller")

router.get('/', productController.index)
router.get('/create', (req, res) => {
  res.render('client/pages/products/index')
})
router.get('/edit', (req, res) => {
  res.render('client/pages/products/index')
})

module.exports = router;