const express = require("express")
const router = express.Router()
const multer = require('multer')
const fileUpload = multer()

const categoryController = require("../../controllers/admin/product-category.controller")
// middleware
const uploadCloudMiddleware = require("../../middlewares/admin/uploadCloud.middleware")
// validate
const productCategoryValidate = require("../../validates/admin/product-category.validate")
router.get('', categoryController.index)
router.get('/create', categoryController.create)
router.post(
  '/create',
  fileUpload.single('thumbnail'),
  uploadCloudMiddleware.uploadCloud,
  productCategoryValidate.createPost,
  categoryController.createPost
)

module.exports = router