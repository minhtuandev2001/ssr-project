const express = require("express")
const router = express.Router()
const multer = require('multer')
const fileUpload = multer()
const uploadCloudMiddleware = require("../../middlewares/admin/uploadCloud.middleware")
const accountsController = require("../../controllers/admin/accounts.controller")
const accountsValidate = require("../../validates/admin/accounts.validate")

router.get("/", accountsController.index)
router.get("/create", accountsController.create)
router.post(
  "/create",
  fileUpload.single('avatar'),
  uploadCloudMiddleware.uploadCloud,
  accountsValidate.createPost,
  accountsController.createPost)

module.exports = router