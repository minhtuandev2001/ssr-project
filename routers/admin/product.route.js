const express = require('express')
const router = express.Router()
const multer = require('multer')
const storageMulter = require('../../utils/storageMulter')
const upload = multer({ storage: storageMulter() })

const productController = require("../../controllers/admin/product.controller")

router.get('/', productController.index)
router.patch('/change-status/:status/:id', productController.changeStatus)
router.patch('/change-multi', productController.changeMultiStatus)
router.delete('/delete/:id', productController.deleteProduct)
router.get('/create', productController.create)
router.post('/create', upload.single('thumbnail'), productController.createPost)

module.exports = router