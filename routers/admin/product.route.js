const express = require('express')
const router = express.Router()
const multer = require('multer')
const uploadCloudMiddleware = require("../../middlewares/admin/uploadCloud.middleware")

const fileUpload = multer()

const productController = require("../../controllers/admin/product.controller")
const productValidate = require("../../validates/admin/product.validate")

router.get('/', productController.index)

router.patch('/change-status/:status/:id', productController.changeStatus)

router.patch('/change-multi', productController.changeMultiStatus)

router.delete('/delete/:id', productController.deleteProduct)

router.get('/create', productController.create)
router.post(
  '/create',
  fileUpload.single('thumbnail'),
  uploadCloudMiddleware.uploadCloud,
  productValidate.createPost,
  productController.createPost
)

router.get('/edit/:id', productController.edit)
router.patch(
  '/edit/:id',
  fileUpload.single('thumbnail'),
  productValidate.createPost, // logic validate của tạo mới và cập nhật sản phẩm thì giống nhau
  productController.editPatch)

router.get('/detail/:id', productController.detail)

module.exports = router