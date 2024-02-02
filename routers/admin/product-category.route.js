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
router.delete('/delete/:id', categoryController.deleteProductCategory)
router.get('/detail/:id', categoryController.detail)

router.get('/edit/:id', categoryController.edit)
router.patch(
  '/edit/:id',
  fileUpload.single('thumbnail'),
  uploadCloudMiddleware.uploadCloud,
  categoryController.editPatch)

router.patch('/change-multi', categoryController.changeMulti)
router.patch('/change-status/:status/:id', categoryController.changeStatus)

module.exports = router