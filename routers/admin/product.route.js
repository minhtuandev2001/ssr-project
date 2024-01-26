const express = require('express')
const router = express.Router()
const multer = require('multer')
const storageMulter = require('../../utils/storageMulter')
const upload = multer({ storage: storageMulter() })

const productController = require("../../controllers/admin/product.controller")
const productValidate = require("../../validates/admin/product.validate")

router.get('/', productController.index)

router.patch('/change-status/:status/:id', productController.changeStatus)

router.patch('/change-multi', productController.changeMultiStatus)

router.delete('/delete/:id', productController.deleteProduct)

router.get('/create', productController.create)
router.post(
  '/create',
  upload.single('thumbnail'),
  productValidate.createPost,
  productController.createPost
)

router.get('/edit/:id', productController.edit)
router.patch(
  '/edit/:id',
  upload.single('thumbnail'),
  productValidate.createPost, // logic validate của tạo mới và cập nhật sản phẩm thì giống nhau
  productController.editPatch)

module.exports = router